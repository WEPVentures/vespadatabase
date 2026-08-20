import { Resend } from "resend";

export async function sendMagicLinkEmail(email: string, link: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev fallback: no Resend key configured, just log it. The link is
    // also returned to the client so it can be shown on screen.
    console.log(`\n🛵  Magic link for ${email}:\n${link}\n`);
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || "Vespa Database <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Your Vespa Database login link",
    text: `Click to sign in: ${link}\n\nThis link expires in 15 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>🛵 Vespa Database</h2>
        <p>Click the button below to sign in. This link expires in 15 minutes.</p>
        <p>
          <a href="${link}" style="display:inline-block;background:#4b7a72;color:#fff;
            padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Sign in to Vespa Database
          </a>
        </p>
        <p style="color:#888;font-size:12px;">Or paste this link in your browser: ${link}</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend failed to send magic link: ${error.message}`);
  }
}
