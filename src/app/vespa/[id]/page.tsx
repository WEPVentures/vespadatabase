import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { DeleteVespaButton } from "@/components/DeleteVespaButton";

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
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        {vespa.owner.username && (
          <Link
            href={`/garage/${vespa.owner.username}`}
            className="text-sm font-semibold text-foreground/60 hover:text-accent"
          >
            ← @{vespa.owner.username}&apos;s garage
          </Link>
        )}
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border-2 border-foreground bg-mint">
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
              className="relative aspect-square overflow-hidden rounded-lg border-2 border-foreground"
            >
              <Image src={photo.url} alt={title} fill className="object-cover" sizes="150px" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{title}</h1>
          <p className="mt-1 text-lg text-foreground/60">{vespa.color ?? "Color unknown"}</p>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <Link
              href={`/vespa/${vespa.id}/edit`}
              className="rounded-full border-2 border-foreground bg-mint px-5 py-2.5 font-bold hover:bg-mint-dark hover:text-white"
            >
              Edit
            </Link>
            <DeleteVespaButton vespaId={vespa.id} />
          </div>
        )}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border-2 border-foreground bg-card p-4">
          <dt className="text-xs font-bold tracking-wide text-foreground/50 uppercase">Model</dt>
          <dd className="mt-1 font-semibold">{vespa.model}</dd>
        </div>
        <div className="rounded-xl border-2 border-foreground bg-card p-4">
          <dt className="text-xs font-bold tracking-wide text-foreground/50 uppercase">Year</dt>
          <dd className="mt-1 font-semibold">{vespa.year ?? "Unknown"}</dd>
        </div>
        <div className="rounded-xl border-2 border-foreground bg-card p-4">
          <dt className="text-xs font-bold tracking-wide text-foreground/50 uppercase">
            VIN / Serial
          </dt>
          <dd className="mt-1 truncate font-mono text-sm font-semibold">
            {vespa.vin ?? "Not recorded"}
          </dd>
        </div>
      </dl>

      {vespa.story && (
        <div className="mt-8 rounded-2xl border-2 border-foreground bg-card p-6">
          <h2 className="mb-3 text-lg font-bold">The story</h2>
          <p className="whitespace-pre-wrap text-foreground/80">{vespa.story}</p>
        </div>
      )}

      <p className="mt-6 text-xs text-foreground/40">
        Registered {vespa.createdAt.toLocaleDateString()}
      </p>
    </div>
  );
}
