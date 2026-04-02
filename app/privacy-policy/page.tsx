import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Star Uniform",
  description:
    "How Star Uniform collects and uses contact information for inquiries and orders.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-dvh bg-surface">
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-outline-variant/10 bg-surface/75 px-4 py-3 backdrop-blur-lg shadow-[0_20px_40px_rgba(0,0,0,0.4)] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 md:px-8 md:py-4">
        <Link
          href="/"
          className="font-headline text-lg font-bold tracking-tighter text-on-surface transition-colors hover:text-primary sm:text-xl md:text-2xl"
        >
          Star Uniform
        </Link>
      </nav>

      <div className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6">
        <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
          Legal
        </p>
        <h1 className="mt-2 font-headline text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">
          Privacy policy
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Last updated April 2, 2026
        </p>

        <article className="glass-card mt-10 space-y-6 rounded-xl border border-outline-variant/40 p-6 sm:p-8">
          <p className="text-base leading-relaxed text-on-surface">
            We collect personal information such as name, phone number, and email to provide our
            services.
          </p>
          <p className="text-base leading-relaxed text-on-surface">
            This information is used to contact customers regarding their inquiries and orders.
          </p>
          <p className="text-base leading-relaxed text-on-surface">
            We do not sell or share your data with third parties.
          </p>
          <p className="text-base leading-relaxed text-on-surface">
            By submitting your details, you agree to be contacted by Star Uniform.
          </p>
        </article>

        <p className="mt-10 text-center text-sm text-on-surface-variant">
          <Link
            href="/"
            className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary-dim hover:decoration-primary-dim"
          >
            Back to Star Uniform
          </Link>
        </p>
      </div>
    </div>
  );
}
