/** Same-origin proxy: R2 public URLs often return 401; backend reads with API credentials. */
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
  const key = catalogKeyFromImageUrl(trimmed);
  if (!key) return trimmed;
  return `/api/catalog-media/${key.split("/").map(encodeURIComponent).join("/")}`;
}
