import { query } from "@/lib/db";
import { actor, positiveId, member, bad } from "@/lib/phase2";
export const runtime = "nodejs";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const me = actor(req),
    id = positiveId((await params).id);
  if (!me || !id) return bad("invalid request");
  if (!(await member(id, me))) return bad("not a group member", 403);
  const members = await query(
    `SELECT u.id,u.name,c.dietary,c.accessibility,c.can_drive,c.transport,c.location,c.lat,c.lng,c.radius_miles,c.budget_max,c.interests FROM group_members gm JOIN users u ON u.id=gm.user_id LEFT JOIN constraints c ON c.user_id=u.id WHERE gm.group_id=$1 ORDER BY u.id`,
    [id],
  );
  const cards = await query(
    `SELECT DISTINCT c.id,c.name,c.activity_type,c.address,c.price_level,c.dietary_tags,c.rating FROM card_shares s JOIN cards c ON c.id=s.card_id WHERE s.group_id=$1 ORDER BY c.id`,
    [id],
  );
  const availability = await query(
    `SELECT a.user_id,a.starts_at,a.ends_at FROM availability a JOIN group_members gm ON gm.user_id=a.user_id WHERE gm.group_id=$1 AND a.ends_at>now() ORDER BY a.starts_at LIMIT 200`,
    [id],
  );
  return Response.json({ group_id: id, members, cards, availability });
}
