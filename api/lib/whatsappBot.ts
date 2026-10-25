// The WhatsApp bot. Talks to the same Postgres and the same route logic as the Expo app.
// Button ids are stateless:  share:<cardId>:<groupId> | plan:<groupId> | confirm:<eventId> | later
import { query } from "./db";
import { buildCard } from "./pipeline";
import { getCard, insertCard, shareCard } from "./cards";
import { member } from "./phase2";
import { classifyText } from "./intent";
import { digits, downloadMedia, sendChoices, sendText } from "./whatsapp";
import { POST as planRoute } from "@/app/api/groups/[id]/plan/route";
import { POST as confirmRoute } from "@/app/api/events/[id]/confirm/route";

export type WaMessage = {
  id: string;
  from: string;
  type: string;
  text?: { body: string };
  image?: { id: string; caption?: string };
  interactive?: {
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string };
  };
};

const HELP =
  "Hi, I'm Pip 🧚 Send me a place or activity (text, a link, or a screenshot) and I'll turn it into a card for your groups.";
const API = "http://internal";

const price = (n: number | null) => (n ? "$".repeat(Math.min(n, 4)) : "price unknown");
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });

async function userByPhone(phone: string): Promise<{ id: number; name: string } | null> {
  const rows = await query<{ id: number; name: string }>(
    "SELECT id,name FROM users WHERE whatsapp_phone=$1",
    [digits(phone)],
  );
  return rows[0] ?? null;
}

// Call an existing route handler as a given user (same checks the app gets, e.g. group membership).
async function callRoute(
  handler: (req: Request, ctx: { params: Promise<{ id: string }> }) => Promise<Response>,
  id: number,
  userId: number,
) {
  const res = await handler(
    new Request(API, { method: "POST", headers: { "x-user-id": String(userId) } }),
    { params: Promise.resolve({ id: String(id) }) },
  );
  return { status: res.status, body: (await res.json().catch(() => ({}))) as any };
}

async function offerCard(to: string, userId: number, cardId: number, notes: string[] = []) {
  const card = await getCard(cardId);
  if (!card) return;
  const groups = await query<{ id: number; name: string }>(
    "SELECT g.id,g.name FROM groups g JOIN group_members gm ON gm.group_id=g.id AND gm.user_id=$1 ORDER BY g.id",
    [userId],
  );
  const lines = [
    card.needs_review
      ? `I added "${card.name}" but couldn't find the price or photo. You can fix it in the app.`
      : `🧚 Added to your list:\n*${card.name}* · ${price(card.price_level)} · ${card.activity_type ?? "idea"}${card.address ? `\n${card.address}` : ""}`,
    ...notes,
  ];
  if (!groups.length) return sendText(to, lines.join("\n") + "\nJoin a group in the app to share it.");
  // Reserve a slot for "Just me" so a 3-group user still gets simple buttons.
  const choices = [
    ...groups.slice(0, 9).map((g) => ({ id: `share:${card.id}:${g.id}`, title: g.name })),
    { id: "later", title: "Just me" },
  ];
  return sendChoices(to, lines.join("\n") + "\nShare it with a group?", choices, "Pick a group");
}

async function handleIdea(to: string, user: { id: number }, input: { text?: string; imageBase64?: string }) {
  const { draft, meta } = await buildCard(input);
  const id = await insertCard(draft, user.id);
  if (meta.fallbacks.length || meta.errors.length)
    console.log("[whatsapp] card", id, "fallbacks:", meta.fallbacks, "errors:", meta.errors);
  await offerCard(to, user.id, id);
}

async function handleChoice(to: string, user: { id: number }, choice: string) {
  const [kind, a, b] = choice.split(":");
  const x = Number(a),
    y = Number(b);

  if (kind === "later") return sendText(to, "Okay, it's saved to your ideas. 🧚");

  if (kind === "share" && Number.isSafeInteger(x) && Number.isSafeInteger(y)) {
    if (!(await member(y, user.id))) return sendText(to, "You're not in that group anymore.");
    const card = await getCard(x);
    if (!card || card.created_by !== user.id) return sendText(to, "I couldn't find that card.");
    await shareCard(x, [y]);
    const g = (await query<{ name: string }>("SELECT name FROM groups WHERE id=$1", [y]))[0];
    return sendChoices(
      to,
      `Done! *${card.name}* is now in *${g?.name ?? "your group"}*. Want me to plan a night around the group's ideas?`,
      [
        { id: `plan:${y}`, title: "Plan it" },
        { id: "later", title: "Not yet" },
      ],
    );
  }

  if (kind === "plan" && Number.isSafeInteger(x)) {
    const { status, body } = await callRoute(planRoute as any, x, user.id);
    if (status === 403) return sendText(to, "You're not in that group.");
    if (status === 422)
      // The route returns a proposal object only when the blocker is availability.
      return sendText(
        to,
        body.proposal
          ? "I found a good idea, but I can't find a time when everyone is free. 🧚 Open Round Table and add your free times, then tap Plan it again."
          : "This group needs at least one shared idea before I can plan. Send me a place first! 🧚",
      );
    if (!body.event_id) return sendText(to, "Something went wrong planning that. Try again in the app.");
    const p = body.proposal;
    const warnings: string[] = p.warnings ?? [];
    const text = [
      `🧚 Proposal: *${p.title}*, ${when(p.starts_at)}`,
      p.reasoning,
      ...warnings.slice(0, 4).map((w) => `⚠️ ${w}`),
    ].join("\n");
    if (body.event_status === "confirmed") return sendText(to, text + "\nThis one is already confirmed.");
    return sendChoices(to, text, [
      { id: `confirm:${body.event_id}`, title: "Confirm" },
      { id: "later", title: "Not yet" },
    ]);
  }

  if (kind === "confirm" && Number.isSafeInteger(x)) {
    const { status, body } = await callRoute(confirmRoute as any, x, user.id);
    if (status === 409) return sendText(to, "That plan was already confirmed (or changed). Check the app.");
    if (status !== 200) return sendText(to, "I couldn't confirm that one. Check the app.");
    const e = body.event;
    return sendText(
      to,
      `Locked in! 🎉 *${e.title}*, ${when(e.starts_at)}. It's on everyone's home screen in the app, where you can split the cost.`,
    );
  }

  return sendText(to, HELP);
}

export async function handleMessage(msg: WaMessage) {
  const to = msg.from;
  const user = await userByPhone(to);
  if (!user)
    return sendText(
      to,
      "Hi! I don't know this number yet. Join Round Table in the app and link your WhatsApp number there.",
    );

  if (msg.type === "interactive") {
    const id = msg.interactive?.button_reply?.id ?? msg.interactive?.list_reply?.id;
    return id ? handleChoice(to, user, id) : sendText(to, HELP);
  }

  if (msg.type === "image" && msg.image) {
    const { dataUrl, mime } = await downloadMedia(msg.image.id);
    return handleIdea(to, user, {
      text: msg.image.caption,
      imageBase64: dataUrl,
    });
  }

  if (msg.type === "text" && msg.text?.body) {
    const text = msg.text.body.trim();
    if (/^(hi|hello|hey|help|\?)$/i.test(text)) return sendText(to, HELP);
    const intent = await classifyText(text);
    console.log("[whatsapp] intent", intent);
    if (!intent.is_idea) return sendText(to, HELP);
    return handleIdea(to, user, { text });
  }

  return sendText(to, "I can read text and screenshots. Send me a place or activity! 🧚");
}