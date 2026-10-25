import { pool } from "@/lib/db";
import { actor, positiveId, member, bad } from "@/lib/phase2";
import { austinLocalToUtc, GROUP_TIME_ZONE } from "@/lib/timezone";
export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const me = actor(req), groupId = positiveId((await params).id);
  if (!me || !groupId) return bad("invalid request");
  if (!(await member(groupId, me))) return bad("not a group member", 403);
  let body: any;
  try { body = await req.json(); } catch { return bad("invalid JSON"); }
  if (typeof body?.starts_at_local !== "string" || typeof body?.ends_at_local !== "string")
    return bad("starts_at_local and ends_at_local required, e.g. 2026-10-30T18:00");
  let start: string, end: string;
  try {
    start = austinLocalToUtc(body.starts_at_local);
    end = austinLocalToUtc(body.ends_at_local);
  } catch (e) { return bad((e as Error).message); }
  if (Date.parse(end) <= Date.parse(start)) return bad("end must be after start");
  if (Date.parse(end) - Date.parse(start) > 24 * 60 * 60 * 1000) return bad("window cannot exceed 24 hours");
  // Explicit opt-in: replace only this user's overlapping availability, never other members'.
  // This removes stale demo windows (e.g. 18:00Z) when switching to 6 PM local.
  const replace = body.replace_overlapping === true;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1, $2)", [91722, me]);
    if (replace) await client.query("DELETE FROM availability WHERE user_id=$1 AND starts_at < $3::timestamptz AND ends_at > $2::timestamptz", [me, start, end]);
    const existing = await client.query("SELECT id FROM availability WHERE user_id=$1 AND starts_at=$2::timestamptz AND ends_at=$3::timestamptz LIMIT 1", [me, start, end]);
    const id = existing.rowCount ? existing.rows[0].id : (await client.query("INSERT INTO availability(user_id,starts_at,ends_at) VALUES($1,$2,$3) RETURNING id", [me, start, end])).rows[0].id;
    await client.query("COMMIT");
    return Response.json({ availability_id: id, user_id: me, group_id: groupId, starts_at: start, ends_at: end, timezone: GROUP_TIME_ZONE, reused: Boolean(existing.rowCount) });
  } catch (e) { await client.query("ROLLBACK"); console.error("availability save failed", e); return bad("availability save failed", 500); }
  finally { client.release(); }
}
