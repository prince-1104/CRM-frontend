"use client";

import { useEffect, useState } from "react";

const SLIDE_MS = 5500;

type HeroBackgroundSlideshowProps = {
  images: string[];
};

export default function HeroBackgroundSlideshow({
  images,
}: HeroBackgroundSlideshowProps) {
  const slides = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {slides.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={`hero-slide absolute inset-0 ${i === index ? "hero-slide-active" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover object-center"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
          />
        </div>
      ))}

      {slides.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-[1] flex -translate-x-1/2 gap-1.5 sm:bottom-6 md:bottom-8">
          {slides.map((src, i) => (
            <button
              key={`dot-${src}-${i}`}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 bg-primary shadow-[0_0_10px_rgba(161,250,255,0.6)]"
                  : "w-1.5 bg-white/35 hover:bg-white/55"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
