"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { LandingStorefrontInfo } from "../../lib/fetchLandingData";
import { whatsAppUrlFromStorefront } from "../../lib/siteContact";

type CustomOrderFormProps = {
  storefront: LandingStorefrontInfo;
};

type FormState = {
  name: string;
  phone: string;
  company: string;
  email: string;
  category: string;
  quantity: string;
  requirement: string;
};

const CATEGORY_OPTIONS = [
  "Catering",
  "Hotels",
  "Restaurants",
  "Bar",
  "Housekeeping",
  "Custom / Mixed",
] as const;

function validatePhone(value: string): string | null {
  const v = value.trim();
  if (!v) return "Phone number is required";
  if (/^\d{10}$/.test(v)) return null;
  if (/^\+91-\d{10}$/.test(v)) return null;
  return "Enter a valid 10-digit number";
}

export default function CustomOrderForm({ storefront }: CustomOrderFormProps) {
  const nameId = useId();
  const phoneId = useId();
  const companyId = useId();
  const emailId = useId();
  const categoryId = useId();
  const quantityId = useId();
  const requirementId = useId();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    company: "",
    email: "",
    category: "Catering",
    quantity: "",
    requirement: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = "Full name is required";
    }
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) nextErrors.phone = phoneErr;
    if (!form.requirement.trim()) {
      nextErrors.requirement = "Tell us what you need";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          company: form.company.trim() || undefined,
          email: form.email.trim() || undefined,
          category: form.category,
          quantity: form.quantity.trim() || undefined,
          requirement: form.requirement.trim(),
          source: "custom_order_form",
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const waHref = whatsAppUrlFromStorefront(
    storefront,
    "Hi Star Uniform, I submitted a custom uniform order on your website.",
  );

  if (success) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-surface-container/60 p-8 text-center">
        <h2 className="font-headline text-2xl font-bold text-on-surface">Order received</h2>
        <p className="mt-3 text-sm text-on-surface-variant">
          Our team will review your requirements and contact you shortly.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="saas-cta-3d rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest text-on-primary"
          >
            Chat on WhatsApp
          </a>
          <Link
            href="/"
            className="rounded-full border border-outline-variant/60 px-8 py-3 text-sm font-bold uppercase tracking-widest text-on-surface"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="rounded-2xl border border-outline-variant/30 bg-surface-container/40 p-5 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={nameId} className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
            Full name *
          </label>
          <input
            id={nameId}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="mt-1 w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface"
            autoComplete="name"
          />
          {errors.name ? <p className="mt-1 text-xs text-red-400">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor={phoneId} className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
            Phone *
          </label>
          <input
            id={phoneId}
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="mt-1 w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface"
            inputMode="tel"
            autoComplete="tel"
            placeholder="10-digit mobile"
          />
          {errors.phone ? <p className="mt-1 text-xs text-red-400">{errors.phone}</p> : null}
        </div>

        <div>
          <label htmlFor={companyId} className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
            Company / venue
          </label>
          <input
            id={companyId}
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
            className="mt-1 w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface"
            autoComplete="organization"
          />
        </div>

        <div>
          <label htmlFor={emailId} className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
            Email
          </label>
          <input
            id={emailId}
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="mt-1 w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor={categoryId} className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
            Uniform type
          </label>
          <select
            id={categoryId}
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="mt-1 w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={quantityId} className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
            Quantity (approx.)
          </label>
          <input
            id={quantityId}
            value={form.quantity}
            onChange={(e) => updateField("quantity", e.target.value)}
            className="mt-1 w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface"
            placeholder="e.g. 25 sets"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={requirementId} className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
            Order details *
          </label>
          <textarea
            id={requirementId}
            value={form.requirement}
            onChange={(e) => updateField("requirement", e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface"
            placeholder="Styles, sizes, branding, delivery timeline…"
          />
          {errors.requirement ? (
            <p className="mt-1 text-xs text-red-400">{errors.requirement}</p>
          ) : null}
        </div>
      </div>

      {submitError ? <p className="mt-4 text-sm text-red-400">{submitError}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="saas-cta-3d mt-6 w-full rounded-2xl px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-on-primary disabled:opacity-60 sm:w-auto sm:rounded-full"
      >
        {submitting ? "Submitting…" : "Submit custom order"}
      </button>
    </form>
  );
}
