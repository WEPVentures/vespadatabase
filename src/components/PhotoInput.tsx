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
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="mt-1 block w-full rounded-lg border border-dashed border-border bg-card px-4 py-6 text-sm file:mr-4 file:rounded-lg file:border file:border-border file:bg-sidebar file:px-4 file:py-2 file:font-semibold file:text-foreground"
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
