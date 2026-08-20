import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { VespaFormFields } from "@/components/VespaFormFields";

export default async function EditVespaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const vespa = await prisma.vespa.findUnique({ where: { id } });
  if (!vespa) notFound();
  if (vespa.ownerId !== user.id) redirect(`/vespa/${id}`);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="mb-3 text-xs font-bold tracking-[0.2em] text-foreground/50 uppercase">
        Edit
      </p>
      <h1 className="mb-8 text-4xl font-black tracking-tight">
        Update the record.
      </h1>

      {error && (
        <div className="mb-5 rounded-xl border-2 border-accent bg-accent/10 p-3 text-sm font-semibold text-accent-dark">
          {error}
        </div>
      )}

      <form
        action={`/api/vespas/${id}`}
        method="POST"
        encType="multipart/form-data"
        className="rounded-2xl border-2 border-foreground bg-card p-6"
      >
        <VespaFormFields
          defaults={{
            year: vespa.year,
            model: vespa.model,
            vin: vespa.vin,
            color: vespa.color,
            story: vespa.story,
          }}
        />
        <p className="mt-2 text-xs text-foreground/50">
          Uploading new photos here adds them alongside the existing ones.
        </p>

        <button
          type="submit"
          className="hard-shadow-sm mt-6 w-full rounded-full border-2 border-foreground bg-accent px-6 py-3 font-bold text-white transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
