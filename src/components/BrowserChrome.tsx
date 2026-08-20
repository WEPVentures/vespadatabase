import { ReactNode } from "react";

export function BrowserChrome({
  url = "vespadatabase.app/browse",
  children,
}: {
  url?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2 border-b border-border bg-sidebar px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#e8564a]" />
        <span className="h-3 w-3 rounded-full bg-[#f0b84c]" />
        <span className="h-3 w-3 rounded-full bg-[#5fbf7a]" />
        <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-xs text-muted">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}
