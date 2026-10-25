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
  if (!(await member(id, me))) return bad("not found or forbidden", 403);
  const groups = await query("SELECT * FROM groups WHERE id=$1", [id]);
  const members = await query(
    "SELECT u.id,u.name,u.avatar_url,c.dietary,c.accessibility,c.transport,c.can_drive,c.budget_max,c.radius_miles FROM group_members gm JOIN users u ON u.id=gm.user_id LEFT JOIN constraints c ON c.user_id=u.id WHERE gm.group_id=$1 ORDER BY u.id",
    [id],
  );
  const cards = await query(
    "SELECT DISTINCT c.*,u.name AS created_by_name FROM card_shares s JOIN cards c ON c.id=s.card_id LEFT JOIN users u ON u.id=c.created_by WHERE s.group_id=$1 ORDER BY c.created_at DESC",
    [id],
  );
  return Response.json({ group: groups[0], members, cards });
}
