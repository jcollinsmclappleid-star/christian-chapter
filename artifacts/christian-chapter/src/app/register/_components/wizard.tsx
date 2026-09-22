"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  defaultWizardData,
  FLOW_VERSION,
  WIZARD_STORAGE_KEY,
  TOTAL_STEPS,
} from "./wizard-types";
import type { WizardData } from "./wizard-types";
import { getAge } from "@/lib/age";
import { MINIMUM_AGE } from "@/lib/site-config";

import { Logo } from "@/components/brand/logo";
import { buildSteps } from "./intake/build-steps";
import { MiniProfile } from "./intake/mini-profile";
import { ReviewScreen } from "./review-screen";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function canContinueStep(step: number, d: WizardData): boolean {
  switch (step) {
    case 1:
      return d.eligibilityAcknowledged && !!d.gender && d.seekingGender.length > 0;
    case 2: {
      const age = getAge(d.dateOfBirth);
      return !!d.dateOfBirth && age !== null && age >= MINIMUM_AGE;
    }
    case 3:
      return !!d.ukRegion;
    case 4:
      return d.religiousDataConsent && !!d.tradition && !!d.churchAttendance && !!d.faithCentrality;
    case 5:
      return true;
    case 6:
      return true;
    case 7:
      return !!d.storyPrompt1.trim();
    case 8:
      return d.profileReady && !!d.firstName.trim() && validateEmail(d.email);
    default:
      return false;
  }
}

const stepTitles = [
  "Who you are",
  "Your age",
  "Your place",
  "Your faith",
  "Your week",
  "A photograph",
  "A short line",
  "Your profile",
];

const StepComponents = buildSteps;

