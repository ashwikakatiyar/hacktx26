// WhatsApp Business Cloud API client: signature check, sending, media download.
// Set WHATSAPP_DRY_RUN=1 to log outgoing messages instead of calling Meta (local testing).
import crypto from "node:crypto";

const GRAPH = `https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_VERSION || "v21.0"}`;

export type Choice = { id: string; title: string };

export const digits = (s: string) => s.replace(/\D/g, "");

// Meta signs the raw body with the app secret: X-Hub-Signature-256 = "sha256=<hex hmac>".
export function verifySignature(raw: string, header: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production"; // allow unsigned only in dev
  if (!header?.startsWith("sha256=")) return false;
  const expected = crypto.createHmac("sha256", secret).update(raw).digest();
  const got = Buffer.from(header.slice(7), "hex");
  return got.length === expected.length && crypto.timingSafeEqual(got, expected);
}

async function send(to: string, payload: Record<string, unknown>) {
  const body = { messaging_product: "whatsapp", to, ...payload };
  if (process.env.WHATSAPP_DRY_RUN === "1") {
    console.log("[whatsapp dry-run] ->", to, JSON.stringify(payload));
    return;
  }
  const id = process.env.WHATSAPP_PHONE_ID;
  const token = process.env.WHATSAPP_TOKEN;
  if (!id || !token) throw new Error("WHATSAPP_PHONE_ID / WHATSAPP_TOKEN not set");
  const r = await fetch(`${GRAPH}/${id}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!r.ok)
    throw new Error(`whatsapp send ${r.status}: ${(await r.text()).slice(0, 300)}`);
}

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

export const sendText = (to: string, text: string) =>
  send(to, { type: "text", text: { body: clip(text, 4000) } });

// WhatsApp allows at most 3 reply buttons (title <= 20 chars) or a list of up to 10 rows (title <= 24).
export function sendChoices(to: string, body: string, choices: Choice[], listLabel = "Choose") {
  if (choices.length <= 3) {
    return send(to, {
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: clip(body, 1024) },
        action: {
          buttons: choices.map((c) => ({
            type: "reply",
            reply: { id: c.id.slice(0, 256), title: clip(c.title, 20) },
          })),
        },
      },
    });
  }
  return send(to, {
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: clip(body, 1024) },
      action: {
        button: clip(listLabel, 20),
        sections: [
          {
            title: "Options",
            rows: choices.slice(0, 10).map((c) => ({
              id: c.id.slice(0, 200),
              title: clip(c.title, 24),
            })),
          },
        ],
      },
    },
  });
}

// Screenshot sent to the bot -> data URL the Gemini step already understands.
export async function downloadMedia(mediaId: string): Promise<{ dataUrl: string; mime: string }> {
  const token = process.env.WHATSAPP_TOKEN;
  if (!token) throw new Error("WHATSAPP_TOKEN not set");
  const auth = { Authorization: `Bearer ${token}` };
  const meta = await fetch(`${GRAPH}/${mediaId}`, { headers: auth, signal: AbortSignal.timeout(15_000) });
  if (!meta.ok) throw new Error(`whatsapp media lookup ${meta.status}`);
  const { url, mime_type } = (await meta.json()) as { url: string; mime_type?: string };
  const file = await fetch(url, { headers: auth, signal: AbortSignal.timeout(20_000) });
  if (!file.ok) throw new Error(`whatsapp media download ${file.status}`);
  const mime = mime_type || file.headers.get("content-type") || "image/jpeg";
  const buf = Buffer.from(await file.arrayBuffer());
  return { dataUrl: `data:${mime};base64,${buf.toString("base64")}`, mime };
}
