-- Demo data: the group "Austin Crew" with 5 friends, varied constraints.

INSERT INTO users (id, name, age_range, gender, avatar_url, onboarded) VALUES
  (1, 'Alex',  '18-24', 'woman',      'https://i.pravatar.cc/150?img=47', TRUE),
  (2, 'Sam',   '18-24', 'man',        'https://i.pravatar.cc/150?img=12', TRUE),
  (3, 'Priya', '18-24', 'woman',      'https://i.pravatar.cc/150?img=32', TRUE),
  (4, 'Jordan','18-24', 'non-binary', 'https://i.pravatar.cc/150?img=15', TRUE),
  (5, 'Marcus','25-34', 'man',        'https://i.pravatar.cc/150?img=53', TRUE);

INSERT INTO constraints
  (user_id, dietary, accessibility, can_drive, transport, location, lat, lng, radius_miles, budget_max, interests) VALUES
  (1, '{}',                '{}',          TRUE,  'car',     'Austin, TX', 30.2849, -97.7341, 15, 3, '{food,live music,outdoors}'),
  (2, '{vegetarian}',      '{}',          FALSE, 'transit', 'Austin, TX', 30.2672, -97.7431, 8,  2, '{food,games,coffee}'),
  (3, '{gluten-free}',     '{}',          TRUE,  'car',     'Austin, TX', 30.2500, -97.7500, 12, 3, '{food,art,outdoors}'),
  (4, '{}',                '{step-free}', FALSE, 'transit', 'Austin, TX', 30.2900, -97.7300, 6,  2, '{coffee,games,art}'),
  (5, '{}',                '{}',          TRUE,  'car',     'Austin, TX', 30.2700, -97.7200, 20, 4, '{food,live music}');

INSERT INTO friendships (user_id, friend_id)
SELECT a.id, b.id FROM users a, users b WHERE a.id <> b.id;

INSERT INTO groups (id, name, meet_frequency_days, goal_interests) VALUES
  (1, 'Austin Crew',   21, '{food,live music}'),
  (2, 'Study Break',   14, '{coffee,games}');

INSERT INTO group_members (group_id, user_id) VALUES
  (1,1),(1,2),(1,3),(1,4),(1,5),
  (2,1),(2,2),(2,4);

-- Cards (ideas people have pasted in). Real Austin spots; images are placeholders until SerpApi enrichment.
INSERT INTO cards (id, created_by, name, activity_type, address, image_url, price_level, rating, dietary_tags, source_text) VALUES
  (1, 1, 'Ramen Tatsu-Ya',        'dinner', '8557 Research Blvd, Austin, TX', NULL, 2, 4.6, '{}',                       'omg we have to try this ramen place'),
  (2, 2, 'Bouldin Creek Café',    'dinner', '1900 S 1st St, Austin, TX',      NULL, 2, 4.5, '{vegetarian,gluten-free}', 'veggie friendly spot sam found'),
  (3, 3, 'Barton Springs Pool',   'outdoors','2131 William Barton Dr, Austin, TX', NULL, 1, 4.8, '{}',                  'sunset swim??'),
  (4, 5, 'Odd Duck',              'dinner', '1201 S Lamar Blvd, Austin, TX',  NULL, 3, 4.6, '{vegetarian,gluten-free}', 'farm to table, marcus is paying lol'),
  (5, 4, 'Mozart''s Coffee Roasters','coffee','3825 Lake Austin Blvd, Austin, TX', NULL, 2, 4.5, '{vegetarian}',          'lakeside coffee');

INSERT INTO card_shares (card_id, group_id) VALUES
  (1,1),(2,1),(3,1),(4,1),(5,1),(5,2);

-- Past events (powers "a year ago you all tried..." memory resurfacing)
INSERT INTO events (id, group_id, card_id, title, starts_at, status, est_cost_total, reasoning) VALUES
  (1, 1, 1, 'Ramen night',      now() - interval '1 year',   'past', 90.00,  'Seeded history'),
  (2, 1, 3, 'Sunset swim',      now() - interval '5 weeks',  'past', 20.00,  'Seeded history'),
  (3, 2, 5, 'Coffee + games',   now() - interval '3 weeks',  'past', 35.00,  'Seeded history');

INSERT INTO event_attendees (event_id, user_id, confirmed) VALUES
  (1,1,TRUE),(1,2,TRUE),(1,3,TRUE),(1,4,TRUE),(1,5,TRUE),
  (2,1,TRUE),(2,3,TRUE),(2,5,TRUE),
  (3,1,TRUE),(3,2,TRUE),(3,4,TRUE);

-- Free windows (manual picker mock). Everyone overlaps Friday evening next week.
INSERT INTO availability (user_id, starts_at, ends_at)
SELECT u.id,
       date_trunc('week', now()) + interval '11 days' + interval '18 hours',
       date_trunc('week', now()) + interval '11 days' + interval '22 hours'
FROM users u;

SELECT setval('users_id_seq',  (SELECT max(id) FROM users));
SELECT setval('groups_id_seq', (SELECT max(id) FROM groups));
SELECT setval('cards_id_seq',  (SELECT max(id) FROM cards));
SELECT setval('events_id_seq', (SELECT max(id) FROM events));
