import { query } from "./db";
import { DEMO_USER_ID } from "./config";
export function actor(req: Request) { const raw = req.headers.get("x-user-id"); const id = raw === null ? DEMO_USER_ID : Number(raw); return Number.isSafeInteger(id) && id > 0 ? id : null; }
export function positiveId(v: unknown) { const n = Number(v); return Number.isSafeInteger(n) && n > 0 ? n : null; }
export async function member(groupId: number, userId: number) { return (await query("SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2", [groupId,userId])).length > 0; }
export async function exists(table: "users"|"groups"|"cards", id: number) { return (await query(`SELECT 1 FROM ${table} WHERE id=$1`,[id])).length > 0; }
export const bad = (error: string, status=400) => Response.json({error},{status});
export async function parse(req: Request) { try { return await req.json(); } catch { return null; } }
export function ids(v: unknown): number[] | null { if (!Array.isArray(v)) return null; const a=v.map(positiveId); return a.every(Boolean) ? [...new Set(a as number[])] : null; }
