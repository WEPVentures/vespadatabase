const SIDEBAR_ITEMS = [
  { emoji: "🧭", label: "Browse", active: true },
  { emoji: "🏠", label: "My Garage" },
  { emoji: "👤", label: "Profile" },
];

const SAMPLE_ROWS = [
  { swatch: "#7a9676", title: "1978 P200E", owner: "@marco", color: "Sage Green", vin: "VNX5T…" },
  { swatch: "#e8b33a", title: "2019 GTS 300", owner: "@rosa", color: "Giallo Positano", vin: "ZAPM…" },
  { swatch: "#d7d2c4", title: "1962 GS160", owner: "@finn", color: "Ivory", vin: "unknown" },
];

export function MockDashboard() {
  return (
    <div className="flex flex-col sm:flex-row">
      <aside className="flex shrink-0 gap-2 border-b border-border bg-sidebar p-3 sm:w-40 sm:flex-col sm:gap-1 sm:border-b-0 sm:border-r sm:p-4">
        {SIDEBAR_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap ${
              item.active ? "bg-accent-soft text-accent-dark" : "text-foreground/60"
            }`}
          >
            <span>{item.emoji}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </div>
        ))}
      </aside>

      <div className="flex-1 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap gap-x-2 gap-y-1 text-xs font-semibold text-muted">
          <span>3 Vespas</span>
          <span>·</span>
          <span>12 Garages</span>
          <span>·</span>
          <span>47 Registered</span>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-2 border-b border-border bg-sidebar px-3 py-2 text-[10px] font-bold tracking-wide text-muted uppercase">
            <span>Vespa</span>
            <span className="hidden sm:block">Owner</span>
            <span>VIN</span>
          </div>
          {SAMPLE_ROWS.map((row) => (
            <div
              key={row.title}
              className="grid grid-cols-[1.4fr_0.8fr_0.8fr] items-center gap-2 border-b border-border px-3 py-2 text-xs last:border-b-0"
            >
              <span className="flex items-center gap-2 truncate font-bold">
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ backgroundColor: row.swatch }}
                />
                <span className="truncate">{row.title}</span>
              </span>
              <span className="hidden truncate text-muted sm:block">{row.owner}</span>
              <span className="truncate font-mono text-muted">{row.vin}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
