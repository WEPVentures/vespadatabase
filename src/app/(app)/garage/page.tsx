import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listVespasByOwner } from "@/lib/data/vespas";
import { VespaCard } from "@/components/VespaCard";

// Every page here reads live data (Netlify Blobs / session), and
// Blobs credentials only exist at request time, not during the build's
// static prerendering step — never statically optimize these.
export const dynamic = "force-dynamic";

export default async function GaragePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.username) redirect("/onboarding");

  const vespas = await listVespasByOwner(user.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-muted uppercase">
            My garage
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Hey, @{user.username} 👋
          </h1>
          <p className="mt-2 text-foreground/70">
            {vespas.length === 0
              ? "You haven't added a Vespa yet."
              : `${vespas.length} Vespa${vespas.length === 1 ? "" : "s"} in your garage.`}{" "}
            <Link href={`/garage/${user.username}`} className="font-semibold text-accent underline">
              View your public garage →
            </Link>
          </p>
        </div>

        <Link
          href="/garage/new"
          className="shrink-0 rounded-lg bg-accent px-6 py-3 font-bold text-white transition hover:bg-accent-dark"
        >
          + Add a Vespa
        </Link>
      </div>

      {vespas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-4xl">🛵</p>
          <p className="mt-3 font-bold">Nothing parked here yet.</p>
          <p className="mt-1 text-sm text-muted">
            Add your first Vespa — photos, story, VIN, all of it.
          </p>
          <Link
            href="/garage/new"
            className="mt-5 inline-block rounded-lg bg-accent px-6 py-2.5 font-bold text-white"
          >
            + Add a Vespa
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vespas.map((vespa) => (
            <VespaCard key={vespa.id} vespa={vespa} />
          ))}
        </div>
      )}
    </div>
  );
}
