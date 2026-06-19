"use client";

import { useCallback, useRef, useState } from "react";
import CatalogueCoverImage from "./CatalogueCoverImage";
import type { CatalogVisual } from "../../lib/industryStockImages";

type PremiumProductCardProps = {
  sku: string;
  category: string;
  visual: CatalogVisual;
  imageLabel: string;
  index: number;
  onZoom: () => void;
  onQuote: () => void;
};

export default function PremiumProductCard({
  sku,
  category,
  visual,
  imageLabel,
  index,
  onZoom,
  onQuote,
}: PremiumProductCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, lift: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const resetTilt = useCallback(() => {
    setTilt({ rx: 0, ry: 0, lift: 0 });
    setGlare({ x: 50, y: 50 });
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const el = cardRef.current;
      if (!el || e.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      setTilt({
        ry: (px - 0.5) * 18,
        rx: (0.5 - py) * 14,
        lift: 14,
      });
      setGlare({ x: px * 100, y: py * 100 });
    },
    [],
  );

  const accent =
    index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "tertiary";
  const accentRing =
    accent === "primary"
      ? "from-primary/50 via-cyan-400/20 to-transparent"
      : accent === "secondary"
        ? "from-secondary/50 via-fuchsia-400/20 to-transparent"
        : "from-tertiary/50 via-lime-300/20 to-transparent";
  const accentGlow =
    accent === "primary"
      ? "shadow-[0_24px_60px_-12px_rgba(161,250,255,0.35)]"
      : accent === "secondary"
        ? "shadow-[0_24px_60px_-12px_rgba(216,115,255,0.35)]"
        : "shadow-[0_24px_60px_-12px_rgba(188,255,95,0.3)]";

  return (
    <article
      ref={cardRef}
      className="product-card-3d group/card relative"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${tilt.lift}px)`,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface-container-high/90 via-surface-container/80 to-surface-container-low/90 p-[1px] ${accentGlow} transition-shadow duration-500 group-hover/card:border-white/20`}
      >
        <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-surface-container/95 backdrop-blur-xl">
          {/* Glare overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.14) 0%, transparent 55%)`,
            }}
            aria-hidden
          />

          {/* Image stage — 3D pedestal */}
          <div className="relative px-4 pt-4">
            <div
              className={`absolute inset-x-6 top-8 h-24 rounded-full bg-gradient-to-r ${accentRing} blur-2xl opacity-70`}
              aria-hidden
            />
            <button
              type="button"
              onClick={onZoom}
              className="product-stage-3d group/stage relative mx-auto block w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-surface-container-highest to-surface-container-low p-0 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              aria-label={`View full image: ${imageLabel}`}
              title="View full image"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <CatalogueCoverImage
                  visual={visual}
                  alt={imageLabel}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover/stage:scale-[1.06]"
                  imgClassName="object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/10 to-transparent" />

                <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary backdrop-blur-md">
                  {sku}
                </span>

                <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover/stage:opacity-100">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md">
                    <span className="material-symbols-outlined text-3xl">zoom_in</span>
                  </span>
                </span>
              </div>
            </button>
          </div>

          {/* Meta + CTA */}
          <div className="relative space-y-3 px-4 pb-4 pt-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/40 bg-surface-container-high/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    accent === "primary"
                      ? "bg-primary shadow-[0_0_8px_#a1faff]"
                      : accent === "secondary"
                        ? "bg-secondary shadow-[0_0_8px_#d873ff]"
                        : "bg-tertiary shadow-[0_0_8px_#bcff5f]"
                  }`}
                />
                {category}
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant/70">
                #{String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={onQuote}
              className="saas-cta-3d group/btn relative w-full overflow-hidden rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-on-primary"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get your quote
                <span className="material-symbols-outlined text-base transition-transform group-hover/btn:translate-x-0.5">
                  arrow_forward
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
