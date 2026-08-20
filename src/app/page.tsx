import Link from "next/link";
import { countAllVespas } from "@/lib/data/vespas";
import { countUsersWithUsername } from "@/lib/data/users";
import { MarketingHeader } from "@/components/MarketingHeader";
import { Footer } from "@/components/Footer";
import { BrowserChrome } from "@/components/BrowserChrome";
import { MockDashboard } from "@/components/MockDashboard";

const FEATURES = [
  {
    emoji: "📸",
    title: "Photo-first profiles",
    body: "Every Vespa gets its own page — photos, story, restoration history, the works.",
  },
  {
    emoji: "🧾",
    title: "VIN & serial tracking",
    body: "Log the serial number now. Ownership history over time is coming later — this is the foundation.",
  },
  {
    emoji: "🌍",
    title: "A public directory",
    body: "Browse every registered Vespa, filter by model or year, and see what's out there.",
  },
  {
    emoji: "🗄️",
    title: "Your own Garage page",
    body: "A shareable page for your collection — send the link to friends, forums, or your local club.",
  },
];

export default async function Home() {
  const [vespaCount, ownerCount] = await Promise.all([
    countAllVespas(),
    countUsersWithUsername(),
  ]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
          <p className="mb-4 text-xs font-bold tracking-[0.2em] text-muted uppercase">
            A registry for Vespa owners
          </p>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
            Every Vespa has a story.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-foreground/70 sm:text-xl">
            Vespa is an 80-year-old company — where are they all? Catalog yours, and help build
            a living history of every scooter out there.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-accent px-6 py-3 font-bold text-white transition hover:bg-accent-dark"
            >
              Sign Up
            </Link>
            <Link
              href="/browse"
              className="rounded-lg border border-border bg-card px-6 py-3 font-bold transition hover:bg-black/[0.03]"
            >
              Browse Vespas
            </Link>
          </div>

          {vespaCount > 0 && (
            <p className="mt-4 text-sm font-semibold text-mint-dark">
              🛵 {vespaCount} Vespa{vespaCount === 1 ? "" : "s"} registered by {ownerCount}{" "}
              owner{ownerCount === 1 ? "" : "s"} so far.
            </p>
          )}
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <BrowserChrome>
            <MockDashboard />
          </BrowserChrome>
          <p className="mt-3 text-center text-xs text-muted">
            A sample of the directory — every registered Vespa, searchable and filterable.
          </p>
        </section>

        <section className="border-t border-border bg-sidebar">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-muted uppercase">
              Why bother
            </p>
            <h2 className="mb-10 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              Not a repair manual. A pedigree.
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="mb-3 text-3xl">{f.emoji}</div>
                  <h3 className="mb-1 text-lg font-bold">{f.title}</h3>
                  <p className="text-sm text-foreground/70">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Got a Vespa? Add it to the record.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-foreground/70">
            Takes two minutes. No password to remember — just your email.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-accent px-8 py-3 font-bold text-white transition hover:bg-accent-dark"
          >
            Sign Up
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
