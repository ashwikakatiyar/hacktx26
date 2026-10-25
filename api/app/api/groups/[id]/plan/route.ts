import {pool} from "@/lib/db";
import {actor,positiveId,member,bad} from "@/lib/phase2";
import {context,fallback,museProposal} from "@/lib/planner";
export const runtime="nodejs";
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 const me=actor(req),id=positiveId((await params).id);if(!me||!id)return bad("invalid request");
 if(!await member(id,me))return bad("not a group member",403);
 const ctx=await context(id);const candidate=fallback(ctx);
 if(!candidate)return bad("group must have members and shared cards",422);
 const plan=await museProposal(ctx,candidate);
 if(!plan.starts_at)return Response.json({proposal:plan,saved:false,message:"No common one-hour availability; add overlapping free time before saving an event."},{status:422});
 // Serialize plan creation for this group, including concurrent double-clicks.
 const client=await pool.connect();
 try {
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock($1, $2)",[91721,id]);
  const existing=await client.query(`SELECT id,status FROM events WHERE group_id=$1 AND card_id=$2 AND starts_at=$3::timestamptz AND status IN ('proposed','confirmed') ORDER BY CASE WHEN status='confirmed' THEN 0 ELSE 1 END,id DESC LIMIT 1`,[id,plan.card_id,plan.starts_at]);
  if(existing.rowCount){
   await client.query("COMMIT");
   return Response.json({event_id:existing.rows[0].id,proposal:plan,saved:true,reused:true,event_status:existing.rows[0].status,timezone:"America/Chicago"});
  }
  const saved=await client.query(`INSERT INTO events(group_id,card_id,title,starts_at,status,reasoning) VALUES($1,$2,$3,$4,'proposed',$5) RETURNING id`,[id,plan.card_id,plan.title,plan.starts_at,plan.reasoning]);
  const eventId=saved.rows[0].id;
  await client.query(`INSERT INTO event_attendees(event_id,user_id) SELECT $1,user_id FROM group_members WHERE group_id=$2 ON CONFLICT DO NOTHING`,[eventId,id]);
  await client.query("COMMIT");
  return Response.json({event_id:eventId,proposal:plan,saved:true,reused:false,event_status:"proposed",timezone:"America/Chicago"},{status:201});
 } catch(err){await client.query("ROLLBACK");throw err;}finally{client.release();}
}
