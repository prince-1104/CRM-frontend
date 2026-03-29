/**
 * Normalizes NEXT_PUBLIC_API_URL so paths like `${base}/api/public/...` never
 * get a double slash when the env value ends with `/` (common on Vercel/Railway).
 */
export function getPublicApiBaseUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").trim();
  return raw.replace(/\/+$/, "");
}
