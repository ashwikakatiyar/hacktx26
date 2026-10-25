# Phase 3 fixes — backend only

## What changed
- `/api/groups/:id/plan` now takes a PostgreSQL advisory transaction lock per group and reuses an existing proposed/confirmed event for the same group, card and UTC start time. `reused` and `event_status` distinguish reuse from creation. This does not delete old duplicates (#10–#13).
- Muse request timeout increased to 20 seconds.
- Planner response includes `timezone: "America/Chicago"` for frontend display.
- `lib/timezone.ts` provides a display formatter and an ISO-with-offset parser for future availability write routes. Existing availability timestamps are **not modified**.

## Austin time handling
`2026-10-30T18:00:00.000Z` = **Oct 30, 2026 1:00 PM CDT**. If the intended local time is **6 PM**, the correct UTC timestamp is `2026-10-30T23:00:00.000Z` (input `2026-10-30T18:00:00-05:00`). The existing demo availability records are 18:00–22:00 UTC, so the planner correctly selects 18:00 UTC from them. Update availability at its source (with explicit timezone offset) before asking the planner for an evening event; do not shift the event alone. This package does not add an availability write endpoint.

## Tests
Run `cd api && npm install && npm run typecheck && npm run dev`.
Call `POST /api/groups/4/plan` twice using `x-user-id: 1`. First call may reuse an existing event; both calls should return the same event_id for the same group/card/time. Test after updating availability for a new date if you need to demonstrate fresh creation.

## Frontend contract
`{ event_id, proposal, saved, reused, event_status, timezone }`. Render `new Date(proposal.starts_at).toLocaleString('en-US',{timeZone:timezone,dateStyle:'medium',timeStyle:'short'})`. Do not hardcode `18:00Z` as 6 PM local.

## Notes
This implementation uses the same demo x-user-id mechanism as before; it is not production authentication. Real availability changes should be applied through a validated endpoint rather than direct database edits in production.
