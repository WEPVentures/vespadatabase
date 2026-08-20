import { NextRequest, NextResponse } from "next/server";
import { findOrCreateUserByEmail } from "@/lib/data/users";
import { createLoginToken } from "@/lib/data/tokens";
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

  const user = await findOrCreateUserByEmail(email);
  const token = await createLoginToken(email, user.id, TOKEN_TTL_MINUTES);

  const appUrl = process.env.APP_URL || req.nextUrl.origin;
  const link = `${appUrl}/api/auth/verify?token=${token}`;

  await sendMagicLinkEmail(email, link);

  const smtpConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );

  return NextResponse.json({
    ok: true,
    devLink: smtpConfigured ? undefined : link,
  });
}
