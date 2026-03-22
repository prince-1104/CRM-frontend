"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/** Auto-popup does not open if user has scrolled past this many pixels from the top */
const SCROLL_THRESHOLD_PX = 400;

const STORAGE_KEY = "popupDismissed";

type PopupFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onRequestOpen: () => void;
};

function validateName(value: string): string | null {
  const t = value.trim();
  if (t.length === 0) return "Full name is required";
  if (t.length < 2) return "Name must be at least 2 characters";
  if (t.length > 100) return "Name must be at most 100 characters";
  return null;
}

function validatePhone(value: string): string | null {
  const v = value.trim();
  if (v.length === 0) return "Phone number is required";
  if (/^\d{10}$/.test(v)) return null;
  if (/^\+91-\d{10}$/.test(v)) return null;
  return "Invalid phone format (use +91-XXXXXXXXXX or 10 digits)";
}

function isFormValid(name: string, phone: string): boolean {
  return validateName(name) === null && validatePhone(phone) === null;
}

export default function PopupForm({ isOpen, onClose, onRequestOpen }: PopupFormProps) {
  const nameId = useId();
  const phoneId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [entered, setEntered] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollPastRef = useRef(false);

  const dismissAndRemember = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window !== "undefined" && window.scrollY > SCROLL_THRESHOLD_PX) {
        scrollPastRef.current = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const delayMs = 15000 + Math.random() * 5000;
    const id = window.setTimeout(() => {
      try {
        if (localStorage.getItem(STORAGE_KEY) === "true") return;
      } catch {
        /* ignore */
      }
      if (typeof window !== "undefined") {
        if (window.scrollY > SCROLL_THRESHOLD_PX || scrollPastRef.current) return;
      }
      onRequestOpen();
    }, delayMs);
    return () => window.clearTimeout(id);
  }, [onRequestOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSuccess(false);
      setSubmitError(null);
      setNameTouched(false);
      setPhoneTouched(false);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleNameChange = (value: string) => {
    setNameTouched(true);
    setName(value);
    setNameError(validateName(value));
    setSubmitError(null);
  };

  const handlePhoneChange = (value: string) => {
    setPhoneTouched(true);
    setPhone(value);
    setPhoneError(validatePhone(value));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    setPhoneTouched(true);
    const ne = validateName(name);
    const pe = validatePhone(phone);
    setNameError(ne);
    setPhoneError(pe);
    if (ne || pe) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      let data: { success?: boolean; error?: string } = {};
      try {
        data = (await response.json()) as { success?: boolean; error?: string };
      } catch {
        data = {};
      }
      if (!response.ok || !data.success) {
        const msg = data.error ?? "Something went wrong. Please try again.";
        if (response.status === 503) {
          setSubmitError(msg.includes("Network") ? msg : "Network error. Please try again.");
        } else {
          setSubmitError(msg);
        }
        return;
      }
      setSuccess(true);
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        /* ignore */
      }
      setName("");
      setPhone("");
      setNameError(null);
      setPhoneError(null);
      closeTimerRef.current = setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const showNameErr = nameTouched && nameError !== null;
  const showPhoneErr = phoneTouched && phoneError !== null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 transition-opacity duration-300 ease-out max-[479px]:items-stretch max-[479px]:p-0 sm:items-center sm:p-4 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismissAndRemember();
      }}
    >
      <div
        className={`flex max-h-[100dvh] w-full max-w-[450px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl transition-all duration-[400ms] ease-out max-[479px]:mx-auto max-[479px]:h-full max-[479px]:max-h-none max-[479px]:min-h-0 max-[479px]:max-w-none max-[479px]:flex-1 max-[479px]:rounded-none sm:max-h-[min(90dvh,800px)] sm:rounded-2xl ${
          entered
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 sm:translate-y-8"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-form-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex shrink-0 items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-4 text-center sm:py-5">
          <h2 id="popup-form-title" className="text-lg font-semibold text-white sm:text-xl">
            Get Your Free Quote
          </h2>
          <button
            type="button"
            onClick={dismissAndRemember}
            className="absolute right-3 top-1/2 flex h-12 min-h-[48px] w-12 min-w-[48px] -translate-y-1/2 items-center justify-center rounded-lg text-2xl leading-none text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
            <p className="text-lg font-medium text-slate-800">
              Quote request received! We&apos;ll call you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="space-y-4 p-6">
              <div>
                <label htmlFor={nameId} className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  id={nameId}
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  maxLength={100}
                  className={`w-full min-h-[48px] rounded-lg border px-3 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                    showNameErr ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {showNameErr && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
              </div>
              <div>
                <label htmlFor={phoneId} className="mb-1 block text-sm font-medium text-slate-700">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <input
                    id={phoneId}
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+91-9876543210"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full min-h-[48px] rounded-lg border py-3 pl-12 pr-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      showPhoneErr ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                </div>
                {showPhoneErr && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
              </div>

              {submitError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {submitError}
                </p>
              )}
            </div>

            <div className="mt-auto space-y-3 border-t border-slate-100 p-6 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid(name, phone)}
                className="flex w-full min-h-[48px] items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  "Get Your Quote"
                )}
              </button>
              <button
                type="button"
                onClick={dismissAndRemember}
                className="w-full min-h-[48px] rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Maybe Later
              </button>
              <p className="text-center text-xs text-slate-500">
                We&apos;ll call you shortly to discuss your requirements
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
