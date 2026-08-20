import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

const SORT_OPTIONS = {
  newest: { label: "Newest first", orderBy: { createdAt: "desc" } as const },
  oldest: { label: "Oldest first", orderBy: { createdAt: "asc" } as const },
  year_desc: { label: "Year, newest", orderBy: { year: "desc" } as const },
  year_asc: { label: "Year, oldest", orderBy: { year: "asc" } as const },
  model: { label: "Model, A–Z", orderBy: { model: "asc" } as const },
};

type SortKey = keyof typeof SORT_OPTIONS;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string; year?: string; q?: string; sort?: string }>;
}) {
  const { model, year, q, sort } = await searchParams;
  const sortKey: SortKey = sort && sort in SORT_OPTIONS ? (sort as SortKey) : "newest";

  const where: Prisma.VespaWhereInput = {};
  if (model) where.model = model;
  if (year) where.year = Number(year);
  if (q) {
    where.OR = [
      { model: { contains: q } },
      { color: { contains: q } },
      { vin: { contains: q } },
      { owner: { username: { contains: q } } },
    ];
  }

  const [vespas, modelRows, yearRows, totalCount] = await Promise.all([
    prisma.vespa.findMany({
      where,
      orderBy: SORT_OPTIONS[sortKey].orderBy,
      include: {
        owner: { select: { username: true } },
        photos: { orderBy: { createdAt: "asc" }, take: 1 },
        _count: { select: { photos: true } },
      },
    }),
    prisma.vespa.findMany({
      distinct: ["model"],
      select: { model: true },
      orderBy: { model: "asc" },
    }),
    prisma.vespa.findMany({
      where: { year: { not: null } },
      distinct: ["year"],
      select: { year: true },
      orderBy: { year: "desc" },
    }),
    prisma.vespa.count(),
  ]);

  const hasFilters = Boolean(model || year || q);
  const popularModels = modelRows.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="mb-2 text-xs font-bold tracking-[0.2em] text-muted uppercase">
        The directory
      </p>
      <h1 className="mb-2 text-3xl font-black tracking-tight sm:text-4xl">
        Every Vespa on record.
      </h1>

      <form method="GET" className="mt-6">
        <div className="flex overflow-hidden rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-accent/30">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by model, color, VIN, or owner…"
            className="w-full px-4 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            className="shrink-0 bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-accent-dark"
          >
            Search
          </button>
        </div>

        {popularModels.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-muted">Try:</span>
            {popularModels.map((m) => (
              <Link
                key={m.model}
                href={`/browse?model=${encodeURIComponent(m.model)}`}
                className="rounded-full border border-border bg-sidebar px-3 py-1 font-semibold text-foreground/70 hover:bg-black/[0.04]"
              >
                {m.model}
              </Link>
            ))}
          </div>
        )}

        <p className="mt-4 text-sm text-muted">
          Showing {vespas.length} of {totalCount} Vespa{totalCount === 1 ? "" : "s"}
        </p>

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <select
            name="sort"
            defaultValue={sortKey}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold"
          >
            {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
              <option key={key} value={key}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            name="model"
            defaultValue={model ?? ""}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold"
          >
            <option value="">All models</option>
            {modelRows.map((m) => (
              <option key={m.model} value={m.model}>
                {m.model}
              </option>
            ))}
          </select>

          <select
            name="year"
            defaultValue={year ?? ""}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold"
          >
            <option value="">All years</option>
            {yearRows.map((y) => (
              <option key={y.year} value={y.year ?? ""}>
                {y.year}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-lg border border-border bg-sidebar px-4 py-2 text-sm font-bold hover:bg-black/[0.04]"
          >
            Apply
          </button>

          {hasFilters && (
            <Link
              href="/browse"
              className="px-3 py-2 text-sm font-semibold text-muted underline"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {vespas.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 font-bold">No Vespas match that search.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-sidebar text-left text-[11px] font-bold tracking-wide text-muted uppercase">
                <th className="px-4 py-2.5">Vespa</th>
                <th className="px-4 py-2.5">Color</th>
                <th className="px-4 py-2.5">VIN</th>
                <th className="px-4 py-2.5">Photos</th>
                <th className="px-4 py-2.5">Registered</th>
              </tr>
            </thead>
            <tbody>
              {vespas.map((vespa) => {
                const title = [vespa.year, vespa.model].filter(Boolean).join(" ") || vespa.model;
                const photo = vespa.photos[0];
                return (
                  <tr
                    key={vespa.id}
                    className="border-b border-border last:border-b-0 hover:bg-black/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/vespa/${vespa.id}`} className="flex items-center gap-3">
                        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-mint text-base">
                          {photo ? (
                            <Image src={photo.url} alt="" fill className="object-cover" sizes="36px" />
                          ) : (
                            "🛵"
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-bold text-foreground hover:text-accent">
                            {title}
                          </span>
                          {vespa.owner.username && (
                            <span className="block truncate text-xs text-muted">
                              @{vespa.owner.username}
                            </span>
                          )}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-foreground/80">
                      {vespa.color ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {vespa.vin ? (
                        <span className="rounded-full bg-mint px-2.5 py-1 font-mono text-xs text-mint-dark">
                          {vespa.vin}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-foreground/80">
                      {vespa._count.photos}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {vespa.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
