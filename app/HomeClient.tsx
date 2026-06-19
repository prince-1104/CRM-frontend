"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import LandingCatalogBento from "./components/LandingCatalogBento";
import AmbientScene from "./components/AmbientScene";
import CategoryPills from "./components/CategoryPills";
import MobileActionDock from "./components/MobileActionDock";
import MobileCategoryNav from "./components/MobileCategoryNav";
import PremiumProductCard from "./components/PremiumProductCard";
import PopupForm, {
  LEAD_POPUP_DELAY_MS_FIRST,
  LEAD_POPUP_DELAY_MS_SECOND,
  markLeadPopupDismissedForSession,
  shouldSkipLeadAutoOpen,
} from "./components/PopupForm";
import CatalogueCoverImage from "./components/CatalogueCoverImage";
import ProductImageLightbox from "./components/ProductImageLightbox";
import type { LandingData, LandingProductItem } from "../lib/fetchLandingData";
import { heroDisplayVisual, resolveCatalogVisual } from "../lib/industryStockImages";

const fallbackProducts: LandingProductItem[] = [
  { sku: "SU-CH-001", name: "Chef Coat Pro", category: "Catering", active: true },
  { sku: "SU-HT-002", name: "Hotel Frontdesk Set", category: "Hotels", active: true },
  { sku: "SU-RS-003", name: "Restaurant Service Set", category: "Restaurants", active: true },
];

const DEFAULT_NAV = ["Hotel", "Restaurant", "Catering"];

/** Header & footer — India +91 8100674659 */
const HEADER_WHATSAPP_HREF = "https://wa.me/918100674659";
const CANONICAL_TEL_HREF = "tel:+918100674659";
const CANONICAL_WA_HREF = HEADER_WHATSAPP_HREF;
const CANONICAL_EMAIL = "staruniform118@gmail.com";
/** Opens default mail client (subject prefilled). */
const INQUIRY_MAILTO_HREF = `mailto:${CANONICAL_EMAIL}?subject=${encodeURIComponent("Star Uniform — inquiry")}`;
const CANONICAL_PHONE_LABEL = "+91 81006 74659";
/** Header tap-to-call display (same line as CANONICAL_TEL_HREF). */
const HEADER_PHONE_DISPLAY = "8100674659";
const CANONICAL_ADDRESS_TEXT = "131, CR Avenue near MG Road crossing";
const CANONICAL_ADDRESS_MAPS_HREF = "https://share.google/4XEdyrTRczKKkhl52";

const WHY_CHOOSE = [
  {
    title: "Fabric that survives service",
    body: "Reinforced seams, breathable blends, and finishes chosen for kitchens, floors, and events.",
    icon: "styler",
  },
  {
    title: "Bulk & bespoke programs",
    body: "From standardized kits to logo-ready programs — one partner for rollout and replenishment.",
    icon: "groups",
  },
  {
    title: "Faster turnaround",
    body: "Structured quoting and production tracking so your teams are outfitted on schedule.",
    icon: "schedule",
  },
  {
    title: "Transparent pricing",
    body: "Clear tiers and volume breaks — many clients see meaningful savings versus ad-hoc sourcing.",
    icon: "savings",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "Star Uniform nailed our hotel front-of-house look. Consistent fits across three properties and the quote process was painless.",
    author: "Operations Director",
    org: "Boutique hotel group",
  },
  {
    quote:
      "Chef coats and aprons still look sharp after months of heavy laundering. That is rare.",
    author: "Executive Chef",
    org: "Fine dining, Kolkata",
  },
  {
    quote:
      "We outfitted 80 catering staff in two weeks. Communication on sizing and delivery was excellent.",
    author: "Event lead",
    org: "Corporate catering",
  },
] as const;

function digitsForWhatsApp(value: string): string | null {
  const d = value.replace(/\D/g, "");
  return d.length >= 8 ? d : null;
}

