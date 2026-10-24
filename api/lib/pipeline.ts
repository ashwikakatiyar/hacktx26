// Card pipeline: input (text or screenshot) -> Gemini extraction -> SerpApi enrichment -> card fields.
// Every external call has a fallback so the demo can't die live:
//   live API -> cached response for the same input -> manual-edit card (needs_review).
import { extractFromInput, type Extraction } from "./gemini";
import { lookupPlace, similarNames, type Place } from "./serpapi";
import { cacheKey, forceCache, readCache, writeCache } from "./cache";

export type CardInput = { text?: string; imageBase64?: string; mimeType?: string };

export type CardDraft = {
  name: string;
  activity_type: string;
  address: string | null;
  image_url: string | null;
  price_level: number | null;
  rating: number | null;
  dietary_tags: string[];
  source: "text" | "screenshot";
  source_text: string;
  needs_review: boolean;
};

export type PipelineMeta = {
  ms: { total: number; gemini?: number; serpapi?: number };
  fallbacks: string[]; // e.g. ["gemini:cache", "serpapi:none"]
  errors: string[];
};

function guessFromText(text?: string): Extraction {
  const first = (text ?? "").split(/\n/)[0]?.trim().slice(0, 60);
  return { name: first || "New idea (tap to edit)", activity_type: "other", location: null, dietary_tags: [] };
}

export async function buildCard(input: CardInput): Promise<{ draft: CardDraft; meta: PipelineMeta }> {
  const t0 = Date.now();
  const meta: PipelineMeta = { ms: { total: 0 }, fallbacks: [], errors: [] };
  const key = cacheKey({ text: input.text, imageBase64: input.imageBase64 });
  const cached = readCache(key);

  let extraction: Extraction | null = null;
  let place: Place | null = null;
  let fromCache = false;

  if (cached && forceCache()) {
    extraction = cached.extraction;
    place = cached.place;
    fromCache = true;
    meta.fallbacks.push("all:cache");
  } else {
    // 1. Gemini
    const tg = Date.now();
    try {
      extraction = await extractFromInput(input);
    } catch (e: any) {
      meta.errors.push(String(e.message ?? e));
    }
    meta.ms.gemini = Date.now() - tg;

    if (!extraction?.name && cached) {
      extraction = cached.extraction;
      place = cached.place;
      fromCache = true;
      meta.fallbacks.push("gemini:cache");
    }

    // 2. SerpApi
    if (extraction?.name && !fromCache) {
      const ts = Date.now();
      try {
        place = await lookupPlace(extraction.name, extraction.location);
      } catch (e: any) {
        meta.errors.push(String(e.message ?? e));
      }
      meta.ms.serpapi = Date.now() - ts;

      if (!place && cached?.place && similarNames(extraction.name, cached.place.name)) {
        place = cached.place;
        meta.fallbacks.push("serpapi:cache");
      }
      if (!place) meta.fallbacks.push("serpapi:none");
    }

    // 3. Remember good live results for next time
    if (extraction?.name && place && !fromCache && !meta.fallbacks.length) {
      writeCache(key, { extraction, place });
    }
  }

  if (!extraction?.name) {
    extraction = guessFromText(input.text);
    meta.fallbacks.push("gemini:manual");
  }

  const draft: CardDraft = {
    name: place?.name ?? extraction.name,
    activity_type: extraction.activity_type,
    address: place?.address ?? extraction.location,
    image_url: place?.image_url ?? null,
    price_level: place?.price_level ?? null,
    rating: place?.rating ?? null,
    dietary_tags: extraction.dietary_tags,
    source: input.imageBase64 ? "screenshot" : "text",
    source_text: input.text?.slice(0, 2000) ?? "[screenshot]",
    needs_review: !place || place.price_level == null,
  };

  meta.ms.total = Date.now() - t0;
  return { draft, meta };
}
