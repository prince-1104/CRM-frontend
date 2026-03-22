"use client";

import { useMemo, useState } from "react";

type ProductCatalogProps = {
  selectedRegion: string;
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

const products = [
  { sku: "SU-CH-001", title: "Chef Coat Pro", category: "Chef" },
  { sku: "SU-HT-002", title: "Hotel Frontdesk Set", category: "Hotel" },
  { sku: "SU-RS-003", title: "Restaurant Service Set", category: "Restaurant" },
  { sku: "SU-BR-004", title: "Bar Uniform Kit", category: "Bar" },
  { sku: "SU-CT-005", title: "Catering Team Combo", category: "Catering" },
];

function ProductCatalog({ selectedRegion }: ProductCatalogProps) {
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => {
    if (category === "All") return products;
    return products.filter((p) => p.category === category);
  }, [category]);

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
            <div className="aspect-video rounded-lg bg-slate-100" />
            <p className="mt-3 text-xs text-slate-500">{product.sku}</p>
            <h3 className="text-lg font-semibold text-slate-900">{product.title}</h3>
            <p className="text-sm text-slate-600">{product.category}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [thanksMessage, setThanksMessage] = useState<string | null>(null);

  const submitLead = async () => {
    setSubmitting(true);
    setThanksMessage(null);
    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !data.success) {
        setThanksMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setThanksMessage(
        "Thanks! Our team will be in touch shortly to discuss your requirements.",
      );
      setName("");
      setPhone("");
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="text-xl font-bold">Star Uniform</div>
        <nav className="hidden gap-6 text-sm md:flex">
          <a href="#catalog">Catalog</a>
          <a href="#benefits">Benefits</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white">
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
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-md bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Get Your Quote
          </button>
          <a href="#catalog" className="rounded-md border border-slate-300 px-5 py-3 font-medium">
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
        <ProductCatalog selectedRegion={selectedRegion} />
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

      {thanksMessage && (
        <div
          className={`fixed bottom-6 left-1/2 z-[60] max-w-lg -translate-x-1/2 rounded-lg border px-4 py-3 text-center text-sm shadow-lg ${
            thanksMessage.startsWith("Thanks")
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
        >
          {thanksMessage}
          <button
            type="button"
            onClick={() => setThanksMessage(null)}
            className="ml-3 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h2 className="text-xl font-semibold">Get Quote</h2>
            <div className="mt-4 space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
              <button
                disabled={isSubmitting}
                onClick={submitLead}
                className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60"
              >
                Submit Quote Request
              </button>
              <button onClick={() => setModalOpen(false)} className="w-full text-sm text-slate-500">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
