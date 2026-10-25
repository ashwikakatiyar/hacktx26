-- Demo data. User 1 (Alex) is "you". Friends 2..10 make up the village.
-- Days since last hangout with Alex -> cottage state (thriving <=14, weathered 15-56, run-down >56):
--   thriving : Sam 3, Jordan 3, Riley 6, Marcus 10
--   weathered: Kai 28, Priya 35, Mei 49
--   run-down : Dani 90, Theo 140
-- 9 friends fill 9 of 12 plots, so row 3 has open plots.
-- The four bundled profile photos are stored at /avatars/{alex,sam,priya,jordan}.jpg.
INSERT INTO
  users (
    id,
    name,
    age_range,
    gender,
    avatar_url,
    onboarded
  )
VALUES
  (
    1,
    'Alex',
    '18-24',
    'woman',
    '/avatars/alex.jpg',
    TRUE
  ),
  (
    2,
    'Sam',
    '18-24',
    'man',
    '/avatars/sam.jpg',
    TRUE
  ),
  (
    3,
    'Priya',
    '18-24',
    'woman',
    '/avatars/priya.jpg',
    TRUE
  ),
  (
    4,
    'Jordan',
    '18-24',
    'non-binary',
    '/avatars/jordan.jpg',
    TRUE
  ),
  (
    5,
    'Marcus',
    '25-34',
    'man',
    NULL,
    TRUE
  ),
  (
    6,
    'Dani',
    '18-24',
    'woman',
    NULL,
    TRUE
  ),
  (
    7,
    'Riley',
    '18-24',
    'non-binary',
    NULL,
    TRUE
  ),
  (
    8,
    'Kai',
    '18-24',
    'man',
    NULL,
    TRUE
  ),
  (
    9,
    'Mei',
    '25-34',
    'woman',
    NULL,
    TRUE
  ),
  (
    10,
    'Theo',
    '25-34',
    'man',
    NULL,
    TRUE
  );

INSERT INTO
  constraints (
    user_id,
    dietary,
    accessibility,
    can_drive,
    transport,
    location,
    lat,
    lng,
    radius_miles,
    budget_max,
    interests
  )
VALUES
  (
    1,
    '{}',
    '{}',
    TRUE,
    'car',
    'Austin, TX',
    30.2849,
    -97.7341,
    15,
    3,
    '{food,live music,outdoors}'
  ),
  (
    2,
    '{vegetarian}',
    '{}',
    FALSE,
    'transit',
    'Austin, TX',
    30.2672,
    -97.7431,
    8,
    2,
    '{food,games,coffee}'
  ),
  (
    3,
    '{gluten-free}',
    '{}',
    TRUE,
    'car',
    'Austin, TX',
    30.2500,
    -97.7500,
    12,
    3,
    '{food,art,outdoors}'
  ),
  (
    4,
    '{}',
    '{step-free}',
    FALSE,
    'transit',
    'Austin, TX',
    30.2900,
    -97.7300,
    6,
    2,
    '{coffee,games,art}'
  ),
  (
    5,
    '{}',
    '{}',
    TRUE,
    'car',
    'Austin, TX',
    30.2700,
    -97.7200,
    20,
    4,
    '{food,live music}'
  ),
  (
    6,
    '{}',
    '{}',
    TRUE,
    'car',
    'Austin, TX',
    30.2600,
    -97.7600,
    15,
    2,
    '{outdoors,climbing}'
  ),
  (
    7,
    '{}',
    '{}',
    FALSE,
    'bike',
    'Austin, TX',
    30.2750,
    -97.7400,
    5,
    2,
    '{food,live music}'
  ),
  (
    8,
    '{}',
    '{}',
    TRUE,
    'car',
    'Austin, TX',
    30.3000,
    -97.7200,
    15,
    3,
    '{food,games}'
  ),
  (
    9,
    '{pescatarian}',
    '{}',
    FALSE,
    'transit',
    'Austin, TX',
    30.2800,
    -97.7500,
    8,
    2,
    '{coffee,art}'
  ),
  (
    10,
    '{}',
    '{}',
    TRUE,
    'car',
    'Austin, TX',
    30.2400,
    -97.7700,
    20,
    3,
    '{food,games}'
  );

INSERT INTO
  groups (id, name, meet_frequency_days, goal_interests)
VALUES
  (1, 'Austin Crew', 21, '{food,live music}'),
  (2, 'Study Break', 14, '{coffee,games}'),
  (3, 'Weekend Crew', 30, '{outdoors,climbing}');

