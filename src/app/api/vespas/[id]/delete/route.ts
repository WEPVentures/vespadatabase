import { NextRequest, NextResponse } from "next/server";
import { deleteVespa, getVespaById } from "@/lib/data/vespas";
import { getSessionUserId } from "@/lib/session";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url), 303);
  }

  const existing = await getVespaById(id);
  if (existing && existing.ownerId === userId) {
    await deleteVespa(id);
  }

  return NextResponse.redirect(new URL("/garage", req.url), 303);
}
