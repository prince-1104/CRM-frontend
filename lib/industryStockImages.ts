import { storefrontCatalogImageSrc } from "./catalogMedia";

/** 2×2 branded grid in `public/images/` — quadrants: tl F&B, tr hotel, bl catering (incl. chef & bar). */
export const BRANDED_CATALOGUE_GRID_PATH = "/images/star-uniform-catalogues-grid.png";

const DEFAULT_CATALOG_URL =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=82";

export type CatalogVisual =
  | { type: "full"; src: string }
  | { type: "grid-quadrant"; src: string; quadrant: "tl" | "tr" | "bl" | "br" };

type IndustryRule = { test: RegExp; url: string };

/** Lifestyle stock when category does not map to the branded 2×2 grid. */
const INDUSTRY_RULES: IndustryRule[] = [
  {
    test: /hotel|lodging|hospitality|resort|front\s*desk|reception|concierge|lobby/i,
    url: "https://images.unsplash.com/photo-1542314831-068cd1db693b?auto=format&fit=crop&w=1400&q=82",
  },
  {
    test: /restaurant|dining|waiter|waitress|f&b|f\s*&\s*b/i,
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=82",
  },
  {
    test: /cater|event\s*staff|banquet|gala|corporate\s*event|catering|\bbar\b|lounge|mixolog|bartend|pub\b|chef|culinary|kitchen|cook|baker|pastry|wear/i,
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=82",
  },
  {
    test: /hk|house\s*keeping|housekeeping|room\s*attend|cleaning\s*staff|janitorial/i,
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=82",
  },
  {
    test: /cafe|coffee|bakery/i,
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=82",
  },
  {
    test: /security|guard|valet|porter|bellman|doorman/i,
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1400&q=82",
  },
];

/**
 * Branded grid quadrants: TL restaurant / dining, TR hotel, BL catering (chef, bar & lounge).
 */
const BRANDED_QUADRANT_RULES: { test: RegExp; quadrant: "tl" | "tr" | "bl" | "br" }[] = [
  {
    test: /cater|banquet|catering|event\s*staff|\bbar\b|lounge|mixolog|bartend|pub\b|chef|wear|culinary|kitchen|cook|pastry/i,
    quadrant: "bl",
  },
  {
    test: /hotel|management|lodging|reception|front\s*desk|concierge|lobby|\bhk\b|house\s*keep/i,
    quadrant: "tr",
  },
  {
    test: /restaurant|dining|waiter|waitress|f&b|f\s*&\s*b/i,
    quadrant: "tl",
  },
];

function brandedQuadrantForCategory(categoryName: string): "tl" | "tr" | "bl" | "br" | null {
  const s = categoryName.trim();
  if (!s) return null;
  for (const { test, quadrant } of BRANDED_QUADRANT_RULES) {
    if (test.test(s)) return quadrant;
  }
  return null;
}

export function industryStockImageForCategory(categoryName: string): string {
  const s = categoryName.trim();
  if (!s) return DEFAULT_CATALOG_URL;
  for (const { test, url } of INDUSTRY_RULES) {
    if (test.test(s)) return url;
  }
  return DEFAULT_CATALOG_URL;
}

export function resolveCatalogVisual(
  cover_image_url: string | null | undefined,
  categoryName: string,
): CatalogVisual {
  const fromAdmin = storefrontCatalogImageSrc(cover_image_url);
  if (fromAdmin) return { type: "full", src: fromAdmin };
  const quadrant = brandedQuadrantForCategory(categoryName);
  if (quadrant) {
    return { type: "grid-quadrant", src: BRANDED_CATALOGUE_GRID_PATH, quadrant };
  }
  return { type: "full", src: industryStockImageForCategory(categoryName) };
}

/** Hero: admin cover, else catering quadrant of branded grid, else Unsplash. */
export function heroDisplayVisual(
  firstCatalogueCoverUrl: string | null | undefined,
): CatalogVisual {
  const fromAdmin = storefrontCatalogImageSrc(firstCatalogueCoverUrl);
  if (fromAdmin) return { type: "full", src: fromAdmin };
  return {
    type: "grid-quadrant",
    src: BRANDED_CATALOGUE_GRID_PATH,
    quadrant: "bl",
  };
}

/** @deprecated Use resolveCatalogVisual + CatalogueCoverImage for quadrant assets. */
export function catalogCoverDisplaySrc(
  cover_image_url: string | null | undefined,
  categoryName: string,
): string {
  const v = resolveCatalogVisual(cover_image_url, categoryName);
  return v.src;
}

/** @deprecated Use heroDisplayVisual + CatalogueCoverImage. */
export function heroDisplaySrc(firstCatalogueCoverUrl: string | null | undefined): string {
  const v = heroDisplayVisual(firstCatalogueCoverUrl);
  return v.src;
}
