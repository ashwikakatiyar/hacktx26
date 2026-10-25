import {query} from '@/lib/db';import {actor,bad} from '@/lib/phase2';import {nessie} from '@/lib/nessie';export const runtime='nodejs';
export async function GET(req:Request){const me=actor(req);if(!me)return bad('invalid user');const r=await query('SELECT nessie_account_id FROM users WHERE id=$1',[me]);if(!r.length)return bad('user not found',404);
 if(!r[0].nessie_account_id)return bad('no Nessie account linked for this user',422);
 try{const account=await nessie('GET',`/accounts/${encodeURIComponent(r[0].nessie_account_id)}`);return Response.json({account});}catch(e){return Response.json({error:e instanceof Error?e.message:'Nessie unavailable'},{status:502});}}
