import Link from "next/link";
import Image from "next/image";

type VespaCardData = {
  id: string;
  year: number | null;
  model: string;
  color: string | null;
  photos: { url: string }[];
  owner?: { username: string | null } | null;
};

export function VespaCard({ vespa }: { vespa: VespaCardData }) {
  const photo = vespa.photos[0];
  const title = [vespa.year, vespa.model].filter(Boolean).join(" ");

  return (
    <Link
      href={`/vespa/${vespa.id}`}
      className="group block overflow-hidden rounded-2xl border-2 border-foreground bg-card transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--foreground)]"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-mint">
        {photo ? (
          <Image
            src={photo.url}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        ) : (
          <span className="text-4xl">🛵</span>
        )}
      </div>
      <div className="p-4">
        <p className="truncate text-base font-bold">{title || vespa.model}</p>
        <p className="truncate text-sm text-foreground/60">
          {vespa.color ?? "Color unknown"}
          {vespa.owner?.username ? ` · @${vespa.owner.username}` : ""}
        </p>
      </div>
    </Link>
  );
}
