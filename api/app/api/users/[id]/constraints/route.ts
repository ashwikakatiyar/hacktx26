import { query } from "@/lib/db";
import { actor, positiveId, bad, parse, exists } from "@/lib/phase2";
export const runtime = "nodejs";
const fields = [
  "dietary",
  "accessibility",
  "can_drive",
  "transport",
  "location",
  "lat",
  "lng",
  "radius_miles",
  "budget_max",
  "interests",
] as const;
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = positiveId((await params).id),
    me = actor(req);
  if (!id || !me) return bad("invalid user", 400);
  if (id !== me) return bad("forbidden", 403);
  if (!(await exists("users", id))) return bad("user not found", 404);
  const body = await parse(req);
  if (!body || typeof body !== "object" || Array.isArray(body))
    return bad("invalid JSON object");
  const keys = Object.keys(body);
  if (
    !keys.length ||
    keys.some((k) => !(fields as readonly string[]).includes(k))
  )
    return bad("invalid constraint fields");
  for (const k of ["dietary", "accessibility", "interests"])
    if (
      k in body &&
      (!Array.isArray(body[k]) ||
        body[k].some((x: unknown) => typeof x !== "string"))
    )
      return bad(`invalid ${k}`);
  if ("can_drive" in body && typeof body.can_drive !== "boolean")
    return bad("invalid can_drive");
  if (
    "transport" in body &&
    !["walk", "bike", "transit", "car"].includes(body.transport)
  )
    return bad("invalid transport");
  if (
    "location" in body &&
    body.location !== null &&
    typeof body.location !== "string"
  )
    return bad("invalid location");
  for (const k of ["lat", "lng"])
    if (
      k in body &&
      body[k] !== null &&
      (typeof body[k] !== "number" || !Number.isFinite(body[k]))
    )
      return bad(`invalid ${k}`);
  if (
    "radius_miles" in body &&
    (!Number.isInteger(body.radius_miles) ||
      body.radius_miles < 1 ||
      body.radius_miles > 500)
  )
    return bad("invalid radius_miles");
  if (
    "budget_max" in body &&
    (!Number.isInteger(body.budget_max) ||
      body.budget_max < 1 ||
      body.budget_max > 4)
  )
    return bad("invalid budget_max");
  const cols = keys;
  const vals = cols.map((k) => body[k]);
  const updates = cols.map((k, i) => `${k}=EXCLUDED.${k}`).join(",");
  const rows = await query(
    `INSERT INTO constraints (user_id,${cols.join(",")}) VALUES ($1,${cols.map((_, i) => `$${i + 2}`).join(",")}) ON CONFLICT (user_id) DO UPDATE SET ${updates} RETURNING *`,
    [id, ...vals],
  );
  await query("UPDATE users SET onboarded=TRUE WHERE id=$1", [id]);
  return Response.json({ constraints: rows[0] });
}
