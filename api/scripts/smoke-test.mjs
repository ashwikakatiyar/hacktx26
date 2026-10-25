// Tests one real call to each external API.
// Run from api/:  npm run smoke   (loads .env via --env-file)
const env = process.env;
const results = [];

async function check(name, fn) {
  const t = Date.now();
  try {
    const detail = await fn();
    results.push([name, "OK  ", `${Date.now() - t}ms`, detail]);
  } catch (e) {
    // Node's fetch hides the real reason in e.cause (DNS, TLS, refused, etc.)
    const why = e.cause ? ` (${e.cause.code || e.cause.message})` : "";
    results.push([
      name,
      "FAIL",
      `${Date.now() - t}ms`,
      (String(e.message || e) + why).replace(/\s+/g, " ").slice(0, 220),
    ]);
  }
}

const need = (k) => {
  if (!env[k]) throw new Error(`${k} not set`);
  return env[k];
};

await check("Gemini", async () => {
  const model = env.GEMINI_MODEL || "gemini-3.8-flash";
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${need("GEMINI_API_KEY")}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with the single word "pong".' }] }],
      }),
    },
  );
  if (!r.ok) throw new Error(`${model}: ${r.status} ${await r.text()}`);
  const j = await r.json();
  return `${model} -> ${j.candidates?.[0]?.content?.parts?.[0]?.text?.trim()}`;
});

await check("SerpApi", async () => {
  const u = new URL("https://serpapi.com/search.json");
  u.search = new URLSearchParams({
    engine: "google_maps",
    q: "Ramen Tatsu-Ya Austin TX",
    type: "search",
    api_key: need("SERPAPI_KEY"),
  });
  const r = await fetch(u);
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  const j = await r.json();
  const p = j.place_results || j.local_results?.[0];
  if (!p) throw new Error("no place found");
  return `${p.title} | price=${p.price ?? "n/a"} | rating=${p.rating ?? "n/a"} | thumb=${p.thumbnail ? "yes" : "no"}`;
});

await check("Nessie", async () => {
  const base = (env.NESSIE_BASE_URL || "http://api.nessieisreal.com").replace(
    /\/$/,
    "",
  );
  const r = await fetch(`${base}/customers?key=${need("NESSIE_API_KEY")}`);
  if (!r.ok) throw new Error(`${base}: ${r.status} ${await r.text()}`);
  const j = await r.json();
  return `${base}: ${Array.isArray(j) ? j.length + " customers visible" : JSON.stringify(j).slice(0, 80)}`;
});

await check("Muse Spark", async () => {
  // OpenAI-compatible Model API. Key can be MUSE_API_KEY or MODEL_API_KEY.
  const base = (env.MUSE_BASE_URL || "https://api.meta.ai/v1").replace(
    /\/$/,
    "",
  );
  const key = env.MUSE_API_KEY || need("MODEL_API_KEY");
  const model = env.MUSE_MODEL || "muse-spark-1.3";
  const r = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "user", content: 'Reply with the single word "pong".' },
      ],
    }),
  });
  if (!r.ok) throw new Error(`${model}: ${r.status} ${await r.text()}`);
  const j = await r.json();
  return `${model} -> ${j.choices?.[0]?.message?.content?.trim()}`;
});

console.log("\nAPI smoke test");
for (const [n, s, t, d] of results)
  console.log(`${s}  ${n.padEnd(11)} ${t.padEnd(8)} ${d}`);
process.exit(results.some((r) => r[1] === "FAIL") ? 1 : 0);
