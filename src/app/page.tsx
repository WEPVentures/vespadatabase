import Link from "next/link";
import Image from "next/image";
import { MarketingHeader } from "@/components/MarketingHeader";
import { Footer } from "@/components/Footer";
import { BrowserChrome } from "@/components/BrowserChrome";
import { MockDashboard } from "@/components/MockDashboard";

// The header shows session-dependent nav (Sign In vs My Garage) — never
// statically cache this.
export const dynamic = "force-dynamic";

const FEATURES = [
  {
    emoji: "📜",
    title: "History",
    body: "Preserve your Vespa's story — its owners, photos, restorations, and the miles along the way.",
  },
  {
    emoji: "🌍",
    title: "Community",
    body: "Join a worldwide collection of Vespa owners and the scooters they love.",
  },
  {
    emoji: "🔗",
    title: "Continuity",
    body: "When a Vespa changes hands, its story goes with it — ready for the next owner to continue.",
  },
  {
    emoji: "🧭",
    title: "Discovery",
    body: "Explore Vespas across generations, models, colors, and places — and see what's still out there.",
  },
];

export default async function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
                Ciao bella!
              </h1>
              <p className="mt-6 text-lg text-foreground/70 sm:text-xl">
                Since 1946, more than 20 million of the world&apos;s most iconic scooters have
                been produced. Vespa Database is an enthusiast database designed to catalog
                Vespas and connect owners around the world.
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
                  Browse Database
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border lg:aspect-[5/4]">
              <Image
                src="/uploads/hero-tokyo-vespa.jpeg"
                alt="A cream-colored Vespa parked on a street corner in Tokyo"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 520px, 100vw"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <BrowserChrome>
            <MockDashboard />
          </BrowserChrome>
          <p className="mt-3 text-center text-xs text-muted">
            Database illustration
          </p>
        </section>

        <section className="border-t border-border bg-sidebar">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="mb-10 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              Features
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
            Got a Vespa?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-foreground/70">
            Add it to the database.
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
