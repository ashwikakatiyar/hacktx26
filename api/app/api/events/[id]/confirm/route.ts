import { pool } from "@/lib/db";
import { actor, positiveId, bad } from "@/lib/phase2";
export const runtime = "nodejs";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const me = actor(req),
    id = positiveId((await params).id);
  if (!me || !id) return bad("invalid request");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const event = await client.query(
      `SELECT e.id,e.group_id,e.status FROM events e JOIN group_members gm ON gm.group_id=e.group_id AND gm.user_id=$2 WHERE e.id=$1 FOR UPDATE OF e`,
      [id, me],
    );
    if (!event.rowCount) {
      await client.query("ROLLBACK");
      return bad("event not found or not a member", 403);
    }
    if (event.rows[0].status !== "proposed") {
      await client.query("ROLLBACK");
      return bad("event is not proposed", 409);
    }
    const result = await client.query(
      `UPDATE events SET status='confirmed' WHERE id=$1 RETURNING id,group_id,card_id,title,starts_at,status,reasoning`,
      [id],
    );
    await client.query(
      `UPDATE event_attendees SET confirmed=true WHERE event_id=$1`,
      [id],
    );
    await client.query("COMMIT");
    return Response.json({ event: result.rows[0] });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
