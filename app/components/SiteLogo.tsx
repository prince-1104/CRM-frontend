type SiteLogoProps = {
  size?: "sm" | "md";
  className?: string;
};

const SIZE_CLASS = {
  sm: "h-9 w-9 md:h-10 md:w-10",
  md: "h-10 w-10 md:h-11 md:w-11",
} as const;

export default function SiteLogo({ size = "sm", className = "" }: SiteLogoProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-white/10 ${SIZE_CLASS[size]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/star-uniform-logo.png"
        alt="Star Uniform"
        className="h-full w-full object-contain p-0.5"
        width={40}
        height={40}
      />
    </div>
  );
}
