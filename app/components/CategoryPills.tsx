"use client";

type CategoryPillsProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function CategoryPills({
  options,
  value,
  onChange,
}: CategoryPillsProps) {
  return (
    <div className="category-pills-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((c) => {
        const active = c === value;
        const label = c === "All" ? "All" : c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={
              active
                ? "category-pill category-pill-active shrink-0 touch-manipulation"
                : "category-pill shrink-0 touch-manipulation"
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
