// Applies db/schema.sql then db/seed.sql. Usage: DATABASE_URL=... npm run db:init
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const here = path.dirname(fileURLToPath(import.meta.url));
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL first (copy .env.example to .env and export it).");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: url.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
});

await client.connect();
for (const file of ["schema.sql", "seed.sql"]) {
  const sql = fs.readFileSync(path.join(here, "..", "db", file), "utf8");
  await client.query(sql);
  console.log(`applied ${file}`);
}
const { rows } = await client.query("SELECT (SELECT count(*) FROM users) users, (SELECT count(*) FROM cards) cards, (SELECT count(*) FROM events) events");
console.log("seeded:", rows[0]);
await client.end();
