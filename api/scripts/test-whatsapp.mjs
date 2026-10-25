// Simulates Meta calling your webhook, so you can test the bot without WhatsApp.
// Run the API with WHATSAPP_DRY_RUN=1 (replies get logged in the API console instead of sent).
// Usage:
//   node --env-file=.env scripts/test-whatsapp.mjs text  <phone> "we should try Ramen Tatsu-Ya"
//   node --env-file=.env scripts/test-whatsapp.mjs button <phone> "plan:1"
// Env: API_URL (default http://localhost:3000), WHATSAPP_APP_SECRET (to sign like Meta does)
import crypto from "node:crypto";

const [kind, phone, value] = process.argv.slice(2);
if (!kind || !phone || !value) {
  console.error('Usage: test-whatsapp.mjs <text|button> <phone> "<text or button id>"');
  process.exit(1);
}
const message = {
  id: "wamid.TEST" + crypto.randomUUID(),
  from: phone.replace(/\D/g, ""),
  timestamp: String(Math.floor(Date.now() / 1000)),
  ...(kind === "text"
    ? { type: "text", text: { body: value } }
    : { type: "interactive", interactive: { type: "button_reply", button_reply: { id: value, title: value } } }),
};
const raw = JSON.stringify({
  object: "whatsapp_business_account",
  entry: [{ id: "1", changes: [{ field: "messages", value: { messages: [message] } }] }],
});
const headers = { "Content-Type": "application/json" };
if (process.env.WHATSAPP_APP_SECRET)
  headers["x-hub-signature-256"] =
    "sha256=" + crypto.createHmac("sha256", process.env.WHATSAPP_APP_SECRET).update(raw).digest("hex");

const r = await fetch((process.env.API_URL || "http://localhost:3000") + "/api/whatsapp/webhook", {
  method: "POST",
  headers,
  body: raw,
});
console.log(r.status, await r.text());
