"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CONCIERGE_PRICE_LABEL, OPENING_OFFER_ENDS_LABEL } from "@/lib/site-config";

const STORAGE_KEY = "mcd-concierge-offer-dismissed";

export function ConciergeOfferDialog() {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY) === "1") return;
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Dismiss offer"
        className="absolute inset-0 bg-plum/45"
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-2xl bg-paper p-6 shadow-card"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-life">
          Opening offer · until {OPENING_OFFER_ENDS_LABEL}
        </p>
        <h2 id={titleId} className="mt-2 font-sans text-[1.45rem] font-bold leading-tight tracking-tight text-plum">
          Concierge introductions, free until Valentine&apos;s Day.
        </h2>
        <p className="mt-3 text-[16px] leading-6 text-plum-muted">
          Mature Christian Dating is a Christian dating service. Matching technology goes live on {OPENING_OFFER_ENDS_LABEL}.
        </p>
        <p className="mt-3 text-[16px] leading-6 text-plum">
          Until then, founding members receive a personal concierge introduction — a matchmaker hand-picks who you meet — absolutely free. That service is {CONCIERGE_PRICE_LABEL}. You pay nothing for it before {OPENING_OFFER_ENDS_LABEL}.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <a
            href="/register"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-life px-6 text-[16px] font-semibold text-white"
            onClick={dismiss}
          >
            Create your free profile
          </a>
          <button
            ref={closeRef}
            type="button"
            className="min-h-11 text-[15px] font-semibold text-plum-muted underline underline-offset-4"
            onClick={dismiss}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
