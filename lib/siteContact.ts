import type { LandingStorefrontInfo } from "./fetchLandingData";

export const CANONICAL_WA_NUMBER = "918100674659";
export const CANONICAL_WA_HREF = `https://wa.me/${CANONICAL_WA_NUMBER}`;
export const CANONICAL_TEL_HREF = "tel:+918100674659";
export const CANONICAL_EMAIL = "staruniform118@gmail.com";

function digitsForWhatsApp(value: string): string | null {
  const d = value.replace(/\D/g, "");
  return d.length >= 8 ? d : null;
}

export function whatsAppUrlFromStorefront(
  storefront: Pick<LandingStorefrontInfo, "whatsapp" | "phone">,
  message?: string,
): string {
  const digits =
    digitsForWhatsApp(storefront.whatsapp || "") ||
    digitsForWhatsApp(storefront.phone || "") ||
    CANONICAL_WA_NUMBER;
  const base = `https://wa.me/${digits}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export const CONTACT_WA_MESSAGE =
  "Hi Star Uniform, I would like to discuss uniforms for my team.";
