"use client";

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
      ? "group-hover/card:shadow-[0_20px_48px_-12px_rgba(161,250,255,0.35)]"
      : accent === "secondary"
        ? "group-hover/card:shadow-[0_20px_48px_-12px_rgba(216,115,255,0.35)]"
        : "group-hover/card:shadow-[0_20px_48px_-12px_rgba(188,255,95,0.3)]";

  return (
    <article className="product-card-hover group/card relative h-full">
      <div
        className={`relative h-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-surface-container-high/90 via-surface-container/80 to-surface-container-low/90 p-[1px] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 md:rounded-2xl ${accentGlow} group-hover/card:border-white/20 group-active/card:scale-[0.99]`}
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(0.75rem-1px)] bg-surface-container/95 backdrop-blur-xl md:rounded-[calc(1rem-1px)]">
          <div className="relative px-2.5 pt-2.5 md:px-4 md:pt-4">
            <div
              className={`absolute inset-x-4 top-6 h-16 rounded-full bg-gradient-to-r ${accentRing} blur-2xl opacity-60 md:inset-x-6 md:top-8 md:h-24 md:opacity-70`}
              aria-hidden
            />
            <button
              type="button"
              onClick={onZoom}
              className="group/stage relative mx-auto block w-full overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-surface-container-highest to-surface-container-low p-0 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-300 group-hover/card:border-primary/30 md:rounded-xl touch-manipulation"
              aria-label={`View full image: ${imageLabel}`}
              title="View full image"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4] md:aspect-[4/5]">
                <CatalogueCoverImage
                  visual={visual}
                  alt={imageLabel}
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover/card:bg-primary/5" />

                <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary backdrop-blur-md md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-[10px]">
                  {sku}
                </span>

                <span className="mobile-tap-hint pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/90 md:hidden">
                  <span className="material-symbols-outlined text-sm">touch_app</span>
                  Tap
                </span>
              </div>
            </button>
          </div>

          <div className="relative mt-auto space-y-2 px-2.5 pb-2.5 pt-2 md:space-y-3 md:px-4 md:pb-4 md:pt-3">
            <div className="flex items-center justify-between gap-1">
              <span className="inline-flex max-w-[85%] items-center gap-1 truncate rounded-full border border-outline-variant/40 bg-surface-container-high/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant md:gap-1.5 md:px-3 md:py-1 md:text-[11px]">
                <span
                  className={`h-1 w-1 shrink-0 rounded-full md:h-1.5 md:w-1.5 ${
                    accent === "primary"
                      ? "bg-primary shadow-[0_0_8px_#a1faff]"
                      : accent === "secondary"
                        ? "bg-secondary shadow-[0_0_8px_#d873ff]"
                        : "bg-tertiary shadow-[0_0_8px_#bcff5f]"
                  }`}
                />
                <span className="truncate">{category}</span>
              </span>
              <span className="hidden font-mono text-[10px] text-on-surface-variant/70 sm:inline">
                #{String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={onQuote}
              className="saas-cta-3d group/btn relative w-full min-h-[44px] overflow-hidden rounded-lg px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-on-primary touch-manipulation md:min-h-0 md:rounded-xl md:px-4 md:py-3.5 md:text-xs md:tracking-[0.2em]"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5 md:gap-2">
                Quote
                <span className="material-symbols-outlined text-sm md:text-base transition-transform group-hover/btn:translate-x-0.5">
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
