"use client";

import Image from "next/image";
import type { CatalogVisual } from "../../lib/industryStockImages";

type CatalogueCoverImageProps = {
  visual: CatalogVisual;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Extra classes on the underlying img (e.g. hover zoom for full-bleed only). */
  imgClassName?: string;
};

export default function CatalogueCoverImage({
  visual,
  alt,
  sizes,
  priority,
  className = "",
  imgClassName = "",
}: CatalogueCoverImageProps) {
  if (visual.type === "full") {
    return (
      <div className={`relative h-full min-h-0 w-full overflow-hidden ${className}`}>
        <Image
          src={visual.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName}`}
        />
      </div>
    );
  }

  const originClass =
    visual.quadrant === "tl"
      ? "origin-top-left"
      : visual.quadrant === "tr"
        ? "origin-top-right"
        : visual.quadrant === "bl"
          ? "origin-bottom-left"
          : "origin-bottom-right";

  return (
    <div className={`relative h-full min-h-0 w-full overflow-hidden ${className}`}>
      <Image
        src={visual.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`scale-[2] object-cover ${originClass} ${imgClassName}`}
      />
    </div>
  );
}
