// Demo safety net. Every successful live run is saved to api/cache/<key>.json.
// If Gemini/SerpApi fail later (wifi, quota), the same input is served from here.
// Set USE_CACHE=1 to prefer the cache even when the APIs are up.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Extraction } from "./gemini";
import type { Place } from "./serpapi";

const DIR = path.join(process.cwd(), "cache");

export type CachedResult = { extraction: Extraction; place: Place | null };

export function cacheKey(input: { text?: string; imageBase64?: string }): string {
  const raw = input.imageBase64
    ? "img:" + input.imageBase64.replace(/^data:[^,]+,/, "")
    : "txt:" + (input.text ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

export const forceCache = () => process.env.USE_CACHE === "1";

export function readCache(key: string): CachedResult | null {
  try {
    const file = path.join(DIR, `${key}.json`);
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8")) as CachedResult;
    // Hand-written demo seeds, matched by normalized text.
    const seedFile = path.join(DIR, "demo-seeds.json");
    if (fs.existsSync(seedFile)) {
      const seeds = JSON.parse(fs.readFileSync(seedFile, "utf8")) as Array<{ text: string } & CachedResult>;
      const hit = seeds.find((s) => cacheKey({ text: s.text }) === key);
      if (hit) return { extraction: hit.extraction, place: hit.place };
    }
  } catch (e) {
    console.warn("cache read failed", e);
  }
  return null;
}

export function writeCache(key: string, value: CachedResult) {
  try {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(path.join(DIR, `${key}.json`), JSON.stringify(value, null, 2));
  } catch (e) {
    console.warn("cache write failed", e);
  }
}
