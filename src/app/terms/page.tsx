import { MarketingHeader } from "@/components/MarketingHeader";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Terms of Service — Vespa Database",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-lg font-bold">{title}</h2>
      <div className="space-y-3 text-foreground/70">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted">Last updated August 20, 2026</p>

          <p className="mt-6 text-foreground/70">
            These terms govern your use of vespadatabase.com (&ldquo;Vespa Database&rdquo;),
            operated by WEP Ventures, LLC. By using the site, you agree to them.
          </p>

          <Section title="What this is">
            <p>
              Vespa Database is a crowdsourced, community-run registry for Vespa scooter owners to
              catalog their scooters and browse others&apos; Vespas. It is not affiliated with,
              endorsed by, or connected to Piaggio &amp; C. S.p.A. or the Vespa brand in any way.
              &ldquo;Vespa&rdquo; is a trademark of Piaggio &amp; C. S.p.A.
            </p>
          </Section>

          <Section title="Your account">
            <p>
              You sign in with your email using a one-time magic link — no password. You&apos;re
              responsible for keeping access to your email account secure, since anyone with
              access to it can sign in as you.
            </p>
          </Section>

          <Section title="Content you submit">
            <p>
              When you add a Vespa, you&apos;re responsible for what you enter — including photos,
              VIN/serial numbers, and any story or notes. Don&apos;t post anything you don&apos;t
              have the right to share, anything false, or anything meant to harass or mislead. You
              keep ownership of what you submit, but you give us permission to display it on the
              site as part of the normal operation of a public registry.
            </p>
          </Section>

          <Section title="Public by design">
            <p>
              Everything you add to the registry — your username, your Vespas&apos; details, and
              photos — is publicly visible. This is the core of what the site does. If you&apos;d
              rather something not be public, don&apos;t add it.
            </p>
          </Section>

          <Section title="We can remove content">
            <p>
              We may remove or edit a listing, restrict an account, or take down content that
              violates these terms, is spam, is abusive, or that we otherwise believe doesn&apos;t
              belong on the site, at our discretion.
            </p>
          </Section>

          <Section title="No warranty">
            <p>
              Vespa Database is provided as-is. We don&apos;t guarantee it will always be
              available or error-free, or that information in the registry (including VINs, years,
              or ownership claims) is accurate — it&apos;s user-submitted and unverified.
              Don&apos;t rely on it as an authoritative ownership or title record.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the extent allowed by law, WEP Ventures, LLC isn&apos;t liable for any damages
              arising from your use of the site or reliance on information in it.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              We may update these terms as the site grows. We&apos;ll update the date above when
              we do; continued use of the site means you accept the current version.
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
