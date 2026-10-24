import { NextResponse } from "next/server";
import { buildCard } from "@/lib/pipeline";
import { getCard, insertCard, listCards, shareCard } from "@/lib/cards";
import { DEMO_USER_ID } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 60;

// POST { text?, image_base64?, mime_type?, group_ids? }  ->  { card, meta }
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const text = typeof body.text === "string" ? body.text.trim() : undefined;
  const imageBase64 = typeof body.image_base64 === "string" ? body.image_base64 : undefined;
  if (!text && !imageBase64) {
    return NextResponse.json({ error: "send text or image_base64" }, { status: 400 });
  }
  const userId = Number(req.headers.get("x-user-id")) || DEMO_USER_ID;

  const { draft, meta } = await buildCard({ text, imageBase64, mimeType: body.mime_type });
  const id = await insertCard(draft, userId);
  const groupIds: number[] = Array.isArray(body.group_ids) ? body.group_ids.map(Number).filter(Boolean) : [];
  if (groupIds.length) await shareCard(id, groupIds);

  return NextResponse.json({ card: await getCard(id), meta }, { status: 201 });
}

// GET /api/cards?group_id=1
export async function GET(req: Request) {
  const gid = Number(new URL(req.url).searchParams.get("group_id")) || undefined;
  return NextResponse.json({ cards: await listCards(gid) });
}
