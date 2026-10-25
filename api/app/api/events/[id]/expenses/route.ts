import {pool,query} from '@/lib/db';
import {actor,positiveId,bad,parse} from '@/lib/phase2';
export const runtime='nodejs';
type Ctx={params:Promise<{id:string}>};
async function access(eventId:number,userId:number){const r=await query(`SELECT e.id,e.group_id,e.status FROM events e JOIN group_members gm ON gm.group_id=e.group_id AND gm.user_id=$2 WHERE e.id=$1`,[eventId,userId]);return r[0]??null;}
export async function GET(req:Request,{params}:Ctx){const me=actor(req),id=positiveId((await params).id);if(!me||!id)return bad('invalid request');if(!await access(id,me))return bad('event not found or forbidden',403);
 const expenses=await query(`SELECT ex.id,ex.event_id,ex.payer_id,ex.owed_by,ex.amount,ex.description,ex.settled,ex.settlement_state,ex.nessie_transfer_id,ex.created_at,p.name AS payer_name,o.name AS owed_by_name FROM expenses ex JOIN users p ON p.id=ex.payer_id JOIN users o ON o.id=ex.owed_by WHERE ex.event_id=$1 ORDER BY ex.id`,[id]);return Response.json({event_id:id,expenses});}
export async function POST(req:Request,{params}:Ctx){const me=actor(req),id=positiveId((await params).id);if(!me||!id)return bad('invalid request');const data=await parse(req);
 const payer=positiveId(data?.payer_id),cents=Number.isSafeInteger(data?.amount_cents)?data.amount_cents:null;
 if(!payer||!cents||cents<1||cents>100000000)return bad('payer_id and positive integer amount_cents required');
 const description=typeof data.description==='string'?data.description.trim().slice(0,250):'';
 const key=typeof data.idempotency_key==='string'?data.idempotency_key.trim():'';
 if(!/^[A-Za-z0-9_-]{1,120}$/.test(key))return bad('idempotency_key required (1-120 characters)');
 const client=await pool.connect();try{await client.query('BEGIN');const e=await client.query(`SELECT e.id,e.group_id,e.status FROM events e JOIN group_members gm ON gm.group_id=e.group_id AND gm.user_id=$2 WHERE e.id=$1 FOR UPDATE OF e`,[id,me]);if(!e.rowCount){await client.query('ROLLBACK');return bad('event not found or forbidden',403);}
 if(!['confirmed','happened'].includes(e.rows[0].status)){await client.query('ROLLBACK');return bad('event must be confirmed or happened',409);}
 const members=await client.query(`SELECT user_id FROM group_members WHERE group_id=$1 ORDER BY user_id`,[e.rows[0].group_id]);const ids=members.rows.map(r=>Number(r.user_id));if(!ids.includes(payer)||ids.length<2){await client.query('ROLLBACK');return bad('payer must belong to a group with at least two members');}
 const prefix=`${id}:${key}:`;const previous=await client.query(`SELECT id,payer_id,amount,owed_by,description FROM expenses WHERE split_key LIKE $1 ORDER BY owed_by`,[prefix+'%']);
 if(previous.rowCount){await client.query('COMMIT');return Response.json({event_id:id,reused:true,shares:previous.rows});}
 const base=Math.floor(cents/ids.length),extra=cents%ids.length;const shares=[];
 for(let i=0;i<ids.length;i++){const uid=ids[i],shareCents=base+(i<extra?1:0);if(uid===payer)continue;
 const res=await client.query(`INSERT INTO expenses(event_id,payer_id,owed_by,amount,description,split_key) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,payer_id,owed_by,amount,settlement_state`,[id,payer,uid,(shareCents/100).toFixed(2),description,prefix+uid]);shares.push(res.rows[0]);}
 await client.query('COMMIT');return Response.json({event_id:id,reused:false,total_cents:cents,participants:ids,shares},{status:201});
 }catch(err){await client.query('ROLLBACK');throw err;}finally{client.release();}}
