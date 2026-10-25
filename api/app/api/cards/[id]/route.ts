import { NextResponse } from "next/server";
import { getCard, updateCard } from "@/lib/cards";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const card = await getCard(Number((await params).id));
  return card
    ? NextResponse.json({ card })
    : NextResponse.json({ error: "not found" }, { status: 404 });
}

// Manual edit when SerpApi found nothing or got the price wrong.
export async function PATCH(req: Request, { params }: Ctx) {
  const id = Number((await params).id);
  await updateCard(id, await req.json());
  const card = await getCard(id);
  return card
    ? NextResponse.json({ card })
    : NextResponse.json({ error: "not found" }, { status: 404 });
}
