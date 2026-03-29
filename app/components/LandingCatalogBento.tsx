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
    return { glow: "neon-glow-primary", imageOpacity: "opacity-30 group-hover:opacity-50" };
  if (r === 1)
    return { glow: "neon-glow-secondary", imageOpacity: "opacity-20" };
  return { glow: "neon-glow-primary", imageOpacity: "opacity-20" };
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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {cards.map((c, i) => {
        const visual = resolveCatalogVisual(c.cover_image_url, c.name);
        const badge =
          (c.badge_label && c.badge_label.trim()) || `${c.name.toUpperCase().slice(0, 24)}`;
        const cta = (c.cta_label && c.cta_label.trim()) || "View collection";
        const previews =
          c.preview_product_names.length > 0
            ? c.preview_product_names
            : ["Add products in Star Uniform", "to show highlights", "for this catalogue"];
        const span = bentoLayoutClass(i);
        const { glow, imageOpacity } = cardVisualClass(i);
        const isWide = i % 3 === 2;
        const isLarge = i % 3 === 0;

        return (
          <div
            key={`${c.name}-${i}`}
            className={`${span} group relative overflow-hidden rounded-xl glass-card border-none ${glow} transition-all duration-500`}
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
              <div className="relative z-10 p-10 flex flex-col md:flex-row items-center justify-between gap-12 min-h-[300px]">
                <div className="max-w-xl rounded-xl bg-black/35 px-5 py-5 backdrop-blur-sm md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
                  <h3 className="font-headline text-4xl font-bold mb-4 tracking-tighter uppercase text-on-surface drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
                    {c.name}
                  </h3>
                  <p className="mb-6 text-on-surface/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
                    {c.product_count} product{c.product_count === 1 ? "" : "s"} in this range.
                    Curated in Star Uniform to match how you sell.
                  </p>
                  <div className="flex flex-wrap gap-6 text-sm font-label uppercase tracking-widest text-primary drop-shadow-[0_1px_10px_rgba(0,0,0,0.95)]">
                    {previews.slice(0, 3).map((name) => (
                      <span key={name}>• {name}</span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onViewCollection(c.name)}
                  className="px-12 py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold font-label uppercase tracking-[0.2em] shadow-lg hover:shadow-[0_0_28px_rgba(161,250,255,0.25)] transition-all shrink-0"
                >
                  {cta}
                </button>
              </div>
            ) : isLarge ? (
              <div className="relative z-10 p-10 h-full flex flex-col justify-between min-h-[450px]">
                <div className="rounded-xl bg-black/30 p-4 -m-1 backdrop-blur-sm sm:bg-transparent sm:p-0 sm:m-0 sm:backdrop-blur-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label text-[0.65rem] font-bold uppercase tracking-widest mb-6">
                    {badge}
                  </span>
                  <h3 className="font-headline text-5xl font-bold mb-6 tracking-tighter uppercase text-on-surface drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
                    {c.name}
                  </h3>
                  <ul className="space-y-3 mb-8">
                    {previews.slice(0, 3).map((line) => (
                      <li
                        key={line}
                        className="flex items-center gap-3 text-on-surface drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]"
                      >
                        <span className="material-symbols-outlined text-primary text-sm drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                          check_circle
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => onViewCollection(c.name)}
                  className="w-fit flex items-center gap-3 text-primary font-bold font-label uppercase tracking-widest text-sm hover:gap-5 transition-all drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
                >
                  {cta}{" "}
                  <span className="material-symbols-outlined drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    arrow_forward
                  </span>
                </button>
              </div>
            ) : (
              <div className="relative z-10 p-8 flex flex-col justify-between h-full min-h-[450px]">
                <div className="rounded-xl bg-black/30 p-4 -m-1 backdrop-blur-sm sm:bg-transparent sm:p-0 sm:m-0 sm:backdrop-blur-none">
                  <h3 className="font-headline text-3xl font-bold mb-6 tracking-tighter uppercase text-on-surface drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
                    {c.name}
                  </h3>
                  <ul className="space-y-3 mb-8 text-sm">
                    <li className="mb-2 italic text-on-surface/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                      {c.product_count} piece{c.product_count === 1 ? "" : "s"} live
                    </li>
                    {previews.slice(0, 3).map((line) => (
                      <li
                        key={line}
                        className="text-on-surface/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => onViewCollection(c.name)}
                  className="w-full py-4 rounded-lg border-2 border-secondary/80 bg-black/50 text-on-surface font-bold font-label uppercase tracking-widest text-xs backdrop-blur-sm hover:bg-secondary hover:text-on-secondary hover:border-secondary transition-colors"
                >
                  {cta}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
