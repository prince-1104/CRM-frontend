"use client";

import { useMemo, useState } from "react";
import LandingCatalogBento from "./components/LandingCatalogBento";
import PopupForm from "./components/PopupForm";
import CatalogueCoverImage from "./components/CatalogueCoverImage";
import type { LandingData, LandingProductItem } from "../lib/fetchLandingData";
import { heroDisplayVisual, resolveCatalogVisual } from "../lib/industryStockImages";

const fallbackProducts: LandingProductItem[] = [
  { sku: "SU-CH-001", name: "Chef Coat Pro", category: "Chef", active: true },
  { sku: "SU-HT-002", name: "Hotel Frontdesk Set", category: "Hotels", active: true },
  { sku: "SU-RS-003", name: "Restaurant Service Set", category: "Restaurants", active: true },
];

const DEFAULT_NAV = ["Chef", "Hotel", "Restaurant", "Catering"];

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
  const [catalogCategory, setCatalogCategory] = useState("All");

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
  const brandName =
    storefront.business_name?.trim() || "Star Uniform";
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
    <>
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 md:px-8 py-4 max-w-full bg-surface/60 backdrop-blur-lg z-50 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="text-xl md:text-2xl font-bold tracking-tighter text-on-surface font-headline">
          {brandName}
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
        <div className="flex items-center gap-2 shrink-0">
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-outline-variant px-3 py-2 font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              WhatsApp
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            className="bg-primary text-on-primary px-4 md:px-6 py-2 rounded-full font-label text-[0.75rem] uppercase tracking-widest font-bold scale-95 active:scale-90 transition-transform hover:shadow-[0_0_15px_rgba(161,250,255,0.4)]"
          >
            Get Your Quote
          </button>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative flex min-h-[min(921px,100dvh)] items-center overflow-hidden px-6 md:px-8">
          <div className="absolute inset-0 z-0 opacity-40">
            <CatalogueCoverImage
              visual={heroVisual}
              alt=""
              sizes="100vw"
              priority
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent" />
          </div>
          <div className="relative z-10 max-w-4xl">
            <span className="text-secondary font-label text-[0.75rem] uppercase tracking-[0.3em] mb-4 block drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">
              Crafting excellence since 2012
            </span>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-on-surface leading-[1.1] tracking-tight mb-6">
              Premium Uniforms <br />
              <span className="text-primary drop-shadow-[0_0_24px_rgba(0,0,0,0.75)]">
                for your business
              </span>
            </h1>
            <div className="flex flex-wrap gap-4 mb-10 font-label text-sm text-on-surface drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
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
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setShowPopup(true)}
                className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(161,250,255,0.5)]"
              >
                Get Your Quote
              </button>
              <button
                type="button"
                onClick={() => scrollToId("catalog")}
                className="border border-outline-variant text-on-surface px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-all hover:bg-surface-container-high hover:border-secondary"
              >
                Browse catalog
              </button>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 md:px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <span className="font-headline text-5xl sm:text-6xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                200+
              </span>
              <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
                Global customers
              </span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <span className="font-headline text-5xl sm:text-6xl font-bold text-secondary mb-2 group-hover:scale-110 transition-transform">
                12+
              </span>
              <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
                Years of experience
              </span>
            </div>
            <div className="flex flex-col items-center text-center group">
              <span className="font-headline text-5xl sm:text-6xl font-bold text-tertiary mb-2 group-hover:scale-110 transition-transform">
                30%
              </span>
              <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
                Cost savings delivered
              </span>
            </div>
          </div>
        </section>

        <section id="catalog" className="py-24 md:py-32 px-6 md:px-8 bg-surface scroll-mt-24">
          <div className="max-w-7xl mx-auto">
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
          className="py-20 px-6 md:px-8 bg-surface-container-low scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
                Product catalog
              </h2>
              <div className="flex items-center gap-3">
                <label htmlFor="cat-filter" className="sr-only">
                  Category
                </label>
                <select
                  id="cat-filter"
                  value={catalogCategory}
                  onChange={(e) => setCatalogCategory(e.target.value)}
                  className="rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {filterOptions.map((c) => (
                    <option key={c} value={c}>
                      {c === "All" ? "All categories" : c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const visual = resolveCatalogVisual(
                  product.image_url,
                  product.category || product.name,
                );
                return (
                  <article
                    key={product.id ?? product.sku}
                    className="rounded-xl glass-card border border-outline-variant/30 p-4 neon-glow-primary transition-all"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-container-highest">
                      <CatalogueCoverImage
                        visual={visual}
                        alt={product.name}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                    <p className="mt-3 text-xs text-on-surface-variant">{product.sku}</p>
                    <h3 className="text-lg font-semibold text-on-surface">{product.name}</h3>
                    <p className="text-sm text-on-surface-variant">
                      {product.category || "General"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowPopup(true)}
                      className="mt-4 w-full min-h-[48px] rounded-full bg-primary text-on-primary px-4 py-3 text-xs font-bold uppercase tracking-widest transition hover:shadow-[0_0_20px_rgba(161,250,255,0.35)]"
                    >
                      Get your quote
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="why" className="py-24 px-6 md:px-8 bg-surface border-t border-outline-variant/20">
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
                <div
                  key={item.title}
                  className="rounded-xl bg-surface-container p-6 border border-outline-variant/25 hover:border-primary/30 transition-colors"
                >
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

        <section className="py-24 px-6 md:px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12 text-center text-on-surface">
              What clients say
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <blockquote
                  key={t.quote.slice(0, 24)}
                  className="rounded-xl glass-card border border-outline-variant/30 p-8 flex flex-col"
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
          className="py-24 px-6 md:px-8 border-t border-outline-variant/10 scroll-mt-24"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-8 text-on-surface">
              Ready to elevate your <br />
              <span className="text-tertiary drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                brand identity?
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 text-left">
              {waLink ? (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border-l-4 border-primary block"
                >
                  <span className="material-symbols-outlined text-primary mb-3">chat</span>
                  <div className="font-bold text-on-surface">WhatsApp us</div>
                  <div className="text-on-surface-variant text-sm">
                    {storefront.whatsapp?.trim() || storefront.phone?.trim() || "Configure in Star Uniform"}
                  </div>
                </a>
              ) : (
                <div className="p-6 rounded-xl bg-surface-container border-l-4 border-primary text-left">
                  <span className="material-symbols-outlined text-primary mb-3">chat</span>
                  <div className="font-bold text-on-surface">WhatsApp us</div>
                  <div className="text-on-surface-variant text-sm">
                    Add WhatsApp or phone in Star Uniform settings
                  </div>
                </div>
              )}
              <div className="p-6 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border-l-4 border-secondary">
                <span className="material-symbols-outlined text-secondary mb-3">call</span>
                <div className="font-bold text-on-surface">Call direct</div>
                <div className="text-on-surface-variant text-sm">
                  {storefront.phone?.trim() || "—"}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border-l-4 border-tertiary sm:col-span-2 md:col-span-1">
                <span className="material-symbols-outlined text-tertiary mb-3">mail</span>
                <div className="font-bold text-on-surface">Email inquiry</div>
                <div className="text-on-surface-variant text-sm break-all">
                  {storefront.email?.trim() || "orders@staruniform.com"}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex items-center gap-4 text-on-surface text-sm italic text-left max-w-lg">
                <span className="material-symbols-outlined text-error shrink-0">location_on</span>
                <span>
                  Address:{" "}
                  {storefront.address?.trim() || "12, Park Street, Kolkata, India"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface py-12 px-6 md:px-8 border-t border-surface-container">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-lg font-black text-primary font-headline uppercase tracking-tighter">
            {brandName}
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-label text-sm font-light text-on-surface-variant">
            {waLink ? (
              <a href={waLink} className="hover:text-secondary transition-colors" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            ) : null}
            {storefront.phone ? (
              <a href={`tel:${storefront.phone.replace(/\s/g, "")}`} className="hover:text-secondary transition-colors">
                Phone
              </a>
            ) : null}
            {storefront.email ? (
              <a href={`mailto:${storefront.email}`} className="hover:text-secondary transition-colors">
                Email
              </a>
            ) : null}
            <a href="#contact" className="hover:text-secondary transition-colors">
              Address
            </a>
          </div>
          <div className="text-on-surface-variant font-label text-xs uppercase tracking-widest text-center md:text-right">
            © {new Date().getFullYear()} {brandName}. Premium professional attire.
          </div>
        </div>
      </footer>

      <PopupForm
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onRequestOpen={() => setShowPopup(true)}
      />
    </>
  );
}
