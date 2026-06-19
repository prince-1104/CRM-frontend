import { storefrontCatalogImageSrc } from "./catalogMedia";
import type { LandingCatalogueCard } from "./landingTypes";
import type { LandingProductItem } from "./fetchLandingData";

/** AI-generated hero background images — served from /public/images */
export const AI_HERO_SLIDES = [
  "/images/hero-chef.png",
  "/images/hero-hotel.png",
  "/images/hero-restaurant.png",
  "/images/hero-catering.png",
  "/images/hero-housekeeping.png",
] as const;

const DEFAULT_HERO_SLIDE = AI_HERO_SLIDES[0];

function addUnique(seen: Set<string>, out: string[], raw: string | null | undefined) {
  if (!raw?.trim()) return;
  const trimmed = raw.trim();
  const src =
    storefrontCatalogImageSrc(trimmed) ??
    (trimmed.startsWith("http") || trimmed.startsWith("/") ? trimmed : null);
  if (!src || seen.has(src)) return;
  seen.add(src);
  out.push(src);
}

/** Collect up to `limit` unique full-bleed URLs for the hero slideshow.
 *  AI-generated images always lead; admin catalogue/product images follow. */
export function collectHeroSlideshowImages(
  catalogueCards: LandingCatalogueCard[],
  products: LandingProductItem[],
  _catalogCategories: string[],
  limit = 8,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  // Seed with AI-generated images first so they always appear
  for (const src of AI_HERO_SLIDES) {
    addUnique(seen, out, src);
  }

  // Append admin-uploaded catalogue cover images
  const sortedCatalogues = [...catalogueCards].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  for (const card of sortedCatalogues) {
    if (out.length >= limit) break;
    addUnique(seen, out, card.cover_image_url);
  }

  // Append active product images to fill remaining slots
  for (const product of products) {
    if (out.length >= limit) break;
    if (product.active === false) continue;
    addUnique(seen, out, product.image_url);
  }

  if (out.length === 0) out.push(DEFAULT_HERO_SLIDE);
  return out.slice(0, limit);
}

export { DEFAULT_HERO_SLIDE };
