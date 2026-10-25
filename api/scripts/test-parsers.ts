import assert from "node:assert/strict";
import { parsePriceLevel, priceFromString, similarNames } from "../lib/serpapi";
import { normalizeExtraction } from "../lib/gemini";
import { cacheKey } from "../lib/cache";

// price: dollar signs, ranges, nested extensions, nothing
assert.equal(priceFromString("$$"), 2);
assert.equal(priceFromString("$$$$"), 4);
assert.equal(priceFromString("$10–20"), 2);
assert.equal(priceFromString("$1–10"), 1);
assert.equal(priceFromString("$30–50"), 3);
assert.equal(priceFromString("$50–100"), 4);
assert.equal(priceFromString("Dine-in"), null);
assert.equal(parsePriceLevel({ price: "$$" }), 2);
assert.equal(parsePriceLevel({ price_description: "$20–30" }), 3);
assert.equal(
  parsePriceLevel({
    extensions: [{ service_options: ["Dine-in"] }, { pricing: ["$10–20"] }],
  }),
  2,
);
assert.equal(parsePriceLevel({ rating: 4.5 }), null);

// name guard against unrelated results
assert.ok(similarNames("Odd Duck", "Odd Duck Farm to Trailer"));
assert.ok(!similarNames("Odd Duck", "Walmart Supercenter"));

// gemini output cleanup
const e = normalizeExtraction(
  '```json\n{"name":" Odd Duck ","activity_type":"DINNER","location":null,"dietary_tags":["Vegetarian","halal"]}\n```',
);
assert.deepEqual(e, {
  name: "Odd Duck",
  activity_type: "dinner",
  location: null,
  dietary_tags: ["vegetarian"],
});
assert.equal(
  normalizeExtraction('{"name":"X","activity_type":"karaoke"}').activity_type,
  "other",
);
assert.equal(normalizeExtraction('[{"name":"A"}]').name, "A");
assert.throws(() => normalizeExtraction("sorry I can't"));

// cache key ignores case and whitespace for text, strips data-URI prefix for images
assert.equal(
  cacheKey({ text: "We Should  try X" }),
  cacheKey({ text: " we should try x " }),
);
assert.equal(
  cacheKey({ imageBase64: "data:image/png;base64,AAA" }),
  cacheKey({ imageBase64: "AAA" }),
);

console.log("all parser tests passed");
