-- WhatsApp integration. Run ONCE with psql; never run db:init on an existing database.
-- Idempotent, so re-running is harmless.

-- Digits only, with country code, no "+" (e.g. 15125550101). Matches WhatsApp's "from" field.
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS users_whatsapp_phone_unique ON users(whatsapp_phone) WHERE whatsapp_phone IS NOT NULL;

-- Meta retries webhooks; this table makes processing each message ID happen once.
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  wamid TEXT PRIMARY KEY,
  received_at TIMESTAMPTZ DEFAULT now()
);
