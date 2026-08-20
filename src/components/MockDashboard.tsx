const SIDEBAR_ITEMS = [
  { emoji: "🏠", label: "My Garage", active: true },
  { emoji: "🛵", label: "Browse" },
  { emoji: "👤", label: "Profile" },
];

const SAMPLE_VESPAS = [
  { emoji: "🟢", title: "1978 P200E", sub: "Sage Green · #VNX5T..." },
  { emoji: "🟡", title: "2019 GTS 300", sub: "Giallo Positano · #ZAPM..." },
  { emoji: "⚪️", title: "1962 GS160", sub: "Ivory · VIN unknown" },
];

export function MockDashboard() {
  return (
    <div className="flex flex-col sm:flex-row">
      <aside className="flex shrink-0 gap-2 border-b-2 border-foreground bg-[#f6f1e3] p-3 sm:w-48 sm:flex-col sm:gap-1 sm:border-b-0 sm:border-r-2 sm:p-4">
        {SIDEBAR_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap ${
              item.active ? "bg-accent text-white" : "text-foreground/70"
            }`}
          >
            <span>{item.emoji}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </div>
        ))}
      </aside>

      <div className="flex-1 p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap gap-x-2 gap-y-1 text-sm font-semibold text-foreground/70">
          <span>3 Vespas</span>
          <span>·</span>
          <span>12 Garages</span>
          <span>·</span>
          <span>47 Registered</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {SAMPLE_VESPAS.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border-2 border-foreground bg-card p-3"
            >
              <div className="mb-2 flex h-16 items-center justify-center rounded-lg bg-mint text-2xl">
                {v.emoji}
              </div>
              <p className="text-sm font-bold">{v.title}</p>
              <p className="truncate text-xs text-foreground/60">{v.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