INSERT INTO
  group_members (group_id, user_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (2, 1),
  (2, 2),
  (2, 4),
  (3, 1),
  (3, 6),
  (3, 7),
  (3, 8);

-- Cards (ideas people pasted in). Images are NULL until enrichment fills them.
INSERT INTO
  cards (
    id,
    created_by,
    name,
    activity_type,
    address,
    image_url,
    price_level,
    rating,
    dietary_tags,
    source,
    source_text
  )
VALUES
  (
    1,
    1,
    'Ramen Tatsu-Ya',
    'dinner',
    '8557 Research Blvd, Austin, TX',
    NULL,
    2,
    4.6,
    '{}',
    'seed',
    'omg we have to try this ramen place'
  ),
  (
    2,
    2,
    'Bouldin Creek Café',
    'dinner',
    '1900 S 1st St, Austin, TX',
    NULL,
    2,
    4.5,
    '{vegetarian,gluten-free}',
    'seed',
    'veggie friendly spot sam found'
  ),
  (
    3,
    3,
    'Barton Springs Pool',
    'outdoors',
    '2131 William Barton Dr, Austin, TX',
    NULL,
    1,
    4.8,
    '{}',
    'seed',
    'sunset swim??'
  ),
  (
    4,
    5,
    'Odd Duck',
    'dinner',
    '1201 S Lamar Blvd, Austin, TX',
    NULL,
    3,
    4.6,
    '{vegetarian,gluten-free}',
    'seed',
    'farm to table, marcus is paying lol'
  ),
  (
    5,
    4,
    'Mozart''s Coffee Roasters',
    'coffee',
    '3825 Lake Austin Blvd, Austin, TX',
    NULL,
    2,
    4.5,
    '{vegetarian}',
    'seed',
    'lakeside coffee'
  ),
  (
    6,
    6,
    'Austin Bouldering Project',
    'outdoors',
    '979 Springdale Rd, Austin, TX',
    NULL,
    2,
    4.7,
    '{}',
    'seed',
    'we should go climbing'
  );

INSERT INTO
  card_shares (card_id, group_id)
VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1),
  (5, 1),
  (5, 2),
  (6, 3);

-- Happened events. Each one sets last_hung_out for every attendee pair (derived below).
INSERT INTO
  events (
    id,
    group_id,
    card_id,
    title,
    starts_at,
    status,
    est_cost_total,
    reasoning
  )
VALUES
  (
    1,
    1,
    1,
    'Ramen night',
    now() - interval '1 year',
    'happened',
    90.00,
    'Seeded history'
  ),
  (
    2,
    1,
    3,
    'Sunset swim',
    now() - interval '35 days',
    'happened',
    20.00,
    'Seeded history'
  ),
  (
    3,
    2,
    5,
    'Coffee + games',
    now() - interval '3 days',
    'happened',
    35.00,
    'Seeded history'
  ),
  (
    4,
    1,
    4,
    'Dinner at Odd Duck',
    now() - interval '10 days',
    'happened',
    140.00,
    'Seeded history'
  ),
  (
    5,
    3,
    NULL,
    'Taco night',
    now() - interval '6 days',
    'happened',
    30.00,
    'Seeded history'
  ),
  (
    6,
    3,
    NULL,
    'Karaoke',
    now() - interval '28 days',
    'happened',
    45.00,
    'Seeded history'
  ),
  (
    7,
    NULL,
    NULL,
    'Brunch',
    now() - interval '49 days',
    'happened',
    40.00,
    'Logged hangout'
  ),
  (
    8,
    3,
    6,
    'Climbing night',
    now() - interval '90 days',
    'happened',
    36.00,
    'Seeded history'
  ),
  (
    9,
    NULL,
    NULL,
    'Game night',
    now() - interval '140 days',
    'happened',
    0.00,
    'Logged hangout'
  );

INSERT INTO
  event_attendees (event_id, user_id, confirmed)
VALUES
  (1, 1, TRUE),
  (1, 2, TRUE),
  (1, 3, TRUE),
  (1, 4, TRUE),
  (1, 5, TRUE),
  (2, 1, TRUE),
  (2, 3, TRUE),
  (3, 1, TRUE),
  (3, 2, TRUE),
  (3, 4, TRUE),
  (4, 1, TRUE),
  (4, 5, TRUE),
  (5, 1, TRUE),
  (5, 7, TRUE),
  (6, 1, TRUE),
  (6, 8, TRUE),
  (7, 1, TRUE),
  (7, 9, TRUE),
  (8, 1, TRUE),
  (8, 6, TRUE),
  (9, 1, TRUE),
  (9, 10, TRUE);

-- Friend pairs derived from happened events: last_hung_out + hangout_count stay consistent with the history above.
INSERT INTO
  friendships (user_a, user_b, last_hung_out, hangout_count)
SELECT
  LEAST(a.user_id, b.user_id),
  GREATEST(a.user_id, b.user_id),
  max(e.starts_at),
  count(*)
FROM
  event_attendees a
  JOIN event_attendees b ON a.event_id = b.event_id
  AND a.user_id < b.user_id
  JOIN events e ON e.id = a.event_id
  AND e.status = 'happened'
GROUP BY
  1,
  2;

-- Pairs who share a group but haven't hung out yet still count as friends.
INSERT INTO
  friendships (user_a, user_b)
SELECT DISTINCT
  LEAST(a.user_id, b.user_id),
  GREATEST(a.user_id, b.user_id)
FROM
  group_members a
  JOIN group_members b ON a.group_id = b.group_id
  AND a.user_id < b.user_id
ON CONFLICT DO NOTHING;

-- Free windows (manual picker mock). Everyone overlaps Friday evening next week.
INSERT INTO
  availability (user_id, starts_at, ends_at)
SELECT
  u.id,
  date_trunc('week', now()) + interval '11 days' + interval '18 hours',
  date_trunc('week', now()) + interval '11 days' + interval '22 hours'
FROM
  users u;

SELECT
  setval(
    'users_id_seq',
    (
      SELECT
        max(id)
      FROM
        users
    )
  );

SELECT
  setval(
    'groups_id_seq',
    (
      SELECT
        max(id)
      FROM
        groups
    )
  );

SELECT
  setval(
    'cards_id_seq',
    (
      SELECT
        max(id)
      FROM
        cards
    )
  );

SELECT
  setval(
    'events_id_seq',
    (
      SELECT
        max(id)
      FROM
        events
    )
  );
