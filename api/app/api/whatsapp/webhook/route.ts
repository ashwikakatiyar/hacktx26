import { query } from "@/lib/db";
import { verifySignature, sendText } from "@/lib/whatsapp";
import { handleMessage, type WaMessage } from "@/lib/whatsappBot";

export const runtime = "nodejs";
export const maxDuration = 60;

// Meta calls this once when you save the webhook URL in the app dashboard.
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const expected = process.env.WHATSAPP_VERIFY_TOKEN;
  if (
    expected &&
    p.get("hub.mode") === "subscribe" &&
    p.get("hub.verify_token") === expected
  )
    return new Response(p.get("hub.challenge") ?? "", { status: 200 });
  return new Response("forbidden", { status: 403 });
}

async function processMessage(m: WaMessage) {
  // Meta retries slow or failed deliveries; handle each message id once.
  const fresh = await query(
    "INSERT INTO whatsapp_messages(wamid) VALUES($1) ON CONFLICT DO NOTHING RETURNING wamid",
    [m.id],
  );
  if (!fresh.length) return;
  try {
    await handleMessage(m);
  } catch (e) {
    console.error("[whatsapp] handler failed:", e);
    await sendText(m.from, "Oops, something went wrong on my side. Try again in a moment. 🧚").catch(() => {});
  }
}

// Meta wants a fast 200, so we reply immediately and do the Gemini/SerpApi work in the background.
// (Fine on your Vultr PM2 server; on a serverless host use next/server `after()` instead.)
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-hub-signature-256")))
    return new Response("bad signature", { status: 401 });
  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response("bad json", { status: 400 });
  }
  const messages: WaMessage[] = (body?.entry ?? []).flatMap((e: any) =>
    (e?.changes ?? []).flatMap((c: any) => c?.value?.messages ?? []),
  );
  for (const m of messages) void processMessage(m);
  return new Response("ok", { status: 200 });
}
