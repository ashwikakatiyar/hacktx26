const base = (process.env.NESSIE_BASE_URL || 'http://api.reimaginebanking.com').replace(/\/$/, '');
export class NessieError extends Error { constructor(public status:number, public detail:string){super(`Nessie ${status}: ${detail}`);} }
export async function nessie<T=any>(method:string,path:string,body?:unknown):Promise<T>{
 const key=process.env.NESSIE_API_KEY;
 if(!key) throw new Error('NESSIE_API_KEY is not configured');
 const url=new URL(base+path); url.searchParams.set('key',key);
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
 try {const response=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal,cache:'no-store'});
 const raw=await response.text();let data:any;try{data=raw?JSON.parse(raw):{};}catch{data={raw};}
 if(!response.ok)throw new NessieError(response.status,JSON.stringify(data).slice(0,700));return data as T;
 }finally{clearTimeout(timer);}
}
export function transferId(data:any):string|null {const id=data?.objectCreated?._id ?? data?.objectCreated?.id ?? data?._id ?? data?.id;return typeof id==='string'&&id.length>0?id:null;}
