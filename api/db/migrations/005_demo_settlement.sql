-- The Phase 4 schema already has settlement_state TEXT and settled_at.
-- No schema migration is required for the provided Phase 4 database schema.
-- If you added a custom CHECK constraint, extend it to permit 'simulated'
-- before using the new endpoint. Do not reset your database.
SELECT 'Demo settlement uses existing Phase 4 columns; no schema changes required' AS message;
