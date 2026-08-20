"use client";

export function DeleteVespaButton({ vespaId }: { vespaId: string }) {
  return (
    <form
      action={`/api/vespas/${vespaId}/delete`}
      method="POST"
      onSubmit={(e) => {
        if (!confirm("Remove this Vespa from the registry? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-border px-5 py-2.5 font-bold text-foreground/70 hover:border-error hover:text-error"
      >
        Delete
      </button>
    </form>
  );
}
