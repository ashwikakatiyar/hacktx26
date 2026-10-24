import { NextResponse } from "next/server";
import { getCard, shareCard } from "@/lib/cards";

export const runtime = "nodejs";

// POST { group_ids: number[], user_ids?: number[] }
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const body = await req.json();
  const groupIds = (Array.isArray(body.group_ids) ? body.group_ids : []).map(Number).filter(Boolean);
  const userIds = (Array.isArray(body.user_ids) ? body.user_ids : []).map(Number).filter(Boolean);
  if (!groupIds.length && !userIds.length) {
    return NextResponse.json({ error: "send group_ids or user_ids" }, { status: 400 });
  }
  await shareCard(id, groupIds, userIds);
  const card = await getCard(id);
  return card ? NextResponse.json({ card }) : NextResponse.json({ error: "not found" }, { status: 404 });
}
