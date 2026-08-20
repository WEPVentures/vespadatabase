import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/mailer";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

const TOKEN_TTL_MINUTES = 15;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const rawEmail = typeof body?.email === "string" ? body.email : "";
  const email = normalizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

  await prisma.loginToken.create({
    data: { token, email, expiresAt, userId: user.id },
  });

  const appUrl = process.env.APP_URL || req.nextUrl.origin;
  const link = `${appUrl}/api/auth/verify?token=${token}`;

  try {
    await sendMagicLinkEmail(email, link);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Couldn't send the sign-in email. Try again in a moment." },
      { status: 500 }
    );
  }

  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  return NextResponse.json({
    ok: true,
    devLink: resendConfigured ? undefined : link,
  });
}
