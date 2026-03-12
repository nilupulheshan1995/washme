"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ServiceGalleryProps = {
  images: string[];
  storeName: string;
};

export const ServiceGallery = ({ images, storeName }: ServiceGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeImages = useMemo(() => (images.length > 0 ? images : []), [images]);

  if (safeImages.length === 0) {
    return null;
  }

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0 ? safeImages.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === safeImages.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={safeImages[activeIndex]}
          alt={`${storeName} gallery image ${activeIndex + 1}`}
          width={1200}
          height={760}
          sizes="(min-width: 1024px) 65vw, 100vw"
          className="h-56 w-full object-cover sm:h-80"
        />

        <button
          type="button"
          onClick={previousImage}
          className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-slate-700 transition hover:bg-white"
          aria-label="Previous image"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={nextImage}
          className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-slate-700 transition hover:bg-white"
          aria-label="Next image"
        >
          ›
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {safeImages.map((imageUrl, index) => (
          <button
            key={imageUrl}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
              index === activeIndex
                ? "border-blue-600"
                : "border-transparent opacity-80 hover:opacity-100"
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={imageUrl}
              alt={`${storeName} thumbnail ${index + 1}`}
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
