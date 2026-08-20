import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { DeleteVespaButton } from "@/components/DeleteVespaButton";

// Ownership controls depend on the viewer's session — never statically
// cache this.
export const dynamic = "force-dynamic";

export default async function VespaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const vespa = await prisma.vespa.findUnique({
    where: { id },
    include: {
      owner: { select: { username: true } },
      photos: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!vespa) notFound();

  const isOwner = currentUser?.id === vespa.ownerId;
  const title = [vespa.year, vespa.model].filter(Boolean).join(" ") || vespa.model;
  const [mainPhoto, ...restPhotos] = vespa.photos;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        {vespa.owner.username && (
          <Link
            href={`/garage/${vespa.owner.username}`}
            className="text-sm font-semibold text-muted hover:text-accent"
          >
            ← @{vespa.owner.username}&apos;s garage
          </Link>
        )}
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-border bg-mint">
        {mainPhoto ? (
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={mainPhoto.url}
              alt={title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 800px, 100vw"
              priority
            />
          </div>
        ) : (
          <div className="flex aspect-[16/10] items-center justify-center text-6xl">🛵</div>
        )}
      </div>

      {restPhotos.length > 0 && (
        <div className="mb-8 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {restPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              <Image src={photo.url} alt={title} fill className="object-cover" sizes="150px" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-1 text-lg text-foreground/60">{vespa.color ?? "Color unknown"}</p>
          {(vespa.city || vespa.state) && (
            <p className="mt-1 text-sm text-muted">
              📍 {[vespa.city, vespa.state].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <Link
              href={`/vespa/${vespa.id}/edit`}
              className="rounded-lg border border-border bg-card px-5 py-2.5 font-bold hover:bg-black/[0.04]"
            >
              Edit
            </Link>
            <DeleteVespaButton vespaId={vespa.id} />
          </div>
        )}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <dt className="text-xs font-bold tracking-wide text-muted uppercase">Model</dt>
          <dd className="mt-1 font-semibold">{vespa.model}</dd>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <dt className="text-xs font-bold tracking-wide text-muted uppercase">Year</dt>
          <dd className="mt-1 font-semibold">{vespa.year ?? "Unknown"}</dd>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <dt className="text-xs font-bold tracking-wide text-muted uppercase">
            VIN / Serial
          </dt>
          <dd className="mt-1 truncate font-mono text-sm font-semibold">
            {vespa.vin ?? "Not recorded"}
          </dd>
        </div>
      </dl>

      {vespa.story && (
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 text-lg font-bold">The story</h2>
          <p className="whitespace-pre-wrap text-foreground/80">{vespa.story}</p>
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Registered {vespa.createdAt.toLocaleDateString()}
      </p>
    </div>
  );
}
