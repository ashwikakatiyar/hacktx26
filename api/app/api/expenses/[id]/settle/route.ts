import {pool} from '@/lib/db';import {actor,positiveId,bad} from '@/lib/phase2';import {nessie,transferId} from '@/lib/nessie';
export const runtime='nodejs';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){const me=actor(req),id=positiveId((await params).id);if(!me||!id)return bad('invalid request');
 const client=await pool.connect();let row:any;
 try{await client.query('BEGIN');const r=await client.query(`SELECT ex.*,p.nessie_account_id AS payer_account,o.nessie_account_id AS debtor_account FROM expenses ex JOIN events e ON e.id=ex.event_id JOIN group_members gm ON gm.group_id=e.group_id AND gm.user_id=$2 JOIN users p ON p.id=ex.payer_id JOIN users o ON o.id=ex.owed_by WHERE ex.id=$1 FOR UPDATE OF ex`,[id,me]);
 if(!r.rowCount){await client.query('ROLLBACK');return bad('expense not found or forbidden',403);}row=r.rows[0];if(row.settled){await client.query('COMMIT');return Response.json({expense_id:id,settled:true,reused:true,nessie_transfer_id:row.nessie_transfer_id});}
 if(row.settlement_state!=='unpaid'){await client.query('ROLLBACK');return bad('settlement already started; inspect Nessie before retrying',409);}
 if(!row.payer_account||!row.debtor_account){await client.query('ROLLBACK');return bad('payer and debtor must both have linked Nessie sandbox account IDs',422);}
 await client.query(`UPDATE expenses SET settlement_state='processing',settlement_started_at=now() WHERE id=$1`,[id]);await client.query('COMMIT');
 }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
 // No automatic retries: timeout could mean Nessie completed the transfer.
 try{const data=await nessie('POST',`/accounts/${encodeURIComponent(row.debtor_account)}/transfers`,{medium:'balance',payee_id:row.payer_account,amount:Number(row.amount),description:`Your Village expense ${id}`});
 const remoteId=transferId(data);if(!remoteId) return Response.json({error:'Nessie response lacks transfer ID; reconcile manually before retry',nessie_response:data},{status:502});
 await pool.query(`UPDATE expenses SET settled=true,settlement_state='settled',nessie_transfer_id=$2,settled_at=now() WHERE id=$1`,[id,remoteId]);return Response.json({expense_id:id,settled:true,nessie_transfer_id:remoteId,nessie_response:data});
 }catch(e){console.error('Nessie settlement needs review',id,e);return Response.json({error:'Nessie transfer failed or outcome uncertain. Check Nessie transactions before retrying; expense remains processing.',detail:e instanceof Error?e.message:'unknown'},{status:502});}
}
