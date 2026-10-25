import { query } from "./db";
import type { CardDraft } from "./pipeline";

export type Card = {
  id: number;
  created_by: number | null;
  created_by_name: string | null;
  name: string;
  activity_type: string | null;
  address: string | null;
  image_url: string | null;
  price_level: number | null;
  rating: number | null;
  dietary_tags: string[];
  source: string | null;
  source_text: string | null;
  needs_review: boolean;
  shared_groups: string[];
  created_at: string;
};

const SELECT = `
  SELECT c.*, u.name AS created_by_name,
    COALESCE((SELECT array_agg(DISTINCT g.name) FROM card_shares s JOIN groups g ON g.id = s.group_id WHERE s.card_id = c.id), '{}') AS shared_groups
  FROM cards c LEFT JOIN users u ON u.id = c.created_by`;

// pg returns NUMERIC as string; the app wants numbers.
function mapRow(r: any): Card {
  return { ...r, rating: r.rating == null ? null : Number(r.rating) };
}

export async function getCard(id: number): Promise<Card | null> {
  const rows = await query(`${SELECT} WHERE c.id = $1`, [id]);
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function listCards(groupId?: number): Promise<Card[]> {
  const rows = await query(
    `${SELECT}
     WHERE ($1::int IS NULL OR EXISTS (SELECT 1 FROM card_shares s WHERE s.card_id = c.id AND s.group_id = $1))
     ORDER BY c.created_at DESC, c.id DESC LIMIT 100`,
    [groupId ?? null],
  );
  return rows.map(mapRow);
}

export async function insertCard(
  d: CardDraft,
  userId: number,
): Promise<number> {
  const rows = await query<{ id: number }>(
    `INSERT INTO cards (created_by, name, activity_type, address, image_url, price_level, rating, dietary_tags, source, source_text, needs_review)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    [
      userId,
      d.name,
      d.activity_type,
      d.address,
      d.image_url,
      d.price_level,
      d.rating,
      d.dietary_tags,
      d.source,
      d.source_text,
      d.needs_review,
    ],
  );
  return rows[0].id;
}

export async function shareCard(
  cardId: number,
  groupIds: number[],
  userIds: number[] = [],
) {
  for (const gid of groupIds) {
    await query(
      `INSERT INTO card_shares (card_id, group_id) SELECT $1, $2
       WHERE NOT EXISTS (SELECT 1 FROM card_shares WHERE card_id = $1 AND group_id = $2)`,
      [cardId, gid],
    );
  }
  for (const uid of userIds) {
    await query(
      `INSERT INTO card_shares (card_id, user_id) SELECT $1, $2
       WHERE NOT EXISTS (SELECT 1 FROM card_shares WHERE card_id = $1 AND user_id = $2)`,
      [cardId, uid],
    );
  }
}

const EDITABLE = [
  "name",
  "activity_type",
  "address",
  "image_url",
  "price_level",
] as const;

export async function updateCard(id: number, patch: Record<string, unknown>) {
  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const k of EDITABLE) {
    if (k in patch) {
      vals.push(patch[k] === "" ? null : patch[k]);
      sets.push(`${k} = $${vals.length}`);
    }
  }
  if (!sets.length) return;
  vals.push(id);
  await query(
    `UPDATE cards SET ${sets.join(", ")}, needs_review = FALSE WHERE id = $${vals.length}`,
    vals,
  );
}