function whatsappHref(whatsapp: string, phone: string): string | null {
  return (
    digitsForWhatsApp(whatsapp || "") ||
    digitsForWhatsApp(phone || "") ||
    null
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function normalizeProducts(data: LandingProductItem[]): LandingProductItem[] {
  const filtered = data.filter((p) => p.active !== false);
  return filtered.length > 0 ? filtered : fallbackProducts;
}

export default function HomeClient({
  catalogueCards,
  catalogCategories,
  storefront,
  products: productsFromServer,
}: LandingData) {
  const [showPopup, setShowPopup] = useState(false);
  const [imageLightbox, setImageLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  );
  const [catalogCategory, setCatalogCategory] = useState("All");

  useEffect(() => {
    const openIfAllowed = () => {
      if (shouldSkipLeadAutoOpen()) return;
      setShowPopup(true);
    };

    const id1 = window.setTimeout(openIfAllowed, LEAD_POPUP_DELAY_MS_FIRST);
    const id2 = window.setTimeout(openIfAllowed, LEAD_POPUP_DELAY_MS_SECOND);

    return () => {
      window.clearTimeout(id1);
      window.clearTimeout(id2);
    };
  }, []);

  const closeLeadPopup = useCallback(() => {
    markLeadPopupDismissedForSession();
    setShowPopup(false);
  }, []);

  const products = useMemo(
    () => normalizeProducts(productsFromServer),
    [productsFromServer],
  );

  const filterOptions = useMemo(() => {
    const extra = new Set<string>();
    for (const p of products) {
      if (p.category && !catalogCategories.includes(p.category)) {
        extra.add(p.category);
      }
    }
    const tail = Array.from(extra).sort((a, b) => a.localeCompare(b));
    return ["All", ...catalogCategories, ...tail];
  }, [catalogCategories, products]);

  const filteredProducts = useMemo(() => {
    if (catalogCategory === "All") return products;
    return products.filter(
      (p) => (p.category || "").toLowerCase() === catalogCategory.toLowerCase(),
    );
  }, [catalogCategory, products]);

  const navItems = catalogCategories.length > 0 ? catalogCategories : DEFAULT_NAV;
  const waDigits = whatsappHref(storefront.whatsapp, storefront.phone);
  const waLink = waDigits ? `https://wa.me/${waDigits}` : null;
  const primaryWaLink = waLink || CANONICAL_WA_HREF;
  const brandName =
    storefront.business_name?.trim() || "Star Uniform";
  const addressLine =
    storefront.address?.trim() || CANONICAL_ADDRESS_TEXT;
  const heroVisual = heroDisplayVisual(catalogueCards[0]?.cover_image_url ?? null);

  function selectNavCategory(name: string) {
    const lower = name.toLowerCase();
    const exact = filterOptions.find(
      (c) => c !== "All" && c.toLowerCase() === lower,
    );
    if (exact) {
      setCatalogCategory(exact);
      scrollToId("products");
      return;
    }
    const fuzzy = filterOptions.find(
      (c) =>
        c !== "All" &&
        (c.toLowerCase().includes(lower) || lower.includes(c.toLowerCase())),
    );
    if (fuzzy) {
      setCatalogCategory(fuzzy);
      scrollToId("products");
      return;
    }
    setCatalogCategory(name);
    scrollToId("products");
  }

  return (
    <div className="premium-shell min-h-dvh">
      <nav className="premium-nav-bar fixed top-0 z-50 flex w-full max-w-full items-center justify-between gap-2 px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] sm:px-6 md:px-8 md:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 ring-1 ring-primary/30 md:h-10 md:w-10">
            <span className="font-headline text-sm font-black text-primary md:text-base">★</span>
          </div>
          <div className="min-w-0 max-w-[min(9rem,38vw)] shrink font-headline text-base font-bold tracking-tighter text-on-surface sm:max-w-none sm:text-xl md:text-2xl">
            <span className="block truncate">{brandName}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 xl:gap-8">
          {navItems.map((name) => {
            const active =
              catalogCategory !== "All" &&
              name.toLowerCase() === catalogCategory.toLowerCase();
            return (
              <button
                key={name}
                type="button"
                onClick={() => selectNavCategory(name)}
                className={
                  active
                    ? "text-primary border-b-2 border-primary pb-1 font-label text-[0.75rem] uppercase tracking-widest transition-all duration-300"
                    : "text-on-surface/70 hover:text-on-surface font-label text-[0.75rem] uppercase tracking-widest hover:bg-surface-container-high transition-all duration-300 px-2 py-1 rounded"
                }
              >
                {name}
              </button>
            );
          })}
        </div>
        <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3">
          <a
            href={CANONICAL_TEL_HREF}
            className="header-phone-glow touch-manipulation inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1 rounded-full border border-fuchsia-400/40 bg-black/35 px-2 py-2 font-mono text-fuchsia-100 ring-1 ring-fuchsia-400/25 sm:gap-1.5 sm:px-3 sm:py-2.5"
            aria-label={`Call ${HEADER_PHONE_DISPLAY}`}
            title="Tap to call"
          >
            <span
              className="material-symbols-outlined shrink-0 text-[18px] leading-none text-fuchsia-200 sm:text-xl"
              aria-hidden
            >
              call
            </span>
            <span className="hidden whitespace-nowrap text-sm font-bold tabular-nums sm:inline md:text-base">
              {HEADER_PHONE_DISPLAY}
            </span>
          </a>
          <button
            type="button"
            onClick={() => scrollToId("site-footer")}
            className="contact-header-btn relative flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 touch-manipulation items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white shadow-[0_4px_20px_rgba(34,211,238,0.35)] ring-2 ring-cyan-200/40 transition-transform hover:scale-105 hover:shadow-[0_6px_28px_rgba(34,211,238,0.45)] active:scale-95 sm:h-12 sm:min-h-0 sm:w-12 md:h-14 md:w-14"
            aria-label="Contact us — call, WhatsApp, email"
            title="Contact us"
          >
            <span
              className="material-symbols-outlined text-[24px] leading-none drop-shadow-md sm:text-[26px] md:text-[30px]"
              aria-hidden
            >
              contact_mail
            </span>
          </button>
          <a
            href={HEADER_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-header-btn relative flex h-11 min-h-[44px] w-11 min-w-[44px] touch-manipulation items-center justify-center rounded-full bg-[#25D366] text-white ring-2 ring-white/25 transition-transform hover:scale-105 active:scale-95 sm:h-12 sm:min-h-0 sm:w-12 md:h-14 md:w-14"
            aria-label="Chat on WhatsApp"
            title="WhatsApp"
          >
            <svg
              className="h-6 w-6 drop-shadow-md sm:h-7 sm:w-7 md:h-8 md:w-8"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </nav>

      <MobileCategoryNav
        items={navItems}
        activeCategory={catalogCategory}
        onSelect={selectNavCategory}
      />

      <main className="relative pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(6.5rem+env(safe-area-inset-top,0px))] md:pb-0 md:pt-20">
        <section className="relative flex min-h-[min(720px,92dvh)] items-end overflow-hidden px-4 pb-10 sm:min-h-[min(821px,100dvh)] sm:items-center sm:px-6 md:px-8">
          <AmbientScene variant="hero" />
          <div className="absolute inset-0 z-0 opacity-50 md:opacity-40">
            <CatalogueCoverImage
              visual={heroVisual}
              alt=""
              sizes="100vw"
              priority
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/90 to-surface/40 md:bg-gradient-to-r md:from-surface md:via-surface/80 md:to-transparent" />
          </div>
          <div className="hero-glass-panel relative z-10 w-full max-w-4xl rounded-2xl p-5 sm:p-8 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
            <span className="saas-badge-shimmer mb-3 inline-block rounded-full border border-primary/25 px-2.5 py-1 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[10px] sm:tracking-[0.25em]">
              Hospitality · Events · Corporate
            </span>
            <span className="mb-2 block font-label text-[0.65rem] uppercase tracking-[0.2em] text-secondary sm:mb-4 sm:text-[0.75rem] sm:tracking-[0.3em]">
              Uniform programs for hospitality & events
            </span>
            <h1 className="hero-title-3d mb-4 font-headline text-[clamp(1.75rem,7vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-on-surface sm:mb-6 sm:text-4xl md:text-7xl lg:text-8xl">
              Premium Uniforms{" "}
              <span className="premium-section-title block sm:inline">
                for your business
              </span>
            </h1>
            <p className="mb-6 max-w-lg text-sm leading-relaxed text-on-surface-variant sm:mb-8 sm:text-base">
              Bespoke chef coats, hotel kits, and event staff apparel — sourced, branded, and
              delivered across India.
            </p>
            <div className="mb-6 hidden flex-wrap gap-x-4 gap-y-2 font-label text-sm text-on-surface sm:mb-10 md:flex">
              {navItems.map((label, i) => {
                const colors = [
                  "bg-primary",
                  "bg-secondary",
                  "bg-tertiary",
                  "bg-primary-fixed",
                  "bg-secondary-fixed",
                ];
                const dot = colors[i % colors.length];
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => selectNavCategory(label)}
                    className="flex min-h-[44px] touch-manipulation items-center gap-2 rounded-lg py-2 pr-1 transition-colors hover:text-primary active:bg-white/5 sm:min-h-0 sm:py-0"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={() => setShowPopup(true)}
                className="saas-cta-3d min-h-[52px] w-full touch-manipulation rounded-2xl px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-on-primary sm:w-auto sm:rounded-full sm:px-10 sm:py-4"
              >
                Get Your Quote
              </button>
              <button
                type="button"
                onClick={() => scrollToId("products")}
                className="min-h-[52px] w-full touch-manipulation rounded-2xl border border-outline-variant/60 bg-surface-container/50 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-on-surface backdrop-blur-sm transition-all hover:border-secondary hover:bg-surface-container-high active:scale-[0.98] sm:w-auto sm:rounded-full sm:px-10 sm:py-4"
              >
                View products
              </button>
            </div>
          </div>
        </section>

        <section className="relative bg-surface-container-low px-3 py-10 sm:px-6 sm:py-20 md:px-8 md:py-24">
          <AmbientScene variant="default" />
          <div className="relative mx-auto grid max-w-7xl grid-cols-3 gap-2 sm:gap-6 md:gap-8">
            <div className="saas-stat-3d flex flex-col items-center rounded-xl px-2 py-5 text-center sm:rounded-2xl sm:px-6 sm:py-10">
              <span className="font-headline text-2xl font-bold text-primary sm:text-5xl md:text-6xl">
                200+
              </span>
              <span className="mt-1 font-label text-[9px] uppercase leading-tight tracking-wider text-on-surface-variant sm:mt-2 sm:text-sm sm:tracking-widest">
                Global customers
              </span>
            </div>
            <div className="saas-stat-3d flex flex-col items-center rounded-xl px-2 py-5 text-center sm:rounded-2xl sm:px-6 sm:py-10">
              <span className="font-headline text-2xl font-bold text-secondary sm:text-5xl md:text-6xl">
                12+
              </span>
              <span className="mt-1 font-label text-[9px] uppercase leading-tight tracking-wider text-on-surface-variant sm:mt-2 sm:text-sm sm:tracking-widest">
                Years experience
              </span>
            </div>
            <div className="saas-stat-3d flex flex-col items-center rounded-xl px-2 py-5 text-center sm:rounded-2xl sm:px-6 sm:py-10">
              <span className="font-headline text-2xl font-bold text-tertiary sm:text-5xl md:text-6xl">
                30%
              </span>
              <span className="mt-1 font-label text-[9px] uppercase leading-tight tracking-wider text-on-surface-variant sm:mt-2 sm:text-sm sm:tracking-widest">
                Cost savings
              </span>
            </div>
          </div>
        </section>

        <section
          id="catalog"
          className="relative scroll-mt-[calc(7rem+env(safe-area-inset-top,0px))] bg-surface px-3 py-12 sm:px-6 sm:py-20 md:scroll-mt-[calc(5.25rem+env(safe-area-inset-top,0px))] md:px-8 md:py-32"
        >
          <AmbientScene variant="catalog" />
          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16">
              <div>
                <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4 text-on-surface">
                  Uniforms by industry
                </h2>
                <p className="text-on-surface-variant max-w-md">
                  Collections below mirror what you configure in Star Uniform — cover art, badges,
                  and featured products stay in sync with your catalogue.
                </p>
              </div>
              <div className="hidden md:block">
                <span className="text-primary font-bold tracking-widest text-xs uppercase">
                  Live from Star Uniform
                </span>
              </div>
            </div>
            <LandingCatalogBento
              cards={catalogueCards}
              onViewCollection={(name) => {
                selectNavCategory(name);
              }}
            />
          </div>
        </section>

        <section
          id="products"
          className="relative scroll-mt-[calc(7rem+env(safe-area-inset-top,0px))] overflow-hidden bg-surface-container-low px-3 py-10 sm:px-6 sm:py-20 md:scroll-mt-[calc(5.25rem+env(safe-area-inset-top,0px))] md:px-8"
        >
          <AmbientScene variant="catalog" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mb-5 space-y-4">
              <div>
                <span className="saas-badge-shimmer mb-2 inline-block rounded-full border border-primary/20 px-2.5 py-1 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[10px]">
                  Premium catalog
                </span>
                <h2 className="font-headline text-xl font-bold text-on-surface sm:text-2xl md:text-4xl">
                  <span className="premium-section-title">Product showcase</span>
                </h2>
                <p className="mt-1.5 max-w-lg text-xs text-on-surface-variant sm:mt-2 sm:text-sm">
                  Swipe categories · tap to zoom · quote in one tap.
                </p>
              </div>
              <CategoryPills
                options={filterOptions}
                value={catalogCategory}
                onChange={setCatalogCategory}
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:grid-cols-3 lg:gap-10">
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
                    category={product.category || "General"}
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
          </div>
        </section>

        <section
          id="why"
          className="border-t border-outline-variant/20 bg-surface px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4 text-center text-on-surface">
              Why choose{" "}
              <span className="text-secondary">Star Uniform</span>
              ?
            </h2>
            <p className="text-center text-on-surface-variant max-w-2xl mx-auto mb-14">
              Built for operators who need durability, consistency, and a partner who understands
              hospitality timelines.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {WHY_CHOOSE.map((item) => (
                <div key={item.title} className="feature-card-3d rounded-2xl p-6">
                  <span className="material-symbols-outlined text-3xl text-primary mb-3">
                    {item.icon}
                  </span>
                  <h3 className="font-headline text-lg font-bold text-on-surface">{item.title}</h3>
                  <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center text-on-surface">
              What clients say
            </h2>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pl-1 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:pl-0 [&::-webkit-scrollbar]:hidden">
              {TESTIMONIALS.map((t) => (
                <blockquote
                  key={t.quote.slice(0, 24)}
                  className="premium-testimonial-card flex flex-col rounded-2xl p-6 md:rounded-xl md:p-8 md:glass-card md:border md:border-outline-variant/30"
                >
                  <span className="text-4xl text-secondary/80 font-serif leading-none mb-4">
                    &ldquo;
                  </span>
                  <p className="text-on-surface text-sm leading-relaxed flex-1">{t.quote}</p>
                  <footer className="mt-6 pt-4 border-t border-outline-variant/30">
                    <p className="font-label text-xs uppercase tracking-widest text-primary">
                      {t.author}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">{t.org}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="scroll-mt-[calc(5.25rem+env(safe-area-inset-top,0px))] border-t border-outline-variant/10 px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-8 text-on-surface">
              Ready to elevate your <br />
              <span className="text-tertiary drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                brand identity?
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 text-left">
              <a
                href={primaryWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border-l-4 border-primary block"
              >
                <span className="material-symbols-outlined text-primary mb-3">chat</span>
                <div className="font-bold text-on-surface">WhatsApp us</div>
                <div className="text-on-surface-variant text-sm">
                  {storefront.whatsapp?.trim() || storefront.phone?.trim() || CANONICAL_PHONE_LABEL}
                </div>
              </a>
              <a
                href={CANONICAL_TEL_HREF}
                className="p-6 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border-l-4 border-secondary block"
              >
                <span className="material-symbols-outlined text-secondary mb-3">call</span>
                <div className="font-bold text-on-surface">Call direct</div>
                <div className="text-on-surface-variant text-sm">{CANONICAL_PHONE_LABEL}</div>
              </a>
              <a
                href={INQUIRY_MAILTO_HREF}
                className="group block cursor-pointer rounded-xl border-l-4 border-tertiary bg-surface-container p-6 transition-colors hover:bg-surface-container-high sm:col-span-2 lg:col-span-1"
                title={`Email ${CANONICAL_EMAIL}`}
              >
                <span className="material-symbols-outlined mb-3 text-tertiary">mail</span>
                <div className="font-bold text-on-surface">Email inquiry</div>
                <div className="break-all text-sm text-tertiary group-hover:underline group-hover:underline-offset-2">
                  {CANONICAL_EMAIL}
                </div>
              </a>
            </div>
            <div className="flex justify-center">
              <div className="flex items-center gap-4 text-on-surface text-sm text-left max-w-lg">
                <span className="material-symbols-outlined text-error shrink-0">location_on</span>
                <span className="italic">
                  Address:{" "}
                  <a
                    href={CANONICAL_ADDRESS_MAPS_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary underline underline-offset-2 transition-colors not-italic font-medium"
                  >
                    {addressLine}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="site-footer"
        className="scroll-mt-[calc(5.25rem+env(safe-area-inset-top,0px))] border-t border-surface-container bg-surface px-4 py-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12 md:px-8 md:pb-[max(2.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-lg font-black text-primary font-headline uppercase tracking-tighter">
            {brandName}
          </div>
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
            <a
              href="https://feedback.doptonin.online/u/Star_Uniform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container px-5 py-2.5 text-sm font-semibold text-on-surface transition-all hover:border-secondary hover:bg-surface-container-high hover:shadow-[0_0_16px_rgba(161,250,255,0.2)]"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">
                rate_review
              </span>
              Send Feedback
            </a>
            <div className="text-on-surface-variant font-label text-xs uppercase tracking-widest text-center md:text-right">
              © {new Date().getFullYear()} {brandName}. Premium professional attire.
            </div>
          </div>
        </div>
      </footer>

      {imageLightbox ? (
        <ProductImageLightbox
          src={imageLightbox.src}
          alt={imageLightbox.alt}
          onClose={() => setImageLightbox(null)}
        />
      ) : null}

      <MobileActionDock
        onQuote={() => setShowPopup(true)}
        waHref={primaryWaLink}
        telHref={CANONICAL_TEL_HREF}
      />

      <PopupForm isOpen={showPopup} onClose={closeLeadPopup} />
    </div>
  );
}
