import { MarketingHeader } from "@/components/MarketingHeader";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — Vespa Database",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-lg font-bold">{title}</h2>
      <div className="space-y-3 text-foreground/70">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted">Last updated August 20, 2026</p>

          <p className="mt-6 text-foreground/70">
            Vespa Database (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is operated by WEP Ventures, LLC.
            This page explains what information we collect when you use vespadatabase.com, why we
            collect it, and who else sees it.
          </p>

          <Section title="What we collect">
            <p>
              <strong className="text-foreground">Email address</strong> — used to send you a
              magic sign-in link and to identify your account. We never see or store a password.
            </p>
            <p>
              <strong className="text-foreground">Username</strong> — chosen by you, shown
              publicly next to any Vespas you register.
            </p>
            <p>
              <strong className="text-foreground">Vespa details</strong> — model, year, VIN/serial
              number, color, city/state/country, any story or notes you write, and any photos you
              upload.
            </p>
            <p>
              <strong className="text-foreground">Technical data</strong> — our hosting and email
              providers automatically log standard technical information (like IP address and
              timestamps) as part of running the service. We don&apos;t use this for tracking or
              advertising.
            </p>
          </Section>

          <Section title="How we use it">
            <p>To sign you in via a magic-link email, no password required.</p>
            <p>To display your registered Vespas on your public Garage page and in the Directory.</p>
            <p>To operate and maintain the site.</p>
          </Section>

          <Section title="What's public">
            <p>
              Vespa Database is a public registry. Once you register a Vespa, its details —
              including VIN, location, and photos — and your username are visible to anyone who
              visits the site, logged in or not. Don&apos;t put anything in the Story field or
              elsewhere that you wouldn&apos;t want publicly visible. Your email address itself is
              never shown publicly.
            </p>
          </Section>

          <Section title="Who we share data with">
            <p>We use a small number of service providers to run the site:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong className="text-foreground">Resend</strong> — sends the sign-in emails
              </li>
              <li>
                <strong className="text-foreground">Supabase</strong> — hosts our database and
                stores uploaded photos
              </li>
              <li>
                <strong className="text-foreground">Netlify</strong> — hosts the application
              </li>
            </ul>
            <p>
              These providers process data on our behalf and don&apos;t use it for their own
              purposes. We don&apos;t sell your data, and we don&apos;t share it with
              advertisers — we don&apos;t have any.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              We use a single cookie to keep you signed in. It doesn&apos;t track you across other
              websites, and we don&apos;t use analytics or advertising cookies.
            </p>
          </Section>

          <Section title="Your choices">
            <p>
              You can edit or delete any Vespa you&apos;ve registered at any time from your
              Garage. To delete your account entirely, or to ask a question about your data, email{" "}
              <a href="mailto:info@vespadatabase.com" className="text-accent underline">
                info@vespadatabase.com
              </a>
              .
            </p>
          </Section>

          <Section title="Changes">
            <p>
              We&apos;ll update this page as the site changes, and update the date above when we
              do.
            </p>
          </Section>

          <p className="mt-10 text-sm text-muted">
            Contact:{" "}
            <a href="mailto:info@vespadatabase.com" className="text-accent underline">
              info@vespadatabase.com
            </a>{" "}
            — WEP Ventures, LLC
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
