"use client";

import { useState } from "react";
import Image from "next/image";

type Photo = { id: string; url: string };

export function VespaPhotoGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [selected, setSelected] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="mb-8 flex aspect-[16/10] items-center justify-center rounded-xl border border-border bg-mint text-6xl">
        🛵
      </div>
    );
  }

  const mainPhoto = photos[selected] ?? photos[0];

  return (
    <div className="mb-8">
      <div className="relative h-[320px] w-full overflow-hidden rounded-xl border border-border bg-mint sm:h-[480px]">
        <Image
          src={mainPhoto.url}
          alt={title}
          fill
          className="object-contain"
          sizes="(min-width: 768px) 800px, 100vw"
          priority
        />
      </div>

      {photos.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === selected ? "border-accent" : "border-transparent"
              }`}
            >
              <Image src={photo.url} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
