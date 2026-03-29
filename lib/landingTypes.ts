/** Public catalogue card shape from `/api/public/catalog/catalogues`. */
export type LandingCatalogueCard = {
  id: number | null;
  name: string;
  sku_prefix: string;
  cover_image_url: string | null;
  badge_label: string | null;
  cta_label: string | null;
  sort_order: number;
  product_count: number;
  preview_product_names: string[];
};
