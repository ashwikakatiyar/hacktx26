import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { DEMO_USER_ID } from "@/lib/config";

export const runtime = "nodejs";

// Groups the current user belongs to, with member avatars and idea counts.
export async function GET(req: Request) {
  const userId = Number(req.headers.get("x-user-id")) || DEMO_USER_ID;
  const groups = await query(
    `SELECT g.id, g.name, g.meet_frequency_days,
       COALESCE((SELECT json_agg(json_build_object('id', u.id, 'name', u.name, 'avatar_url', u.avatar_url) ORDER BY u.id)
                 FROM group_members gm JOIN users u ON u.id = gm.user_id WHERE gm.group_id = g.id), '[]') AS members,
       (SELECT count(*) FROM card_shares s WHERE s.group_id = g.id)::int AS card_count
     FROM groups g JOIN group_members me ON me.group_id = g.id AND me.user_id = $1
     ORDER BY g.id`,
    [userId]
  );
  return NextResponse.json({ groups });
}
