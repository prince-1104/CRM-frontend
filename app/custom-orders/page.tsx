import Link from "next/link";
import CustomOrderForm from "../components/CustomOrderForm";
import SiteLogo from "../components/SiteLogo";
import { fetchLandingData } from "../../lib/fetchLandingData";

export const metadata = {
  title: "Custom Orders | Star Uniform",
  description:
    "Outfit your entire team with custom uniform programs. Submit your requirements and our experts will quote fast.",
  alternates: { canonical: "/custom-orders" },
};

export default async function CustomOrdersPage() {
  const { storefront } = await fetchLandingData();
  const brandName = storefront.business_name?.trim() || "Star Uniform";

  return (
    <div className="premium-shell min-h-dvh">
      <nav className="premium-nav-bar flex w-full items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <SiteLogo />
          <span className="font-headline text-lg font-bold text-on-surface">{brandName}</span>
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-primary/30 px-4 py-2 font-label text-xs uppercase tracking-widest text-primary"
        >
          Contact
        </Link>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/"
          className="mb-4 inline-block font-label text-xs uppercase tracking-widest text-primary hover:underline"
        >
          ← Back to home
        </Link>
        <h1 className="font-headline text-3xl font-bold text-on-surface sm:text-4xl">
          Bulk &amp; custom orders
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant sm:text-base">
          Outfit your entire team — tell us your styles, quantities, and branding needs. Orders
          appear in our admin panel and our uniform experts will follow up.
        </p>
        <div className="mt-8">
          <CustomOrderForm storefront={storefront} />
        </div>
      </main>
    </div>
  );
}
