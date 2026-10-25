// Muse decides whether a WhatsApp text is an outing idea or just chat.
// Same OpenAI-compatible env vars as the planner. If Muse is down, a keyword heuristic answers instead.
export type Intent = { is_idea: boolean; source: "muse" | "heuristic" };

const IDEA_HINTS =
  /\b(we should|let'?s|wanna|want to (go|try)|should (we )?(try|go)|down to|try (out )?(that|this)|check (out|this)|looks? (good|great|fire|amazing)|have you been|dinner|brunch|lunch|coffee|drinks|hike|concert|restaurant|cafe|bar)\b|https?:\/\//i;

export function heuristicIntent(text: string): boolean {
  const t = text.trim();
  if (t.length < 4) return false;
  return IDEA_HINTS.test(t);
}

export async function classifyText(text: string): Promise<Intent> {
  const endpoint = process.env.MUSE_CHAT_COMPLETIONS_URL,
    key = process.env.MUSE_API_KEY,
    model = process.env.MUSE_MODEL;
  if (!endpoint || !key || !model)
    return { is_idea: heuristicIntent(text), source: "heuristic" };
  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              'You watch a chat between friends. Decide if the message suggests a specific place or activity to do together (e.g. "we should try that ramen place", a restaurant name, an event link). Greetings, questions about the bot, logistics and small talk are NOT ideas. Return ONLY JSON: {"is_idea": boolean}.',
          },
          { role: "user", content: text.slice(0, 1000) },
        ],
        temperature: 0,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!r.ok) throw new Error(`Muse status ${r.status}`);
    const raw = (await r.json())?.choices?.[0]?.message?.content;
    if (typeof raw !== "string") throw new Error("unexpected Muse response");
    const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ""));
    if (typeof parsed.is_idea !== "boolean") throw new Error("invalid Muse output");
    return { is_idea: parsed.is_idea, source: "muse" };
  } catch (e) {
    console.warn("Muse intent failed; using heuristic:", e);
    return { is_idea: heuristicIntent(text), source: "heuristic" };
  }
}
