import { PhotoInput } from "@/components/PhotoInput";

type Defaults = {
  year?: number | null;
  model?: string;
  vin?: string | null;
  color?: string | null;
  story?: string | null;
};

export function VespaFormFields({ defaults }: { defaults?: Defaults }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-bold" htmlFor="model">
            Model *
          </label>
          <input
            id="model"
            name="model"
            required
            defaultValue={defaults?.model ?? ""}
            placeholder="GTS 300, P200E, Primavera…"
            className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label className="block text-sm font-bold" htmlFor="year">
            Year
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min={1946}
            max={new Date().getFullYear() + 1}
            defaultValue={defaults?.year ?? ""}
            placeholder="1978"
            className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-bold" htmlFor="color">
            Color
          </label>
          <input
            id="color"
            name="color"
            defaultValue={defaults?.color ?? ""}
            placeholder="Sage Green"
            className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div>
          <label className="block text-sm font-bold" htmlFor="vin">
            VIN / serial number
          </label>
          <input
            id="vin"
            name="vin"
            defaultValue={defaults?.vin ?? ""}
            placeholder="Optional, but encouraged"
            className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold" htmlFor="story">
          Story
        </label>
        <textarea
          id="story"
          name="story"
          rows={5}
          defaultValue={defaults?.story ?? ""}
          placeholder="How'd you get it? Restoration history, quirks, anything worth remembering."
          className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <PhotoInput />
    </div>
  );
}
