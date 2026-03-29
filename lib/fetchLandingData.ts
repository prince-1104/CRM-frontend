import type { LandingCatalogueCard } from "./landingTypes";

export type LandingProductItem = {
  id?: number;
  sku: string;
  name: string;
  category?: string | null;
  image_url?: string | null;
  active?: boolean;
};

export type LandingStorefrontInfo = {
  business_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
};

const emptyStorefront: LandingStorefrontInfo = {
  business_name: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
};

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(String(res.status));
  return (await res.json()) as T;
}

export type LandingData = {
  catalogueCards: LandingCatalogueCard[];
  catalogCategories: string[];
  storefront: LandingStorefrontInfo;
  products: LandingProductItem[];
};

/**
 * Loads public landing data in parallel on the server so the first paint has
 * catalogue covers, nav categories, and storefront — avoids client-only waterfall.
 */
export async function fetchLandingData(): Promise<LandingData> {
  const base = apiBase();
  const [catalogues, categories, storefront, products] = await Promise.all([
    fetchJson<unknown>(`${base}/api/public/catalog/catalogues`).catch(() => []),
    fetchJson<unknown>(`${base}/api/public/catalog-categories`).catch(() => []),
    fetchJson<Partial<LandingStorefrontInfo>>(`${base}/api/public/storefront`).catch(
      () => emptyStorefront,
    ),
    fetchJson<unknown>(`${base}/api/public/products`).catch(() => []),
  ]);

  const catalogueCards = Array.isArray(catalogues)
    ? (catalogues as LandingCatalogueCard[])
    : [];
  const catalogCategories = Array.isArray(categories)
    ? (categories as string[]).filter((c) => typeof c === "string")
    : [];
  const productList = Array.isArray(products) ? (products as LandingProductItem[]) : [];

  const sf: LandingStorefrontInfo = {
    business_name: String(storefront.business_name ?? ""),
    phone: String(storefront.phone ?? ""),
    whatsapp: String(storefront.whatsapp ?? ""),
    email: String(storefront.email ?? ""),
    address: String(storefront.address ?? ""),
  };

  return {
    catalogueCards,
    catalogCategories,
    storefront: sf,
    products: productList,
  };
}
