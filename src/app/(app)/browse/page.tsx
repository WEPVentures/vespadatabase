import Link from "next/link";
import Image from "next/image";
import {
  filterAndSortVespas,
  getDistinctModels,
  getDistinctYears,
  listAllVespas,
  BrowseSortKey,
} from "@/lib/data/vespas";
import { getUsersByIds } from "@/lib/data/users";

const SORT_OPTIONS: Record<BrowseSortKey, { label: string }> = {
  newest: { label: "Newest first" },
  oldest: { label: "Oldest first" },
  year_desc: { label: "Year, newest" },
  year_asc: { label: "Year, oldest" },
  model: { label: "Model, A–Z" },
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string; year?: string; q?: string; sort?: string }>;
}) {
  const { model, year, q, sort } = await searchParams;
  const sortKey: BrowseSortKey = sort && sort in SORT_OPTIONS ? (sort as BrowseSortKey) : "newest";
  const yearNum = year ? Number(year) : undefined;

  const [allVespas, modelRows, yearRows] = await Promise.all([
    listAllVespas(),
    getDistinctModels(),
    getDistinctYears(),
  ]);
  const totalCount = allVespas.length;

  const owners = await getUsersByIds(allVespas.map((v) => v.ownerId));
  const usernameOf = (ownerId: string) => owners.get(ownerId)?.username ?? null;

  const vespas = filterAndSortVespas(allVespas, {
    model,
    year: yearNum,
    q,
    sort: sortKey,
    ownerUsernameOf: usernameOf,
  });

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
                key={m}
                href={`/browse?model=${encodeURIComponent(m)}`}
                className="rounded-full border border-border bg-sidebar px-3 py-1 font-semibold text-foreground/70 hover:bg-black/[0.04]"
              >
                {m}
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
              <option key={m} value={m}>
                {m}
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
              <option key={y} value={y}>
                {y}
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
                const username = usernameOf(vespa.ownerId);
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
                          {username && (
                            <span className="block truncate text-xs text-muted">
                              @{username}
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
                      {vespa.photos.length}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {new Date(vespa.createdAt).toLocaleDateString()}
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
