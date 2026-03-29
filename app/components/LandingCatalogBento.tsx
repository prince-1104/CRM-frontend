"use client";

import CatalogueCoverImage from "./CatalogueCoverImage";
import type { LandingCatalogueCard } from "../../lib/landingTypes";
import { resolveCatalogVisual } from "../../lib/industryStockImages";

export type { LandingCatalogueCard };

type LandingCatalogBentoProps = {
  cards: LandingCatalogueCard[];
  onViewCollection: (categoryName: string) => void;
};

function bentoLayoutClass(index: number): string {
  const r = index % 3;
  if (r === 0) return "md:col-span-8";
  if (r === 1) return "md:col-span-4";
  return "md:col-span-12";
}

function cardVisualClass(index: number): {
  glow: string;
  imageOpacity: string;
} {
  const r = index % 3;
  if (r === 0)
    return { glow: "neon-glow-primary", imageOpacity: "opacity-30 group-hover:opacity-60" };
  if (r === 1)
    return { glow: "neon-glow-secondary", imageOpacity: "opacity-20 group-hover:opacity-60" };
  return { glow: "neon-glow-primary", imageOpacity: "opacity-20 group-hover:opacity-60" };
}

export default function LandingCatalogBento({
  cards,
  onViewCollection,
}: LandingCatalogBentoProps) {
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant/40 bg-surface-container/80 px-8 py-16 text-center">
        <p className="font-headline text-xl font-bold text-on-surface">
          Catalogues coming soon
        </p>
        <p className="mt-2 max-w-md mx-auto text-sm text-on-surface-variant">
          Your team can add categories, cover images, and products in the Star Uniform catalog.
          This section updates automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-8">
      {cards.map((c, i) => {
        const visual = resolveCatalogVisual(c.cover_image_url, c.name);
        const badge =
          (c.badge_label && c.badge_label.trim()) || `${c.name.toUpperCase().slice(0, 24)}`;
        const cta = (c.cta_label && c.cta_label.trim()) || "View collection";
        const gridSpanClass = bentoLayoutClass(i);
        const { glow, imageOpacity } = cardVisualClass(i);
        const isWide = i % 3 === 2;
        const isLarge = i % 3 === 0;

        return (
          <button
            key={`${c.name}-${i}`}
            type="button"
            aria-label={`View ${c.name} collection`}
            onClick={() => onViewCollection(c.name)}
            className={`${gridSpanClass} group relative m-0 w-full touch-manipulation overflow-hidden rounded-xl border-none p-0 font-inherit glass-card ${glow} cursor-pointer text-left transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:brightness-[0.97]`}
          >
            <div className={`absolute inset-0 z-0 ${imageOpacity} transition-opacity`}>
              <CatalogueCoverImage
                visual={visual}
                alt=""
                sizes={
                  isWide
                    ? "(max-width: 768px) 100vw, 100vw"
                    : isLarge
                      ? "(max-width: 768px) 100vw, 66vw"
                      : "(max-width: 768px) 100vw, 33vw"
                }
                className="absolute inset-0 h-full w-full"
                imgClassName={
                  isLarge && visual.type === "full"
                    ? "scale-110 transition-transform duration-700 group-hover:scale-100"
                    : isLarge
                      ? "transition-transform duration-700 group-hover:scale-[1.02]"
                      : ""
                }
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            </div>

            {isWide ? (
              <div className="relative z-10 flex min-h-[min(280px,58dvh)] flex-col items-stretch justify-between gap-8 p-6 sm:min-h-[300px] sm:flex-row sm:items-center sm:justify-between sm:gap-12 sm:p-8 md:p-10">
                <div className="max-w-xl rounded-xl bg-black/35 px-4 py-4 backdrop-blur-sm sm:px-5 sm:py-5 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
                  <h3 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] sm:text-4xl">
                    {c.name}
                  </h3>
                </div>
                <span className="pointer-events-none inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container px-8 py-3.5 text-center font-label font-bold uppercase tracking-[0.15em] text-on-primary shadow-lg transition-all group-hover:shadow-[0_0_28px_rgba(161,250,255,0.25)] sm:min-h-0 sm:px-12 sm:py-5 sm:tracking-[0.2em]">
                  {cta}
                </span>
              </div>
            ) : isLarge ? (
              <div className="relative z-10 flex h-full min-h-[min(22rem,62dvh)] flex-col justify-between p-6 sm:min-h-[450px] sm:p-8 md:p-10">
                <div className="-m-1 rounded-xl bg-black/30 p-3 backdrop-blur-sm sm:m-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                  <span className="mb-4 inline-block rounded-full bg-primary-container px-3 py-1.5 font-label text-[0.65rem] font-bold uppercase tracking-widest text-on-primary-container sm:mb-6">
                    {badge}
                  </span>
                  <h3 className="mb-4 font-headline text-[clamp(1.75rem,8vw,3rem)] font-bold uppercase leading-tight tracking-tighter text-on-surface drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] sm:mb-6 sm:text-5xl">
                    {c.name}
                  </h3>
                </div>
                <span className="pointer-events-none flex w-fit min-h-[44px] items-center gap-3 font-label text-sm font-bold uppercase tracking-widest text-primary transition-all group-hover:gap-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] sm:min-h-0">
                  {cta}{" "}
                  <span className="material-symbols-outlined drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    arrow_forward
                  </span>
                </span>
              </div>
            ) : (
              <div className="relative z-10 flex h-full min-h-[min(22rem,62dvh)] flex-col justify-between p-6 sm:min-h-[450px] sm:p-8">
                <div className="-m-1 rounded-xl bg-black/30 p-3 backdrop-blur-sm sm:m-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                  <h3 className="mb-4 font-headline text-[clamp(1.5rem,6.5vw,2.25rem)] font-bold uppercase tracking-tighter text-on-surface drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] sm:mb-6 sm:text-3xl">
                    {c.name}
                  </h3>
                </div>
                <span className="pointer-events-none block min-h-[48px] w-full rounded-lg border-2 border-secondary/80 bg-black/50 py-3.5 text-center font-label text-xs font-bold uppercase tracking-widest text-on-surface backdrop-blur-sm transition-colors group-hover:border-secondary group-hover:bg-secondary group-hover:text-on-secondary sm:min-h-0 sm:py-4">
                  {cta}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
