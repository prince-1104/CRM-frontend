"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type ProductImageLightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
};

export default function ProductImageLightbox({
  src,
  alt,
  onClose,
}: ProductImageLightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (typeof document === "undefined" || !document.body) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/88 p-3 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-10 flex h-12 min-h-[48px] w-12 min-w-[48px] items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Close"
      >
        ×
      </button>
      {/* Lightbox: native img so any catalog / proxy URL renders at natural resolution */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-[min(92dvh,1080px)] max-w-[min(96vw,1400px)] object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  );
}
