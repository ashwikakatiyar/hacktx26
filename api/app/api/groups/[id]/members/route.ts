import { query } from "@/lib/db";
import { actor, positiveId, member, bad, parse, exists } from "@/lib/phase2";
export const runtime = "nodejs";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const me = actor(req),
    id = positiveId((await params).id),
    body = await parse(req),
    uid = positiveId(body?.user_id);
  if (!me || !id || !uid) return bad("invalid request");
  if (!(await member(id, me))) return bad("not a group member", 403);
  if (!(await exists("users", uid))) return bad("user not found", 404);
  await query(
    "INSERT INTO group_members(group_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
    [id, uid],
  );
  return Response.json({ group_id: id, user_id: uid }, { status: 201 });
}
