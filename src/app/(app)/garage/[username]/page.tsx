import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { VespaCard } from "@/components/VespaCard";
import Link from "next/link";

// Every visit can be a different owner's page with fresh data — never
// statically cache it.
export const dynamic = "force-dynamic";

export default async function PublicGaragePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const currentUser = await getCurrentUser();

  const owner = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      vespas: {
        orderBy: { createdAt: "desc" },
        include: { photos: { orderBy: { createdAt: "asc" }, take: 1 } },
      },
    },
  });

  if (!owner) notFound();

  const isOwnGarage = currentUser?.id === owner.id;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-muted uppercase">
            Garage
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">@{owner.username}</h1>
          <p className="mt-2 text-foreground/70">
            {owner.vespas.length} Vespa{owner.vespas.length === 1 ? "" : "s"} registered · member
            since {owner.createdAt.getFullYear()}
          </p>
        </div>

        {isOwnGarage && (
          <Link
            href="/garage/new"
            className="shrink-0 rounded-lg bg-accent px-6 py-3 font-bold text-white transition hover:bg-accent-dark"
          >
            + Add a Vespa
          </Link>
        )}
      </div>

      {owner.vespas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-4xl">🛵</p>
          <p className="mt-3 font-bold">Nothing here yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {owner.vespas.map((vespa) => (
            <VespaCard key={vespa.id} vespa={vespa} />
          ))}
        </div>
      )}
    </div>
  );
}
