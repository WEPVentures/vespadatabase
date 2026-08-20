import nodemailer from "nodemailer";

export async function sendMagicLinkEmail(email: string, link: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    // Dev fallback: no SMTP configured, just log it. The link is also
    // returned to the client so it can be shown on screen.
    console.log(`\n🛵  Magic link for ${email}:\n${link}\n`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: SMTP_FROM || `VespaDatabase <${SMTP_USER}>`,
    to: email,
    subject: "Your VespaDatabase login link",
    text: `Click to sign in: ${link}\n\nThis link expires in 15 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>🛵 VespaDatabase</h2>
        <p>Click the button below to sign in. This link expires in 15 minutes.</p>
        <p>
          <a href="${link}" style="display:inline-block;background:#c0392b;color:#fff;
            padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Sign in to VespaDatabase
          </a>
        </p>
        <p style="color:#888;font-size:12px;">Or paste this link in your browser: ${link}</p>
      </div>
    `,
  });
}
