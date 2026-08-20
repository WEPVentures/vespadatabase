"use client";

import { useState } from "react";

export function PhotoInput({ name = "photos" }: { name?: string }) {
  const [previews, setPreviews] = useState<string[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 8);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <div>
      <label className="block text-sm font-bold" htmlFor={name}>
        Photos
      </label>
      <div className="mt-1 flex items-center gap-3 rounded-lg border border-dashed border-border bg-card px-4 py-6">
        <label
          htmlFor={name}
          className="cursor-pointer rounded-lg border border-border bg-sidebar px-4 py-2 text-sm font-semibold text-foreground hover:bg-black/[0.04]"
        >
          Choose Files
        </label>
        <span className="text-sm text-muted">
          {previews.length > 0
            ? `${previews.length} file${previews.length === 1 ? "" : "s"}`
            : "No files chosen"}
        </span>
      </div>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="sr-only"
      />
      <p className="mt-1 text-xs text-muted">Up to 8 photos. JPG, PNG, WEBP, or GIF.</p>

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`Preview ${i + 1}`}
              className="aspect-square rounded-lg border border-border object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
