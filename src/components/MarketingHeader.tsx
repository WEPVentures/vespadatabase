import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export async function MarketingHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-base font-black tracking-tight">
          <span>🛵</span>
          <span>Vespa Database</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link href="/browse" className="rounded-lg px-3 py-2 text-foreground/70 hover:bg-black/[0.04] hover:text-foreground">
            🧭 Browse
          </Link>
          <Link
            href={user ? "/garage" : "/login"}
            className="rounded-lg bg-accent px-4 py-2 text-white hover:bg-accent-dark"
          >
            {user ? "My Garage" : "Sign Up"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
