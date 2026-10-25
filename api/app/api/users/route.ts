import { query } from "@/lib/db";
export const runtime="nodejs";
export async function GET() { return Response.json({users:await query("SELECT id,name,avatar_url,onboarded FROM users ORDER BY id LIMIT 100")}); }
