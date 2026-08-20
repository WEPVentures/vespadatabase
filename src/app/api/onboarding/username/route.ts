import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { isValidUsername, normalizeUsername } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const rawUsername = typeof body?.username === "string" ? body.username : "";
  const username = normalizeUsername(rawUsername);

  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: "Usernames are 3-20 characters: lowercase letters, numbers, - or _." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing && existing.id !== userId) {
    return NextResponse.json({ error: "That username is taken." }, { status: 409 });
  }

  await prisma.user.update({ where: { id: userId }, data: { username } });

  return NextResponse.json({ ok: true, username });
}
