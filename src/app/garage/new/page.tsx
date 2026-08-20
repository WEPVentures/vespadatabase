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
      <p className="mb-3 text-xs font-bold tracking-[0.2em] text-foreground/50 uppercase">
        Add a Vespa
      </p>
      <h1 className="mb-8 text-4xl font-black tracking-tight">Park it in the registry.</h1>

      {error && (
        <div className="mb-5 rounded-xl border-2 border-accent bg-accent/10 p-3 text-sm font-semibold text-accent-dark">
          {error}
        </div>
      )}

      <form
        action="/api/vespas"
        method="POST"
        encType="multipart/form-data"
        className="rounded-2xl border-2 border-foreground bg-card p-6"
      >
        <VespaFormFields />

        <button
          type="submit"
          className="hard-shadow-sm mt-6 w-full rounded-full border-2 border-foreground bg-accent px-6 py-3 font-bold text-white transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          Add to my garage
        </button>
      </form>
    </div>
  );
}
