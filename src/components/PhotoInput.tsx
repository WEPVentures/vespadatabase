"use client";

import { useRef, useState } from "react";

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;

// Phone camera photos routinely run several MB each, and Netlify's
// serverless functions cap request bodies well under what a handful of
// full-resolution photos add up to. Resize/re-encode in the browser before
// upload so the request always stays small, regardless of what the camera
// produced.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  if (!blob || blob.size >= file.size) return file;

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
}

export function PhotoInput({ name = "photos" }: { name?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 8);
    if (files.length === 0) {
      setPreviews([]);
      return;
    }

    setIsProcessing(true);
    const compressed = await Promise.all(files.map(compressImage));
    setIsProcessing(false);

    // Replace the input's own file list with the compressed versions so
    // the eventual form submit uploads the small files, not the originals.
    const dataTransfer = new DataTransfer();
    compressed.forEach((f) => dataTransfer.items.add(f));
    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }

    setPreviews(compressed.map((f) => URL.createObjectURL(f)));
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
          {isProcessing
            ? "Processing…"
            : previews.length > 0
              ? `${previews.length} file${previews.length === 1 ? "" : "s"}`
              : "No files chosen"}
        </span>
      </div>
      <input
        ref={inputRef}
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
