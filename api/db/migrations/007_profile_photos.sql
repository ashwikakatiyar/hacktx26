-- Replace stock demo faces with the four bundled team portraits.
-- Run once against an existing demo database; the files are served from api/public/avatars.
UPDATE users
SET avatar_url = CASE id
  WHEN 1 THEN '/avatars/alex.jpg'
  WHEN 2 THEN '/avatars/sam.jpg'
  WHEN 3 THEN '/avatars/priya.jpg'
  WHEN 4 THEN '/avatars/jordan.jpg'
  ELSE NULL
END
WHERE id BETWEEN 1 AND 10;
