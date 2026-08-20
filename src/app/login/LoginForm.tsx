"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  missing_token: "That link is missing a token. Request a new one below.",
  invalid_link: "That link has expired or was already used. Request a new one below.",
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(
    urlError ? ERROR_MESSAGES[urlError] ?? "Something went wrong." : null
  );
  const [devLink, setDevLink] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(body.error ?? "Something went wrong.");
        return;
      }

      setDevLink(body.devLink ?? null);
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border-2 border-foreground bg-card p-6">
        <p className="text-2xl">📬</p>
        <h2 className="mt-2 text-xl font-bold">Check your email</h2>
        <p className="mt-2 text-sm text-foreground/70">
          We sent a sign-in link to <span className="font-semibold">{email}</span>. It expires
          in 15 minutes.
        </p>

        {devLink && (
          <div className="mt-5 rounded-xl border-2 border-dashed border-mint-dark bg-mint/40 p-4">
            <p className="text-xs font-bold tracking-wide text-mint-dark uppercase">
              🔧 Dev mode — no SMTP configured
            </p>
            <p className="mt-1 text-xs text-foreground/70">
              In production this link would only be emailed. For now, here it is:
            </p>
            <a
              href={devLink}
              className="mt-2 block truncate rounded-lg bg-card px-3 py-2 text-sm font-semibold text-accent underline"
            >
              {devLink}
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-xl border-2 border-accent bg-accent/10 p-3 text-sm font-semibold text-accent-dark">
          {error}
        </div>
      )}

      <label className="block text-sm font-bold" htmlFor="email">
        Email address
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-xl border-2 border-foreground bg-card px-4 py-3 outline-none focus:bg-mint/30"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="hard-shadow-sm w-full rounded-full border-2 border-foreground bg-accent px-6 py-3 font-bold text-white transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send magic link"}
      </button>
    </form>
  );
}
