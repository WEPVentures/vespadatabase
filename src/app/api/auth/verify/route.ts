import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const origin = req.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/login?error=missing_token`);
  }

  const loginToken = await prisma.loginToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!loginToken || loginToken.usedAt || loginToken.expiresAt < new Date()) {
    return NextResponse.redirect(`${origin}/login?error=invalid_link`);
  }

  await prisma.loginToken.update({
    where: { id: loginToken.id },
    data: { usedAt: new Date() },
  });

  await createSession(loginToken.userId);

  const destination = loginToken.user.username ? "/garage" : "/onboarding";
  return NextResponse.redirect(`${origin}${destination}`);
}
