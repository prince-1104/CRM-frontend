/**
 * Build direct public URLs for catalog media.
 * Frontend should read images from R2/CDN directly (no backend proxy hop).
 */
const DEFAULT_PUBLIC_MEDIA_BASE_URL = "https://pub-e2e706ed2ae544689d07df5df488ae62.r2.dev";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function publicMediaBaseUrl(): string {
  const envBase = process.env.NEXT_PUBLIC_CATALOG_MEDIA_BASE_URL?.trim();
  if (envBase) return normalizeBaseUrl(envBase);
  return DEFAULT_PUBLIC_MEDIA_BASE_URL;
}

export function catalogKeyFromImageUrl(imageUrl: string): string | null {
  try {
    const path = new URL(imageUrl).pathname;
    const m = path.match(/\/(catalog\/[^/]+)$/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export function storefrontCatalogImageSrc(
  imageUrl: string | null | undefined,
): string | null {
  if (!imageUrl?.trim()) return null;
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith("/")) {
    return `${publicMediaBaseUrl()}${trimmed}`;
  }

  const key = catalogKeyFromImageUrl(trimmed);
  if (!key) return trimmed;
  return `${publicMediaBaseUrl()}/${key}`;
}
