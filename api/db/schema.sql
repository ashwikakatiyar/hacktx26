-- The Round Table: schema (Phase 0)
-- Run with: npm run db:init

DROP TABLE IF EXISTS expenses, availability, event_attendees, events, card_shares, cards,
  group_members, groups, friendships, constraints, users CASCADE;

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  age_range     TEXT,
  gender        TEXT,
  avatar_url    TEXT,
  nessie_customer_id TEXT,
  nessie_account_id  TEXT,
  onboarded     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Only fields the planner actually uses.
CREATE TABLE constraints (
  user_id       INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  dietary       TEXT[] DEFAULT '{}',        -- e.g. {vegetarian,gluten-free}
  accessibility TEXT[] DEFAULT '{}',        -- e.g. {step-free}
  can_drive     BOOLEAN DEFAULT FALSE,
  transport     TEXT DEFAULT 'walk',        -- walk | bike | transit | car
  location      TEXT,                       -- neighborhood / city
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  radius_miles  INT DEFAULT 10,
  budget_max    INT DEFAULT 2,              -- 1..4 ($ to $$$$)
  interests     TEXT[] DEFAULT '{}'
);

-- One row per friend pair (user_a < user_b). Powers the village:
-- last_hung_out = most recent HAPPENED event both attended; kept in sync when an event becomes happened.
CREATE TABLE friendships (
  user_a        INT REFERENCES users(id) ON DELETE CASCADE,
  user_b        INT REFERENCES users(id) ON DELETE CASCADE,
  last_hung_out TIMESTAMPTZ,
  hangout_count INT DEFAULT 0,
  PRIMARY KEY (user_a, user_b),
  CHECK (user_a < user_b)
);

CREATE TABLE groups (
  id                 SERIAL PRIMARY KEY,
  name               TEXT NOT NULL,
  meet_frequency_days INT DEFAULT 30,       -- friendship goal
  goal_interests     TEXT[] DEFAULT '{}',
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE group_members (
  group_id INT REFERENCES groups(id) ON DELETE CASCADE,
  user_id  INT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE cards (
  id            SERIAL PRIMARY KEY,
  created_by    INT REFERENCES users(id),
  name          TEXT NOT NULL,
  activity_type TEXT,                       -- dinner, coffee, outdoors, ...
  address       TEXT,
  image_url     TEXT,
  price_level   INT,                        -- 1..4
  rating        NUMERIC(2,1),
  dietary_tags  TEXT[] DEFAULT '{}',
  source        TEXT DEFAULT 'text',        -- text | screenshot | chat | seed (shown as a tag on group page)
  source_text   TEXT,                       -- original pasted text / screenshot note
  needs_review  BOOLEAN DEFAULT FALSE,      -- SerpApi found nothing -> manual edit
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE card_shares (
  id       SERIAL PRIMARY KEY,
  card_id  INT REFERENCES cards(id) ON DELETE CASCADE,
  group_id INT REFERENCES groups(id) ON DELETE CASCADE,
  user_id  INT REFERENCES users(id) ON DELETE CASCADE,  -- direct share to a friend
  CHECK (group_id IS NOT NULL OR user_id IS NOT NULL)
);

CREATE TABLE events (
  id          SERIAL PRIMARY KEY,
  group_id    INT REFERENCES groups(id) ON DELETE SET NULL,  -- NULL for logged hangouts outside a group
  card_id     INT REFERENCES cards(id),                      -- NULL for logged hangouts
  title       TEXT NOT NULL,
  starts_at   TIMESTAMPTZ,
  status      TEXT DEFAULT 'proposed' CHECK (status IN ('proposed','confirmed','happened')),
  est_cost_total NUMERIC(8,2),
  reasoning   TEXT,                         -- planner's visible explanation
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE event_attendees (
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  user_id  INT REFERENCES users(id) ON DELETE CASCADE,
  confirmed BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (event_id, user_id)
);

-- Free windows for the manual availability picker (Google Calendar is a P2 upgrade)
CREATE TABLE availability (
  id       SERIAL PRIMARY KEY,
  user_id  INT REFERENCES users(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at   TIMESTAMPTZ NOT NULL
);

CREATE TABLE expenses (
  id         SERIAL PRIMARY KEY,
  event_id   INT REFERENCES events(id) ON DELETE CASCADE,
  payer_id   INT REFERENCES users(id),      -- who fronted the cost
  owed_by    INT REFERENCES users(id),      -- who owes
  amount     NUMERIC(8,2) NOT NULL,
  nessie_bill_id TEXT,                      -- id returned by Nessie
  settled    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON card_shares (group_id);
CREATE INDEX ON events (group_id, status);
CREATE INDEX ON expenses (owed_by, settled);
