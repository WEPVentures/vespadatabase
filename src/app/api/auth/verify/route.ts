import { NextRequest, NextResponse } from "next/server";
import { consumeLoginToken } from "@/lib/data/tokens";
import { getUserById } from "@/lib/data/users";
import { createSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const origin = req.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/login?error=missing_token`);
  }

  const loginToken = await consumeLoginToken(token);
  if (!loginToken) {
    return NextResponse.redirect(`${origin}/login?error=invalid_link`);
  }

  await createSession(loginToken.userId);

  const user = await getUserById(loginToken.userId);
  const destination = user?.username ? "/garage" : "/onboarding";
  return NextResponse.redirect(`${origin}${destination}`);
}
