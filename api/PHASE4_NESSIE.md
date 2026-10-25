# Phase 4: Real Capital One Nessie sandbox transfers

Backend-only additive patch. **Do not run `npm run db:init`**: it drops/recreates existing tables.

## 1. Merge patch
Copy `hacktx26/api/` from this ZIP into the same paths in your project. No existing files are overwritten.

## 2. Environment
Add to `api/.env` (never commit the key):
```
NESSIE_API_KEY=your_customer_key
NESSIE_BASE_URL=http://api.reimaginebanking.com
```
The historical Nessie API uses `?key=` authentication. If your Nessie dashboard supplies a different base URL, use that exact URL. The customer-scoped key is needed for POST operations; an enterprise read-only key is insufficient.

## 3. Apply migration ONCE (non-destructive)
From `api/` with psql installed:
```
psql "$DATABASE_URL" -f db/migrations/004_nessie_expenses.sql
```
Or paste that SQL into the Tiger Data SQL editor. It adds columns and indexes only.

## 4. Link existing Nessie sandbox accounts to demo users
Create or select two sandbox accounts in Nessie first. Then in Tiger Data SQL editor, replacing example IDs with actual Nessie account IDs:
```
UPDATE users SET nessie_account_id = 'ALEX_NESSIE_ACCOUNT_ID' WHERE id = 1;
UPDATE users SET nessie_account_id = 'SAM_NESSIE_ACCOUNT_ID' WHERE id = 2;
```
Never use real bank account details. Test that Nessie recognizes each account:
```
curl -sS -H 'x-user-id: 1' http://localhost:3000/api/nessie/accounts | python3 -m json.tool
curl -sS -H 'x-user-id: 2' http://localhost:3000/api/nessie/accounts | python3 -m json.tool
```

## 5. Create an equal split on confirmed event #14
```
curl -sS -X POST http://localhost:3000/api/events/14/expenses \
 -H 'Content-Type: application/json' -H 'x-user-id: 1' \
 -d '{"payer_id":1,"amount_cents":4800,"description":"Dinner","idempotency_key":"dinner-event-14-v1"}' | python3 -m json.tool
```
This creates **one debt of $24 from Sam to Alex**. Alex's own $24 share is not recorded as debt. Repeating the exact request with the same idempotency key reuses the debt. Use a new key for a genuinely new bill.

List expenses:
```
curl -sS -H 'x-user-id: 1' http://localhost:3000/api/events/14/expenses | python3 -m json.tool
```

## 6. Settle through Nessie (actual sandbox API)
Use the returned expense ID, not the event ID:
```
curl -sS -X POST -H 'x-user-id: 2' http://localhost:3000/api/expenses/EXPENSE_ID/settle | python3 -m json.tool
```
This POSTs to Nessie `/accounts/{sam_account_id}/transfers` with `payee_id={alex_account_id}`, `medium=balance`, and `amount=24`. It records the Nessie transfer ID and marks the debt settled **only after a successful response**.

Balances:
```
curl -sS -H 'x-user-id: 1' http://localhost:3000/api/groups/4/balances | python3 -m json.tool
```

## Caveats
- Uses the project's demo `x-user-id` authentication. Do not expose this to production users without real auth.
- Transfers are **sandbox-only**. Nessie is not a production peer-to-peer payment rail.
- If Nessie times out or returns an uncertain result, the debt remains `processing`. Manually reconcile it with Nessie before retrying. Never reset it blindly.
- Expense creation currently splits across **all group members**, not only event attendees. This matches your two-person Friday Crew demo. Add attendee selection before supporting larger groups.
- Use a unique idempotency key per real bill. For multi-user concurrency, database uniqueness prevents duplicate shares; retry after any unique-constraint race.
- `GET /api/nessie/accounts` returns the current user's sandbox account details; keep this demo endpoint behind authentication if deployed.
