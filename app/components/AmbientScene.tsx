"use client";

type AmbientSceneProps = {
  variant?: "hero" | "catalog" | "default";
  className?: string;
};

export default function AmbientScene({
  variant = "default",
  className = "",
}: AmbientSceneProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="mesh-grid-3d absolute inset-0 opacity-[0.35]" />
      {variant === "hero" ? (
        <>
          <div className="floating-orb absolute -left-24 top-1/4 h-72 w-72 bg-primary/20 blur-[100px]" />
          <div className="floating-orb floating-orb-delay absolute right-0 top-0 h-96 w-96 bg-secondary/15 blur-[120px]" />
          <div className="floating-orb floating-orb-delay-2 absolute bottom-0 left-1/3 h-64 w-64 bg-tertiary/10 blur-[90px]" />
        </>
      ) : null}
      {variant === "catalog" ? (
        <>
          <div className="floating-orb absolute -right-20 top-10 h-80 w-80 bg-primary/12 blur-[110px]" />
          <div className="floating-orb floating-orb-delay absolute -left-16 bottom-0 h-72 w-72 bg-secondary/10 blur-[100px]" />
        </>
      ) : null}
      {variant === "default" ? (
        <div className="floating-orb absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 bg-primary/8 blur-[100px]" />
      ) : null}
    </div>
  );
}
