# The Village Table: Phase 0 setup (hours 0-2)

Demo path: paste screenshot or text -> card -> share to group -> AI proposes dinner -> confirm -> event card on home -> "what you owe" via Nessie.

## Checklist (owner in brackets)

- [ ] [All] 15-min align: demo path, roles, cut line. Paste the cut line in the team chat.
- [ ] [D] Get API keys: Muse, Gemini, SerpApi, Nessie. Put in `.env` (never commit).
- [ ] [D] `npm install && npm run smoke`. All four must say OK before hour 2 ends.
- [ ] [A] Create Postgres on Tiger Data, copy connection string to `DATABASE_URL`.
- [ ] [A] `npm run db:init` (applies `db/schema.sql` + `db/seed.sql`).
- [ ] [A] Vultr: Ubuntu 24.04 cloud compute instance (2 GB is enough). Point your .tech domain's A record at its IP.
- [ ] [A] Deploy "hello world" (steps below) and confirm the .tech URL loads.
- [ ] [C] UI shell in `app/` (Expo): tabs for Home, Groups, Profile, with placeholder cards.

Checkpoint: the site is live and shows seeded data.

## Local run

```bash
cd api
cp .env.example .env     # fill in keys
npm install
set -a; source .env; set +a
npm run db:init
npm run dev            # API on :3000
```

Then in a second terminal, the Expo app (phone on the same wifi):

```bash
cd app && npm install
npx expo start         # scan the QR code with Expo Go
```

In `app/.env` set `EXPO_PUBLIC_API_URL=http://<your-laptop-LAN-IP>:3000` (phones can't use `localhost`). After deploy, use `https://yourname.tech`.

## Vultr deploy (simple and fast: PM2 + Caddy for free HTTPS)

On the server (as root, once):

```bash
apt update && apt install -y git curl debian-keyring debian-archive-keyring apt-transport-https
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs
npm i -g pm2
apt install -y caddy
git clone <your-repo-url> /srv/village-table && cd /srv/village-table/api
cp .env.example .env && nano .env      # real keys + DATABASE_URL
npm install && npm run build
pm2 start npm --name village -- start && pm2 save && pm2 startup
```

`/etc/caddy/Caddyfile`:

```
yourname.tech {
  reverse_proxy localhost:3000
}
```

Then `systemctl reload caddy`. Redeploy after each push:

```bash
cd /srv/village-table && git pull && cd api && npm install && npm run build && pm2 restart village
```

## Rules (from the plan)

1. Every feature supports the demo path, or it's cut.
2. Real API calls for Nessie, SerpApi, Muse, Gemini. Judges check.
3. Seed data first, so every page looks alive.
4. Cache a response per external API (`USE_CACHE=1`) so the demo can't die live.

---

## Phase 1: card pipeline (what's built)

Paste text or a screenshot -> Gemini extracts name/type/location -> SerpApi finds image, price, address, rating -> card saved.

**After pulling Phase 1, re-run the database init** (schema changed for the village; this drops and re-seeds all tables):

```bash
cd api && npm install && npm run db:init
npm run dev                      # API on :3000
```

App (second terminal): `cd app && npm install && npx expo start`, scan the QR code with Expo Go.
`app/.env` needs `EXPO_PUBLIC_API_URL=http://<laptop-LAN-IP>:3000`.

### Fallbacks (the demo can't die live)
1. **Live APIs** -> every successful run is saved to `api/cache/<hash>.json`.
2. **Gemini or SerpApi fails** -> the same input is served from that cache.
3. **No cache, or nothing found** -> a card marked "needs review" that the user fixes by hand (name, price, type, address, image URL).
4. `USE_CACHE=1` in `api/.env` forces cached answers even when the APIs are up (use on flaky wifi).
5. `api/cache/demo-seeds.json` holds 3 hand-written text examples. **Run your real demo screenshot through the app once before the demo** so it gets cached.

### Endpoints
- `POST /api/cards` `{ text?, image_base64?, mime_type?, group_ids? }` -> `{ card, meta }`
- `GET /api/cards?group_id=` / `GET|PATCH /api/cards/:id` / `POST /api/cards/:id/share`
- `GET /api/groups`
