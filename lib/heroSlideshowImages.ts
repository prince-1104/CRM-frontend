import { storefrontCatalogImageSrc } from "./catalogMedia";
import type { LandingCatalogueCard } from "./landingTypes";
import type { LandingProductItem } from "./fetchLandingData";
import { industryStockImageForCategory } from "./industryStockImages";

const DEFAULT_HERO_SLIDE =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80";

const HERO_STOCK_CATEGORIES = [
  "Catering",
  "Hotels",
  "Restaurants",
  "Housekeeping",
];

function addUnique(seen: Set<string>, out: string[], raw: string | null | undefined) {
  if (!raw?.trim()) return;
  const trimmed = raw.trim();
  const src =
    storefrontCatalogImageSrc(trimmed) ??
    (trimmed.startsWith("http") ? trimmed : null);
  if (!src || seen.has(src)) return;
  seen.add(src);
  out.push(src);
}

/** Collect up to `limit` unique full-bleed URLs for the hero slideshow. */
export function collectHeroSlideshowImages(
  catalogueCards: LandingCatalogueCard[],
  products: LandingProductItem[],
  catalogCategories: string[],
  limit = 8,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  const sortedCatalogues = [...catalogueCards].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  for (const card of sortedCatalogues) {
    addUnique(seen, out, card.cover_image_url);
  }

  for (const product of products) {
    if (product.active === false) continue;
    addUnique(seen, out, product.image_url);
  }

  const categoryPool = [
    ...catalogCategories,
    ...HERO_STOCK_CATEGORIES,
  ];
  for (const name of categoryPool) {
    addUnique(seen, out, industryStockImageForCategory(name));
  }

  addUnique(seen, out, DEFAULT_HERO_SLIDE);

  if (out.length === 0) out.push(DEFAULT_HERO_SLIDE);
  return out.slice(0, limit);
}

export { DEFAULT_HERO_SLIDE };
