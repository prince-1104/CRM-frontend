"use client";

type MobileCategoryNavProps = {
  items: string[];
  activeCategory: string;
  onSelect: (name: string) => void;
};

export default function MobileCategoryNav({
  items,
  activeCategory,
  onSelect,
}: MobileCategoryNavProps) {
  return (
    <div className="fixed left-0 right-0 top-[calc(3.75rem+env(safe-area-inset-top,0px))] z-40 border-b border-white/5 bg-surface/90 backdrop-blur-xl md:hidden">
      <div className="mobile-nav-scroll flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((name) => {
          const active =
            activeCategory !== "All" &&
            name.toLowerCase() === activeCategory.toLowerCase();
          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelect(name)}
              className={
                active
                  ? "mobile-nav-pill mobile-nav-pill-active shrink-0 touch-manipulation"
                  : "mobile-nav-pill shrink-0 touch-manipulation"
              }
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
