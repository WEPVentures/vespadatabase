"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function UsernameForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push("/garage");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-xl border-2 border-accent bg-accent/10 p-3 text-sm font-semibold text-accent-dark">
          {error}
        </div>
      )}

      <label className="block text-sm font-bold" htmlFor="username">
        Username
      </label>
      <div className="flex items-center rounded-xl border-2 border-foreground bg-card focus-within:bg-mint/30">
        <span className="pl-4 text-foreground/40">@</span>
        <input
          id="username"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-z0-9_-]+"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          placeholder="scooterino"
          className="w-full rounded-xl bg-transparent px-2 py-3 outline-none"
        />
      </div>
      <p className="text-xs text-foreground/50">
        3-20 characters: lowercase letters, numbers, - or _
      </p>

      <button
        type="submit"
        disabled={loading}
        className="hard-shadow-sm w-full rounded-full border-2 border-foreground bg-accent px-6 py-3 font-bold text-white transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:opacity-60"
      >
        {loading ? "Saving…" : "Continue to my garage"}
      </button>
    </form>
  );
}
