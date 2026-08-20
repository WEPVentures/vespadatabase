import Link from "next/link";
import { prisma } from "@/lib/db";
import { VespaCard } from "@/components/VespaCard";
import { Prisma } from "@/generated/prisma/client";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string; year?: string }>;
}) {
  const { model, year } = await searchParams;

  const where: Prisma.VespaWhereInput = {};
  if (model) where.model = model;
  if (year) where.year = Number(year);

  const [vespas, modelRows, yearRows] = await Promise.all([
    prisma.vespa.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { username: true } },
        photos: { orderBy: { createdAt: "asc" }, take: 1 },
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
  ]);

  const hasFilters = Boolean(model || year);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="mb-2 text-xs font-bold tracking-[0.2em] text-foreground/50 uppercase">
        The directory
      </p>
      <h1 className="mb-2 text-4xl font-black tracking-tight">Every Vespa on record.</h1>
      <p className="mb-8 text-foreground/70">
        {vespas.length} registered so far, newest first.
      </p>

      <form
        method="GET"
        className="mb-8 flex flex-wrap items-end gap-3 rounded-2xl border-2 border-foreground bg-card p-4"
      >
        <div>
          <label className="block text-xs font-bold tracking-wide text-foreground/50 uppercase">
            Model
          </label>
          <select
            name="model"
            defaultValue={model ?? ""}
            className="mt-1 rounded-lg border-2 border-foreground bg-card px-3 py-2 text-sm font-semibold"
          >
            <option value="">All models</option>
            {modelRows.map((m) => (
              <option key={m.model} value={m.model}>
                {m.model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold tracking-wide text-foreground/50 uppercase">
            Year
          </label>
          <select
            name="year"
            defaultValue={year ?? ""}
            className="mt-1 rounded-lg border-2 border-foreground bg-card px-3 py-2 text-sm font-semibold"
          >
            <option value="">All years</option>
            {yearRows.map((y) => (
              <option key={y.year} value={y.year ?? ""}>
                {y.year}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-full border-2 border-foreground bg-mint px-5 py-2.5 text-sm font-bold"
        >
          Filter
        </button>

        {hasFilters && (
          <Link
            href="/browse"
            className="rounded-full px-5 py-2.5 text-sm font-bold text-foreground/60 underline"
          >
            Clear
          </Link>
        )}
      </form>

      {vespas.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-foreground/30 bg-card p-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 font-bold">No Vespas match those filters.</p>
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