export function Wizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(defaultWizardData);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checkEmail, setCheckEmail] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/register/draft");
        if (res.ok) {
          const json = await res.json();
          if (cancelled) return;
          setAuthenticated(true);
          setVerified(Boolean(json.verified));
          if (json.data) {
            setData((prev) => ({ ...prev, ...json.data, email: json.user?.email ?? json.data.email }));
            if (json.step) setStep(json.step);
          } else if (json.user?.email) {
            setData((prev) => ({ ...prev, email: json.user.email }));
          }
          localStorage.removeItem(WIZARD_STORAGE_KEY);
          setMounted(true);
          return;
        }
      } catch {
        // fall through to local draft
      }
      try {
        const raw = localStorage.getItem(WIZARD_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { version?: number; data?: Partial<WizardData>; step?: number };
          if (parsed.data) setData((prev) => ({ ...prev, ...parsed.data, flowVersion: FLOW_VERSION }));
          if (parsed.version === FLOW_VERSION && parsed.step && parsed.step >= 1 && parsed.step <= TOTAL_STEPS) {
            setStep(parsed.step);
          }
        }
      } catch {
        // ignore
      }
      if (!cancelled) setMounted(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistLocal = useCallback((nextData: WizardData, nextStep: number) => {
    if (authenticated) return;
    try {
      localStorage.setItem(
        WIZARD_STORAGE_KEY,
        JSON.stringify({ version: FLOW_VERSION, data: nextData, step: nextStep }),
      );
    } catch {
      // ignore
    }
  }, [authenticated]);

  const persistServer = useCallback((nextData: WizardData, nextStep: number) => {
    if (!authenticated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void fetch("/api/register/draft", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: nextData, step: nextStep }),
      });
    }, 400);
  }, [authenticated]);

  const update = useCallback(
    (partial: Partial<WizardData>) => {
      setData((prev) => {
        const next = { ...prev, ...partial };
        persistLocal(next, step);
        persistServer(next, step);
        return next;
      });
    },
    [persistLocal, persistServer, step],
  );

  const goNext = useCallback(async () => {
    if (step === TOTAL_STEPS && !authenticated) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch("/api/auth/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: data.firstName,
            email: data.email,
            marketingConsent: data.marketingConsent,
            step: TOTAL_STEPS,
            data,
          }),
        });
        const json = (await res.json()) as { error?: string; message?: string; devLink?: string };
        if (!res.ok) {
          setSubmitError(json.error ?? "Could not send the confirmation email.");
          return;
        }
        setCheckEmail(data.email);
        setDevLink(json.devLink ?? null);
        persistLocal(data, TOTAL_STEPS);
      } catch {
        setSubmitError("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep((s) => {
        const next = s + 1;
        persistLocal(data, next);
        persistServer(data, next);
        return next;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setReviewing(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, data, authenticated, persistLocal, persistServer]);

  const handleSubmit = useCallback(async () => {
    if (!verified) {
      setSubmitError("Please confirm your email before submitting.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/register/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        localStorage.removeItem(WIZARD_STORAGE_KEY);
        window.location.href = "/register/confirm";
      } else {
        const json = (await res.json()) as { error?: string };
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }, [data, verified]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setStep((s) => {
        const prev = s - 1;
        persistLocal(data, prev);
        persistServer(data, prev);
        return prev;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, data, persistLocal, persistServer]);

  const canContinue = canContinueStep(step, data);
  const isLastStep = step === TOTAL_STEPS;
  const progress = (step / TOTAL_STEPS) * 100;
  const StepComponent = StepComponents[step - 1];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-ivory" aria-hidden>
        <div className="h-1 bg-ivory-dark" />
      </div>
    );
  }

  if (checkEmail) {
    return (
      <div className="intake flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-ivory-darker px-6">
          <Logo />
        </header>
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
          <p className="mb-4 font-sans text-[11px] uppercase tracking-[0.3em] text-life">
            Confirm your email
          </p>
          <h1 className="mb-5 font-sans text-4xl font-bold tracking-[-0.03em] text-plum">Check your inbox</h1>
          <p className="text-[17px] text-plum-muted leading-7 mb-6">
            We have sent a one-time link to <strong className="text-plum">{checkEmail}</strong>.
            Confirm that address before your founding application can become active.
            You are not a founding member yet.
          </p>
          {devLink && (
            <p className="text-[14px] text-stone mb-6">
              Development only —{" "}
              <a href={devLink} className="underline text-plum">open the magic link</a>
            </p>
          )}
          <a href="/sign-in" className="underline text-life text-[15px]">
            Didn&apos;t get it? Request another link
          </a>
        </main>
      </div>
    );
  }

  const showNav = !reviewing && (step < TOTAL_STEPS || data.profileReady);

  return (
    <div className="intake flex min-h-screen flex-col">
      <div className="h-1 flex-shrink-0 bg-ivory-darker" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
        <div className="h-full bg-life transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-ivory-darker px-6 md:px-10">
        <div className="flex flex-col">
          <Logo />
          <span className="mt-1 pl-11 font-sans text-[10px] uppercase tracking-[0.16em] text-life">
            Your profile
          </span>
        </div>
        <div className="flex items-center gap-3 font-sans text-[12px] text-plum-muted">
          <span className="uppercase tracking-[0.18em]">
            {reviewing ? "Review your profile" : `Step ${step} of ${TOTAL_STEPS}`}
          </span>
          {!reviewing && <span className="hidden text-plum sm:inline">{stepTitles[step - 1]}</span>}
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-6 py-8 md:grid-cols-[minmax(0,1fr)_280px] md:py-12">
        {!reviewing && (
          <div className="md:col-start-2 md:row-start-1">
            <MiniProfile data={data} />
          </div>
        )}
        <div key={reviewing ? "review" : step} className="animate-[fadeSlideUp_0.35s_ease-out_both] md:col-start-1 md:row-start-1">
          {reviewing ? (
            <ReviewScreen
              data={data}
              onBack={() => {
                setReviewing(false);
                setSubmitError(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitError={submitError}
              onTermsChange={(accepted) => update({ termsAccepted: accepted })}
            />
          ) : (
            <StepComponent data={data} update={update} onNext={goNext} onBack={goBack} step={step} />
          )}
          {submitError && !reviewing && (
            <p className="mt-6 text-[14px] text-oxblood" role="alert">
              {submitError}
            </p>
          )}
        </div>
      </main>

      {showNav && (
        <nav className="sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t border-ivory-darker bg-ivory/95 px-6 py-4 md:px-10">
          <button
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex min-h-[48px] items-center rounded-full border border-ivory-darker px-5 text-[15px] text-plum-muted disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            onClick={goNext}
            disabled={!canContinue || submitting}
            className="inline-flex min-h-[52px] items-center rounded-full bg-life px-7 font-sans text-[15px] font-medium text-white disabled:opacity-50"
          >
            {submitting && step === TOTAL_STEPS && !authenticated
              ? "Sending link…"
              : isLastStep
                ? authenticated
                  ? "Review →"
                  : "Save my place"
                : step === 7
                  ? "This is enough →"
                  : "Continue →"}
          </button>
        </nav>
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
