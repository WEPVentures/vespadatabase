"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarUser = {
  username: string | null;
} | null;

function NavLink({
  href,
  emoji,
  label,
  active,
}: {
  href: string;
  emoji: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-sidebar-active text-white"
          : "text-foreground/70 hover:bg-black/[0.04] hover:text-foreground"
      }`}
    >
      <span className="text-base leading-none">{emoji}</span>
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-5 md:flex">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2 text-base font-black tracking-tight">
        <span>🛵</span>
        <span>Vespa Database</span>
      </Link>

      <nav className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
          Data
        </p>
        <NavLink href="/browse" emoji="🧭" label="Browse" active={pathname === "/browse"} />
        <NavLink
          href="/garage"
          emoji="🏠"
          label="My Garage"
          active={pathname === "/garage" || pathname === "/garage/new"}
        />
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
        {user ? (
          <>
            <NavLink
              href={user.username ? `/garage/${user.username}` : "/onboarding"}
              emoji="👤"
              label={user.username ?? "Profile"}
              active={pathname === `/garage/${user.username}`}
            />
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-foreground/60 hover:bg-black/[0.04] hover:text-foreground"
              >
                Log out
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-accent px-3 py-2 text-center text-sm font-bold text-white hover:bg-accent-dark"
          >
            Sign Up
          </Link>
        )}
      </div>
    </aside>
  );
}

export function MobileTopBar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 md:hidden">
      <Link href="/" className="flex items-center gap-1.5 text-sm font-black tracking-tight">
        <span>🛵</span>
        <span>Vespa Database</span>
      </Link>

      <nav className="flex items-center gap-1">
        <Link
          href="/browse"
          className={`rounded-full px-2.5 py-1.5 text-lg ${
            pathname === "/browse" ? "bg-sidebar-active" : ""
          }`}
        >
          🧭
        </Link>
        {user ? (
          <>
            <Link
              href="/garage"
              className={`rounded-full px-2.5 py-1.5 text-lg ${
                pathname === "/garage" ? "bg-sidebar-active" : ""
              }`}
            >
              🏠
            </Link>
            <Link
              href={user.username ? `/garage/${user.username}` : "/onboarding"}
              className={`rounded-full px-2.5 py-1.5 text-lg ${
                pathname === `/garage/${user.username}` ? "bg-sidebar-active" : ""
              }`}
            >
              👤
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-white"
          >
            Sign Up
          </Link>
        )}
      </nav>
    </header>
  );
}
