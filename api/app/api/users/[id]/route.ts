import {query} from "@/lib/db";
import {actor,positiveId,bad} from "@/lib/phase2";
export const runtime="nodejs";
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}) { const id=positiveId((await params).id); const me=actor(req); if(!id||!me)return bad("invalid user",400); if(id!==me)return bad("forbidden",403); const users=await query("SELECT id,name,age_range,gender,avatar_url,onboarded FROM users WHERE id=$1",[id]); if(!users.length)return bad("user not found",404); const constraints=await query("SELECT * FROM constraints WHERE user_id=$1",[id]); return Response.json({user:users[0],constraints:constraints[0]??null}); }
