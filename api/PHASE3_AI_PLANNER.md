# Phase 3: AI planner backend

Copy the `api` folder into your existing project. Frontend files are not included. Do not run `npm run db:init` on Tiger Data (it drops tables).

## Endpoints

`POST /api/groups/:id/plan` with `x-user-id` set to a group member: reads Tiger Data context, chooses a shared card, checks constraints and overlapping availability, saves a **proposed** event and attendee rows, returns `{event_id,proposal,saved:true}` (HTTP 201). If no shared cards, HTTP 422. If no common one-hour availability, HTTP 422 with an unsaved proposal.

`POST /api/events/:id/confirm`: only a group member can confirm a proposed event. Returns `{event}`. Repeated confirmation returns HTTP 409. Note: demo `x-user-id` is NOT production authentication.

## Try it

```bash
curl -i -X POST -H 'x-user-id: 1' http://localhost:3000/api/groups/4/plan
# Copy the event_id from response:
curl -i -X POST -H 'x-user-id: 1' http://localhost:3000/api/events/EVENT_ID/confirm
```

## Muse Spark configuration

Fallback planning works with no AI credentials. To enable real Muse calls, verify Muse's **actual** API documentation and whether it supports OpenAI-style chat completions, then set `MUSE_CHAT_COMPLETIONS_URL`, `MUSE_API_KEY`, and `MUSE_MODEL` in your private `.env`. This implementation expects an OpenAI-compatible `choices[0].message.content` JSON response. If Muse uses another protocol, adapt `lib/planner.ts` before claiming sponsor integration. Do not expose keys to frontend code.

## Caveats

Fallback scoring treats missing dietary tags as **unverified**, not unsafe or compatible. Travel times and venue accessibility are not validated. No common one-hour slot means no event is saved. For the live demo, seeded availability must be in the future. AI response is validated for known card ID and the event time is always derived server-side. Muse selection and fallback warnings can differ; review before confirming. No expenses are created by confirmation yet.
