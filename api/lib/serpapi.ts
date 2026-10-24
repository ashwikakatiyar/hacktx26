// SerpApi (Google Maps engine): image, price level, address, rating for a place.
export type Place = {
  name: string;
  address: string | null;
  image_url: string | null;
  price_level: number | null; // 1..4, like Google's $ to $$$$
  rating: number | null;
};

// Bias results toward Austin so "Odd Duck" finds the Austin one. Set SERPAPI_LL=none to disable.
const DEFAULT_LL = "@30.2672,-97.7431,12z";

export function priceFromString(s: string): number | null {
  const dollars = s.match(/^\s*(\${1,4})\s*$/);
  if (dollars) return dollars[1].length;
  if (/\$|USD/.test(s)) {
    const nums = s.match(/\d+/g)?.map(Number);
    if (nums?.length) {
      const hi = Math.max(...nums);
      return hi <= 10 ? 1 : hi <= 25 ? 2 : hi <= 50 ? 3 : 4;
    }
  }
  return null;
}

// Google puts price in different spots (price, price_description, nested extensions); look everywhere.
export function parsePriceLevel(p: any): number | null {
  const found: string[] = [];
  const walk = (v: any) => {
    if (typeof v === "string") found.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(p?.price);
  walk(p?.price_description);
  walk(p?.price_range);
  walk(p?.extensions);
  for (const s of found) {
    if (!s.includes("$") && !/USD/.test(s)) continue;
    const level = priceFromString(s.trim());
    if (level) return level;
  }
  return null;
}

const tokens = (s: string) => s.toLowerCase().match(/[a-z0-9]+/g)?.filter((t) => t.length > 2) ?? [];

// Guard against SerpApi returning an unrelated place for a vague query.
export function similarNames(a: string, b: string): boolean {
  const tb = new Set(tokens(b));
  return tokens(a).some((t) => tb.has(t));
}

export async function lookupPlace(name: string, location?: string | null): Promise<Place | null> {
  const key = process.env.SERPAPI_KEY;
  if (!key) throw new Error("SERPAPI_KEY not set");
  const ll = process.env.SERPAPI_LL ?? DEFAULT_LL;

  const params: Record<string, string> = {
    engine: "google_maps",
    type: "search",
    q: `${name} ${location || "Austin, TX"}`,
    api_key: key,
  };
  if (ll !== "none") params.ll = ll;

  const r = await fetch(`https://serpapi.com/search.json?${new URLSearchParams(params)}`, {
    signal: AbortSignal.timeout(20_000),
  });
  if (!r.ok) throw new Error(`serpapi ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();

  const p = j.place_results ?? j.local_results?.[0];
  if (!p?.title || !similarNames(name, p.title)) return null;

  return {
    name: p.title,
    address: p.address ?? null,
    image_url: p.thumbnail ?? p.photos?.[0]?.thumbnail ?? p.images?.[0]?.thumbnail ?? null,
    price_level: parsePriceLevel(p),
    rating: typeof p.rating === "number" ? p.rating : null,
  };
}
