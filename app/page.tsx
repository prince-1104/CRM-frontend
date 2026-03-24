"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import PopupForm from "./components/PopupForm";

type ProductCatalogProps = {
  selectedRegion: string;
  onGetQuote: () => void;
};

const regions = [
  "All Regions",
  "Delhi",
  "Kolkata",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
];

type ProductItem = {
  id?: number;
  sku: string;
  name: string;
  category?: string | null;
  image_url?: string | null;
  active?: boolean;
};

const fallbackProducts: ProductItem[] = [
  { sku: "SU-CH-001", name: "Chef Coat Pro", category: "Chef", active: true },
  { sku: "SU-HT-002", name: "Hotel Frontdesk Set", category: "Hotel", active: true },
  { sku: "SU-RS-003", name: "Restaurant Service Set", category: "Restaurant", active: true },
];

function ProductCatalog({ selectedRegion, onGetQuote }: ProductCatalogProps) {
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState<ProductItem[]>(fallbackProducts);

  useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as ProductItem[];
        if (!Array.isArray(data) || data.length === 0) return;
        if (mounted) setProducts(data.filter((p) => p.active !== false));
      } catch {
        // Keep fallback catalog when backend is unavailable.
      }
    };
    void loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (category === "All") return products;
    return products.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase());
  }, [category, products]);

  return (
    <section className="mx-auto mt-16 max-w-6xl px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Catalog</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Region: {selectedRegion}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="All">All Categories</option>
            <option value="Chef">Chef</option>
            <option value="Hotel">Hotel</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Bar">Bar</option>
            <option value="Catering">Catering</option>
          </select>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <article key={product.sku} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <p className="mt-3 text-xs text-slate-500">{product.sku}</p>
            <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
            <p className="text-sm text-slate-600">{product.category || "General"}</p>
            <button
              type="button"
              onClick={onGetQuote}
              className="mt-4 w-full min-h-[48px] rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Get Your Quote
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [showPopup, setShowPopup] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative z-40 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="text-xl font-bold">Star Uniform</div>
        <nav className="hidden gap-6 text-sm md:flex">
          <a href="#catalog">Catalog</a>
          <a href="#benefits">Benefits</a>
          <a href="#contact">Contact</a>
        </nav>
        <button
          type="button"
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          WhatsApp
        </button>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold sm:text-5xl">Premium Uniforms for Your Business</h1>
        <p className="mt-3 text-lg text-slate-600">Chef • Hotel • Restaurant • Bar • Catering</p>
        <div className="mt-6 max-w-sm">
          <label htmlFor="region" className="mb-2 block text-sm font-medium">
            Region
          </label>
          <select
            id="region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            className="min-h-[48px] rounded-md bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Your Quote
          </button>
          <a href="#catalog" className="inline-flex min-h-[48px] items-center rounded-md border border-slate-300 px-5 py-3 font-medium">
            Browse Catalog
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-3xl font-bold">200+</p>
          <p className="text-sm text-slate-600">Customers</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-3xl font-bold">12+</p>
          <p className="text-sm text-slate-600">Years of Experience</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-3xl font-bold">30%</p>
          <p className="text-sm text-slate-600">Cost Savings</p>
        </div>
      </section>

      <div id="catalog">
        <ProductCatalog selectedRegion={selectedRegion} onGetQuote={() => setShowPopup(true)} />
      </div>

      <section id="benefits" className="mx-auto mt-16 grid max-w-6xl gap-4 px-6 sm:grid-cols-3">
        {["Premium Fabric", "Bulk Pricing", "Fast Delivery"].map((item) => (
          <div key={item} className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold">{item}</h3>
            <p className="mt-2 text-sm text-slate-600">Built for high-usage business environments.</p>
          </div>
        ))}
      </section>

      <section id="contact" className="mx-auto mt-16 grid max-w-6xl gap-4 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">Phone: +91-XXXXXXXXXX</div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">WhatsApp: +91-XXXXXXXXXX</div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">Email: sales@staruniform.com</div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">Address: Kolkata, India</div>
      </section>

      <PopupForm
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onRequestOpen={() => setShowPopup(true)}
      />
    </main>
  );
}
