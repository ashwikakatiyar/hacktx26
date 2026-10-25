-- Run ONCE with psql; never run db:init on an existing database.
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS nessie_transfer_id TEXT;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS settlement_state TEXT NOT NULL DEFAULT 'unpaid';
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS settlement_started_at TIMESTAMPTZ;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS settled_at TIMESTAMPTZ;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS split_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS expenses_split_key_unique ON expenses(split_key) WHERE split_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS expenses_event_id_idx ON expenses(event_id);
