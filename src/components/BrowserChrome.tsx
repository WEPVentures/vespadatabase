import { ReactNode } from "react";

export function BrowserChrome({
  url = "vespadatabase.app/garage",
  children,
}: {
  url?: string;
  children: ReactNode;
}) {
  return (
    <div className="hard-shadow overflow-hidden rounded-2xl border-2 border-foreground bg-card">
      <div className="flex items-center gap-2 border-b-2 border-foreground bg-[#f0ead9] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#e8564a]" />
        <span className="h-3 w-3 rounded-full bg-[#f0b84c]" />
        <span className="h-3 w-3 rounded-full bg-[#5fbf7a]" />
        <span className="ml-3 truncate rounded-md bg-white/70 px-3 py-1 text-xs text-foreground/60">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}
