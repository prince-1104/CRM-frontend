"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AmbientScene from "./AmbientScene";
import MobileActionDock from "./MobileActionDock";
import PremiumProductCard from "./PremiumProductCard";
import ProductImageLightbox from "./ProductImageLightbox";
import PopupForm from "./PopupForm";
import type { LandingData, LandingProductItem } from "../../lib/fetchLandingData";
import { resolveCatalogVisual } from "../../lib/industryStockImages";
import {
  productMatchesCategory,
  UNIFORM_CATEGORY_ROUTES,
  type UniformRouteConfig,
} from "../../lib/uniformRoutes";
import { whatsAppUrlFromStorefront } from "../../lib/siteContact";

type UniformCategoryPageClientProps = LandingData & {
  config: UniformRouteConfig;
};

function normalizeProducts(data: LandingProductItem[]): LandingProductItem[] {
  const filtered = data.filter((p) => p.active !== false);
  return filtered;
}

export default function UniformCategoryPageClient({
  config,
  catalogueCards,
  products: productsFromServer,
  storefront,
}: UniformCategoryPageClientProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [imageLightbox, setImageLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  );

  const products = useMemo(
    () => normalizeProducts(productsFromServer),
    [productsFromServer],
  );

  const filteredProducts = useMemo(
    () => products.filter((p) => productMatchesCategory(p.category, config.category)),
    [products, config.category],
  );

  const heroVisual = useMemo(() => {
    const card = catalogueCards.find((c) =>
      productMatchesCategory(c.name, config.category),
    );
    return resolveCatalogVisual(card?.cover_image_url, config.category);
  }, [catalogueCards, config.category]);

  const waHref = whatsAppUrlFromStorefront(
    storefront,
    `Hi Star Uniform, I'm interested in ${config.title}.`,
  );
  const brandName = storefront.business_name?.trim() || "Star Uniform";

  return (
    <div className="premium-shell min-h-dvh">
      <nav className="premium-nav-bar fixed top-0 z-50 flex w-full items-center justify-between gap-2 px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] sm:px-6 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 ring-1 ring-primary/30">
            <span className="font-headline text-sm font-black text-primary">★</span>
          </div>
          <span className="truncate font-headline text-base font-bold tracking-tighter text-on-surface sm:text-xl">
            {brandName}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/custom-orders"
            className="hidden rounded-full border border-primary/30 px-3 py-1.5 font-label text-[10px] uppercase tracking-widest text-primary sm:inline"
          >
            Custom orders
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-header-btn flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"
            aria-label="WhatsApp"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </nav>

      <main className="relative pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(5rem+env(safe-area-inset-top,0px))] md:pb-8">
        <section className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14 md:px-8">
          <AmbientScene variant="hero" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2">
            <div>
              <Link
                href="/"
                className="mb-4 inline-block font-label text-xs uppercase tracking-widest text-primary hover:underline"
              >
                ← Back to home
              </Link>
              <h1 className="font-headline text-3xl font-bold leading-tight text-on-surface sm:text-4xl md:text-5xl">
                {config.headline}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
                {config.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowPopup(true)}
                  className="saas-cta-3d min-h-[48px] rounded-2xl px-8 py-3 text-sm font-bold uppercase tracking-widest text-on-primary sm:rounded-full"
                >
                  Get a quote
                </button>
                <Link
                  href="/custom-orders"
                  className="min-h-[48px] rounded-2xl border border-outline-variant/60 bg-surface-container/50 px-8 py-3 text-center text-sm font-bold uppercase tracking-widest text-on-surface sm:rounded-full"
                >
                  Custom order
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-outline-variant/30 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroVisual.src}
                alt={config.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-outline-variant/20 bg-surface-container-low px-3 py-10 sm:px-6 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-headline text-2xl font-bold text-on-surface md:text-3xl">
                  {config.title}
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {filteredProducts.length} style{filteredProducts.length === 1 ? "" : "s"} in
                  this collection
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.values(UNIFORM_CATEGORY_ROUTES).map((route) => (
                  <Link
                    key={route.slug}
                    href={`/${route.slug}`}
                    className={
                      route.slug === config.slug
                        ? "rounded-full bg-primary/20 px-3 py-1.5 font-label text-[10px] uppercase tracking-widest text-primary"
                        : "rounded-full border border-outline-variant/40 px-3 py-1.5 font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
                    }
                  >
                    {route.linkText.replace(" Uniforms", "")}
                  </Link>
                ))}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                {filteredProducts.map((product, index) => {
                  const imageLabel = product.category
                    ? `${product.category} — ${product.sku}`
                    : product.sku;
                  const visual = resolveCatalogVisual(
                    product.image_url,
                    product.category || product.sku,
                  );
                  return (
                    <PremiumProductCard
                      key={product.id ?? product.sku}
                      sku={product.sku}
                      category={product.category || config.category}
                      visual={visual}
                      imageLabel={imageLabel}
                      index={index}
                      onZoom={() =>
                        setImageLightbox({ src: visual.src, alt: imageLabel })
                      }
                      onQuote={() => setShowPopup(true)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-outline-variant/30 bg-surface/50 p-8 text-center">
                <p className="text-on-surface-variant">
                  New styles for this category are being added. Request a quote and our team will
                  share options.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPopup(true)}
                  className="saas-cta-3d mt-4 rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest text-on-primary"
                >
                  Request quote
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <MobileActionDock
        onQuote={() => setShowPopup(true)}
        waHref={waHref}
        telHref="tel:+918100674659"
      />
      <PopupForm isOpen={showPopup} onClose={() => setShowPopup(false)} />
      {imageLightbox ? (
        <ProductImageLightbox
          src={imageLightbox.src}
          alt={imageLightbox.alt}
          onClose={() => setImageLightbox(null)}
        />
      ) : null}
    </div>
  );
}
