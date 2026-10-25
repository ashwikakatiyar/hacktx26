import { query } from "@/lib/db";
import { actor, bad, parse, ids, exists } from "@/lib/phase2";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const me = actor(req);
  if (!me) return bad("invalid user");
  return Response.json({
    groups: await query(
      `SELECT g.id,g.name,g.meet_frequency_days,g.goal_interests,COALESCE((SELECT json_agg(json_build_object('id',u.id,'name',u.name,'avatar_url',u.avatar_url) ORDER BY u.id) FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=g.id),'[]') AS members,(SELECT count(DISTINCT card_id)::int FROM card_shares WHERE group_id=g.id) AS card_count FROM groups g JOIN group_members mine ON mine.group_id=g.id AND mine.user_id=$1 ORDER BY g.id`,
      [me],
    ),
  });
}
export async function POST(req: Request) {
  const me = actor(req),
    body = await parse(req);
  if (!me || !(await exists("users", me))) return bad("invalid user", 400);
  if (
    typeof body?.name !== "string" ||
    !body.name.trim() ||
    body.name.length > 120
  )
    return bad("name required");
  const members = body.member_ids === undefined ? [] : ids(body.member_ids);
  if (!members) return bad("invalid member_ids");
  if (
    body.meet_frequency_days !== undefined &&
    (!Number.isInteger(body.meet_frequency_days) ||
      body.meet_frequency_days < 1)
  )
    return bad("invalid frequency");
  if (
    body.goal_interests !== undefined &&
    (!Array.isArray(body.goal_interests) ||
      body.goal_interests.some((x: unknown) => typeof x !== "string"))
  )
    return bad("invalid interests");
  const all = [...new Set([me, ...members])];
  const users = await query("SELECT id FROM users WHERE id=ANY($1::int[])", [
    all,
  ]);
  if (users.length !== all.length) return bad("member not found", 404);
  const { pool } = await import("@/lib/db");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const r = await client.query(
      "INSERT INTO groups(name,meet_frequency_days,goal_interests) VALUES($1,$2,$3) RETURNING *",
      [
        body.name.trim(),
        body.meet_frequency_days ?? 30,
        body.goal_interests ?? [],
      ],
    );
    for (const uid of all)
      await client.query(
        "INSERT INTO group_members(group_id,user_id) VALUES($1,$2)",
        [r.rows[0].id, uid],
      );
    await client.query("COMMIT");
    return Response.json(
      { group: r.rows[0], member_ids: all },
      { status: 201 },
    );
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
