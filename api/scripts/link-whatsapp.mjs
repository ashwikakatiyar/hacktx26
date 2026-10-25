// Link a demo user to a WhatsApp number.
// Usage: node --env-file=.env scripts/link-whatsapp.mjs <userId> <phone with country code, e.g. 15125550101>
import pg from "pg";

const [userId, phone] = process.argv.slice(2);
const digits = (phone ?? "").replace(/\D/g, "");
if (!Number(userId) || digits.length < 8) {
  console.error("Usage: link-whatsapp.mjs <userId> <phone>");
  process.exit(1);
}
const url = process.env.DATABASE_URL;
const client = new pg.Client({
  connectionString: url,
  ssl: url?.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
});
await client.connect();
const r = await client.query(
  "UPDATE users SET whatsapp_phone=$2 WHERE id=$1 RETURNING id,name,whatsapp_phone",
  [Number(userId), digits],
);
console.log(r.rows[0] ?? "no such user");
await client.end();
