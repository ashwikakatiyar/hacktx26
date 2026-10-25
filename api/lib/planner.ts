import { query } from "./db";
export type Member = {
  id: number;
  name: string;
  dietary: string[] | null;
  accessibility: string[] | null;
  transport: string | null;
  radius_miles: number | null;
  budget_max: number | null;
};
export type Card = {
  id: number;
  name: string;
  activity_type: string | null;
  address: string | null;
  price_level: number | null;
  dietary_tags: string[] | null;
  rating: string | null;
};
export type Slot = { user_id: number; starts_at: string; ends_at: string };
export async function context(groupId: number) {
  const members = await query<Member>(
    `SELECT u.id,u.name,c.dietary,c.accessibility,c.transport,c.radius_miles,c.budget_max FROM group_members gm JOIN users u ON u.id=gm.user_id LEFT JOIN constraints c ON c.user_id=u.id WHERE gm.group_id=$1 ORDER BY u.id`,
    [groupId],
  );
  const cards = await query<Card>(
    `SELECT DISTINCT c.id,c.name,c.activity_type,c.address,c.price_level,c.dietary_tags,c.rating FROM card_shares s JOIN cards c ON c.id=s.card_id WHERE s.group_id=$1 ORDER BY c.id`,
    [groupId],
  );
  const availability = await query<Slot>(
    `SELECT a.user_id,a.starts_at,a.ends_at FROM availability a JOIN group_members gm ON gm.user_id=a.user_id WHERE gm.group_id=$1 AND a.ends_at>now() ORDER BY a.starts_at LIMIT 200`,
    [groupId],
  );
  return { group_id: groupId, members, cards, availability };
}
function overlap(members: Member[], slots: Slot[]) {
  const byUser = members.map((m) =>
    slots
      .filter((s) => s.user_id === m.id)
      .map((s) => ({
        start: Date.parse(s.starts_at),
        end: Date.parse(s.ends_at),
      }))
      .filter(
        (s) =>
          Number.isFinite(s.start) && Number.isFinite(s.end) && s.end > s.start,
      ),
  );
  if (byUser.some((a) => !a.length)) return null;
  let intervals = byUser[0];
  for (const windows of byUser.slice(1)) {
    intervals = intervals.flatMap((a) =>
      windows
        .map((b) => ({
          start: Math.max(a.start, b.start),
          end: Math.min(a.end, b.end),
        }))
        .filter((x) => x.end - x.start >= 60 * 60 * 1000),
    );
  }
  intervals.sort((a, b) => a.start - b.start);
  return intervals[0]?.start
    ? new Date(intervals[0].start).toISOString()
    : null;
}
export function fallback(ctx: Awaited<ReturnType<typeof context>>) {
  const { members, cards, availability } = ctx;
  if (!members.length || !cards.length) return null;
  const scored = cards
    .map((card) => {
      const over = members.filter(
        (m) =>
          m.budget_max != null &&
          (card.price_level == null || card.price_level > m.budget_max),
      );
      const missing = members.flatMap((m) =>
        (m.dietary || [])
          .filter((d) => !(card.dietary_tags || []).includes(d))
          .map((d) => `${m.name}: ${d} not verified`),
      );
      const access = members.flatMap((m) =>
        (m.accessibility || []).map((a) => `${m.name}: ${a} not verified`),
      );
      const score =
        100 -
        over.length * 50 -
        missing.length * 20 -
        access.length * 10 +
        (Number(card.rating) || 0);
      return { card, over, missing, access, score };
    })
    .sort((a, b) => b.score - a.score || a.card.id - b.card.id);
  const best = scored[0];
  const time = overlap(members, availability);
  const warnings = [
    ...best.missing,
    ...best.access,
    ...members
      .filter((m) => m.transport && m.transport !== "car")
      .map((m) => `${m.name}: ${m.transport} travel time not verified`),
  ];
  if (!time)
    warnings.push("No common availability of at least one hour was found");
  if (best.over.length)
    warnings.push(
      `Budget not verified for: ${best.over.map((m) => m.name).join(", ")}`,
    );
  return {
    card_id: best.card.id,
    title: best.card.name,
    starts_at: time,
    reasoning: `Selected ${best.card.name} from ${cards.length} shared idea(s). Price level ${best.card.price_level ?? "unknown"}; ${members.length} group members considered. ${warnings.length ? "Review warnings before confirming." : "Known dietary and budget constraints match."}`,
    warnings,
    source: "fallback" as const,
  };
}
export async function museProposal(
  ctx: Awaited<ReturnType<typeof context>>,
  fallbackResult: NonNullable<ReturnType<typeof fallback>>,
) {
  // Set these only after verifying the provider's OpenAI-compatible endpoint and model name.
  const endpoint = process.env.MUSE_CHAT_COMPLETIONS_URL,
    key = process.env.MUSE_API_KEY,
    model = process.env.MUSE_MODEL;
  if (!endpoint || !key || !model) return fallbackResult;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You plan group outings. Return ONLY a JSON object with card_id (integer from provided cards), title, starts_at (ISO string or null), reasoning (short string), warnings (array of strings). Never invent dietary compatibility, travel times or availability. Prefer group constraints.",
            },
            { role: "user", content: JSON.stringify(ctx) },
          ],
          temperature: 0.2,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!response.ok) throw Error(`Muse status ${response.status}`);
    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (typeof raw !== "string") throw Error("Unexpected provider response");
    const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ""));
    if (!ctx.cards.some((c) => c.id === parsed.card_id))
      throw Error("Unknown card");
    if (typeof parsed.reasoning !== "string" || !Array.isArray(parsed.warnings))
      throw Error("Invalid output");
    // Never accept an unverified time from a model: use the computed common slot.
    const start = overlap(ctx.members, ctx.availability);
    return {
      ...fallbackResult,
      card_id: parsed.card_id,
      title: ctx.cards.find((c) => c.id === parsed.card_id)!.name,
      starts_at: start,
      reasoning: parsed.reasoning.slice(0, 1500),
      warnings: [
        ...new Set([
          ...fallbackResult.warnings,
          ...parsed.warnings.filter((x: unknown) => typeof x === "string"),
        ]),
      ],
      source: "muse" as const,
    };
  } catch (err) {
    console.warn("Planner provider failed; using fallback:", err);
    return fallbackResult;
  }
}
