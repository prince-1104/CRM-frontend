import { redirect } from "next/navigation";
import { fetchLandingData } from "../../lib/fetchLandingData";
import { CONTACT_WA_MESSAGE, whatsAppUrlFromStorefront } from "../../lib/siteContact";

export const metadata = {
  title: "Contact | Star Uniform",
  description: "Contact Star Uniform on WhatsApp for fast pricing and uniform expert support.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { storefront } = await fetchLandingData();
  redirect(whatsAppUrlFromStorefront(storefront, CONTACT_WA_MESSAGE));
}
