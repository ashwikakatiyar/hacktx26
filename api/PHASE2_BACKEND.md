# Phase 2 backend handoff (Tiger Data)

No schema reset is required: existing `users`, `constraints`, `friendships`, `groups`, `group_members`, `cards`, `card_shares`, and `availability` are reused. **Do not run `npm run db:init` against an existing Tiger Data database:** `db/schema.sql` begins with DROP TABLE.

Copy the changed `api/` files into your repository. Keep your existing `api/.env` (not included). From `api/`, run `npm install`, `npm run typecheck`, then `npm run dev`.

Set `x-user-id` to an existing seeded user ID in every request. Omitting it selects the configured demo user. This is **demo-only identity, not authentication**; don't expose private data or production accounts with this approach.

Endpoints:
- `GET /api/users` (demo user directory)
- `GET /api/users/:id` (self)
- `PATCH /api/users/:id/constraints` e.g. `{ "dietary":["vegetarian"],"transport":"walk","budget_max":2,"radius_miles":5 }`
- `GET /api/friends`; `POST /api/friends` `{ "user_id":2 }`
- `GET /api/groups`; `POST /api/groups` `{ "name":"Friday Crew", "member_ids":[2,3] }`
- `GET /api/groups/:id`; `POST /api/groups/:id/members` `{ "user_id":4 }`
- `POST /api/cards/:id/share` `{ "group_ids":[1] }`
- `GET /api/groups/:id/planner-context` for Phase 3 Muse input (no Muse calls yet)

Quick demo check (replace 1, 2, and card ID with real IDs):
```
curl -H 'x-user-id: 1' http://localhost:3000/api/users
curl -X PATCH -H 'Content-Type: application/json' -H 'x-user-id: 1' -d '{"dietary":["vegetarian"],"budget_max":2}' http://localhost:3000/api/users/1/constraints
curl -X POST -H 'Content-Type: application/json' -H 'x-user-id: 1' -d '{"name":"Friday Crew","member_ids":[2]}' http://localhost:3000/api/groups
curl -H 'x-user-id: 1' http://localhost:3000/api/groups/1/planner-context
```

Caveats: These endpoints are designed for a seeded hackathon demo, not production authorization. Existing Phase 1 card list/read/edit routes still need a complete authorization review. Do not send raw user data to Muse until you have permission and appropriate safeguards. No live Tiger Data connection was attempted during packaging.
