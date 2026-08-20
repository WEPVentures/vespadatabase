import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export async function Nav() {
  const user = await getCurrentUser();

  return (
    <header className="border-b-2 border-foreground bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span>🛵</span>
          <span>VespaDatabase</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold sm:gap-3">
          <Link
            href="/browse"
            className="rounded-full px-3 py-1.5 hover:bg-mint"
          >
            🧭 Browse
          </Link>

          {user ? (
            <>
              <Link href="/garage" className="rounded-full px-3 py-1.5 hover:bg-mint">
                🏠 My Garage
              </Link>
              <Link
                href={user.username ? `/garage/${user.username}` : "/onboarding"}
                className="rounded-full px-3 py-1.5 hover:bg-mint"
              >
                👤 {user.username ?? "Profile"}
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="rounded-full border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border-2 border-foreground bg-accent px-4 py-1.5 text-white hover:bg-accent-dark"
            >
              Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
