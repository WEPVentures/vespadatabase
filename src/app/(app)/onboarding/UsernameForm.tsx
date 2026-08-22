"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function UsernameForm({
  initialUsername = "",
  redirectTo = "/garage",
  submitLabel = "Continue to my garage",
}: {
  initialUsername?: string;
  redirectTo?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(initialUsername);
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

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-xl border border-error bg-error-soft p-3 text-sm font-semibold text-error-dark">
          {error}
        </div>
      )}

      <label className="block text-sm font-bold" htmlFor="username">
        Username
      </label>
      <div className="flex items-center rounded-lg border border-border bg-card focus-within:ring-2 focus-within:ring-accent/30">
        <span className="pl-4 text-muted">@</span>
        <input
          id="username"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-z0-9_-]+"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          placeholder="scooterino"
          className="w-full rounded-lg bg-transparent px-2 py-3 outline-none"
        />
      </div>
      <p className="text-xs text-muted">
        3-20 characters: lowercase letters, numbers, - or _
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-accent px-6 py-3 font-bold text-white transition hover:bg-accent-dark disabled:opacity-60"
      >
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
