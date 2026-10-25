import {query} from "@/lib/db";
import {actor,positiveId,bad,parse,exists} from "@/lib/phase2";
export const runtime="nodejs";
export async function GET(req:Request) {const me=actor(req);if(!me)return bad("invalid user");return Response.json({friends:await query(`SELECT u.id,u.name,u.avatar_url,f.last_hung_out,f.hangout_count FROM friendships f JOIN users u ON u.id=CASE WHEN f.user_a=$1 THEN f.user_b ELSE f.user_a END WHERE f.user_a=$1 OR f.user_b=$1 ORDER BY u.name`,[me])});}
export async function POST(req:Request) {const me=actor(req),body=await parse(req),other=positiveId(body?.user_id);if(!me||!other||me===other)return bad("invalid friend");if(!await exists("users",me)||!await exists("users",other))return bad("user not found",404);await query("INSERT INTO friendships(user_a,user_b) VALUES ($1,$2) ON CONFLICT DO NOTHING",[Math.min(me,other),Math.max(me,other)]);return Response.json({friend_id:other}, {status:201});}
