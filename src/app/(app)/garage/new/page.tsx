import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { VespaFormFields } from "@/components/VespaFormFields";

export default async function NewVespaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.username) redirect("/onboarding");

  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="mb-3 text-xs font-bold tracking-[0.2em] text-muted uppercase">
        Add a Vespa
      </p>
      <h1 className="mb-8 text-3xl font-black tracking-tight sm:text-4xl">Park it in the registry.</h1>

      {error && (
        <div className="mb-5 rounded-xl border border-accent bg-accent-soft p-3 text-sm font-semibold text-accent-dark">
          {error}
        </div>
      )}

      <form
        action="/api/vespas"
        method="POST"
        encType="multipart/form-data"
        className="rounded-xl border border-border bg-card p-6"
      >
        <VespaFormFields />

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-accent px-6 py-3 font-bold text-white transition hover:bg-accent-dark"
        >
          Add to my garage
        </button>
      </form>
    </div>
  );
}
