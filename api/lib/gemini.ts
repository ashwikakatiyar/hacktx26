// Gemini: turn pasted text or a screenshot into structured JSON.
export const ACTIVITY_TYPES = ["dinner", "brunch", "coffee", "drinks", "outdoors", "music", "games", "art", "other"] as const;

export type Extraction = {
  name: string;
  activity_type: string;
  location: string | null;
  dietary_tags: string[];
};

const PROMPT = `You read text messages or screenshots (social posts, group chats, maps, reviews) where someone mentions a place or activity to try with friends.
Extract the single most prominent place or activity as JSON with exactly these keys:
- "name": the place or event name, as written (string)
- "activity_type": one of ${ACTIVITY_TYPES.join(", ")}
- "location": city, neighborhood or address if visible, otherwise null
- "dietary_tags": any of "vegetarian", "vegan", "gluten-free" that are mentioned or clearly implied, otherwise []
If nothing usable is present, return {"name": "", "activity_type": "other", "location": null, "dietary_tags": []}.
Return only the JSON object.`;

export async function extractFromInput(input: {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<Extraction> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

  const parts: any[] = [{ text: PROMPT }];
  if (input.text) parts.push({ text: `Message:\n${input.text}` });
  if (input.imageBase64) {
    const m = input.imageBase64.match(/^data:([^;]+);base64,(.*)$/s);
    parts.push({
      inline_data: { mime_type: m?.[1] ?? input.mimeType ?? "image/jpeg", data: m ? m[2] : input.imageBase64 },
    });
  }

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseMimeType: "application/json", temperature: 0 },
      }),
      signal: AbortSignal.timeout(25_000),
    }
  );
  if (!r.ok) throw new Error(`gemini ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  const raw: string = j.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? "").join("") ?? "";
  return normalizeExtraction(raw);
}

export function normalizeExtraction(raw: string): Extraction {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  let o: any;
  try {
    o = JSON.parse(cleaned);
  } catch {
    throw new Error("gemini returned non-JSON: " + cleaned.slice(0, 100));
  }
  if (Array.isArray(o)) o = o[0] ?? {};
  const type = String(o.activity_type ?? "other").toLowerCase();
  return {
    name: String(o.name ?? "").trim(),
    activity_type: (ACTIVITY_TYPES as readonly string[]).includes(type) ? type : "other",
    location: o.location ? String(o.location).trim() : null,
    dietary_tags: Array.isArray(o.dietary_tags)
      ? o.dietary_tags.map((t: any) => String(t).toLowerCase()).filter((t: string) => ["vegetarian", "vegan", "gluten-free"].includes(t))
      : [],
  };
}
