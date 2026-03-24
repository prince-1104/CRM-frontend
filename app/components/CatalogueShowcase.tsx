"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type CatalogueShowcaseCard = {
  id: number | null;
  name: string;
  sku_prefix: string;
  cover_image_url: string | null;
  badge_label: string | null;
  cta_label: string | null;
  sort_order: number;
  product_count: number;
  preview_product_names: string[];
};

function catalogKeyFromImageUrl(imageUrl: string): string | null {
  try {
    const path = new URL(imageUrl).pathname;
    const m = path.match(/\/(catalog\/[^/]+)$/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

function storefrontCatalogCoverSrc(imageUrl: string | null | undefined): string | null {
  if (!imageUrl?.trim()) return null;
  const trimmed = imageUrl.trim();
  const key = catalogKeyFromImageUrl(trimmed);
  if (!key) return trimmed;
  return `/api/catalog-media/${key.split("/").map(encodeURIComponent).join("/")}`;
}

const badgeStyles = [
  "bg-violet-500/35 text-violet-100 ring-violet-400/30",
  "bg-emerald-500/35 text-emerald-100 ring-emerald-400/30",
  "bg-sky-500/35 text-sky-100 ring-sky-400/30",
];

const cardGradients = [
  "from-slate-900 via-slate-800 to-zinc-900",
  "from-zinc-900 via-slate-900 to-neutral-900",
  "from-neutral-900 via-zinc-900 to-slate-900",
];

type CatalogueShowcaseProps = {
  onViewCollection: (categoryName: string) => void;
};

export default function CatalogueShowcase({ onViewCollection }: CatalogueShowcaseProps) {
  const [cards, setCards] = useState<CatalogueShowcaseCard[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/catalog/catalogues", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as CatalogueShowcaseCard[];
        if (mounted && Array.isArray(data) && data.length > 0) {
          setCards(data);
        }
      } catch {
        /* keep empty */
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (cards.length === 0) return null;

  return (
    <section
      className="relative mx-auto mt-16 max-w-6xl overflow-hidden px-6 py-16"
      aria-label="Shop by collection"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.08),_transparent_50%)]" />
      <div className="relative z-10 mb-10 text-center">
        <p className="font-semibold uppercase tracking-[0.25em] text-cyan-400/90">
          Collections
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Uniforms by industry
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Browse curated ranges—each card mirrors what you configure in the admin catalogues.
        </p>
      </div>

      <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => {
          const cover = storefrontCatalogCoverSrc(c.cover_image_url);
          const badge =
            (c.badge_label && c.badge_label.trim()) ||
            `${c.name.toUpperCase().slice(0, 18)}`;
          const cta = (c.cta_label && c.cta_label.trim()) || "View collection";
          const previews =
            c.preview_product_names.length > 0
              ? c.preview_product_names
              : ["Add products", "in this catalogue", "to list highlights"];
          const grad = cardGradients[i % cardGradients.length];
          const badgeClass = badgeStyles[i % badgeStyles.length];

          return (
            <article
              key={`${c.name}-${i}`}
              className="group relative flex h-[min(420px,78vw)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:ring-cyan-400/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${grad}`} />
              {cover ? (
                <div className="absolute inset-0">
                  <Image
                    src={cover}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover brightness-[0.35] saturate-[0.65] transition duration-500 group-hover:brightness-[0.45]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.5))] opacity-90" />
              )}

              <div className="relative z-10 flex h-full flex-col p-6">
                <span
                  className={`inline-flex w-fit max-w-[90%] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ring-1 ${badgeClass}`}
                >
                  {badge}
                </span>

                <div className="mt-auto">
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white drop-shadow-md">
                    {c.name}
                  </h3>
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
                    {previews.slice(0, 3).map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                        <span className="leading-snug">{line}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => onViewCollection(c.name)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-black/55"
                  >
                    {cta}
                    <span aria-hidden className="text-lg leading-none">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
