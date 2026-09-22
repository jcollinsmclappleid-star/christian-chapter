"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  defaultWizardData,
  WIZARD_STORAGE_KEY,
  TOTAL_STEPS,
} from "./wizard-types";
import type { WizardData } from "./wizard-types";
import { getAge } from "@/lib/age";
import { MINIMUM_AGE } from "@/lib/site-config";

import { Logo } from "@/components/brand/logo";
import { Step1Welcome } from "./steps/step-1-welcome";
import { Step2Account } from "./steps/step-2-account";
import { Step3About } from "./steps/step-3-about";
import { Step4Location } from "./steps/step-4-location";
import { Step5Faith } from "./steps/step-5-faith";
import { Step6LifeNow } from "./steps/step-6-life-now";
import { Step7Intentions } from "./steps/step-7-intentions";
import { Step8WhoToMeet } from "./steps/step-8-who-to-meet";
import { Step9Essentials } from "./steps/step-9-essentials";
import { Step10Story } from "./steps/step-10-story";
import { ReviewScreen } from "./review-screen";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function canContinueStep(step: number, d: WizardData): boolean {
  switch (step) {
    case 1:
      return d.eligibilityAcknowledged;
    case 2:
      return !!d.firstName.trim() && validateEmail(d.email);
    case 3: {
      const age = getAge(d.dateOfBirth);
      return !!d.dateOfBirth && !!d.gender && d.seekingGender.length > 0 && age !== null && age >= MINIMUM_AGE;
    }
    case 4:
      return !!d.ukRegion;
    case 5:
      return (
        d.religiousDataConsent &&
        !!d.tradition &&
        !!d.churchAttendance &&
        !!d.faithCentrality
      );
    case 6:
      return !!d.workStatus && !!d.familySituation;
    case 7:
      return !!d.relationshipGoal;
    case 8:
      return d.ageRangeMin < d.ageRangeMax;
    case 9:
      return true;
    case 10:
      return !!(d.storyPrompt1.trim() || d.storyPrompt2.trim() || d.storyPrompt3.trim());
    default:
      return false;
  }
}

const stepTitles = [
  "Welcome",
  "Your account",
  "About you",
  "Your location",
  "Your faith",
  "Your life now",
  "Relationship intentions",
  "Who you hope to meet",
  "My Essentials",
  "Your story",
];

const StepComponents = [
  Step1Welcome,
  Step2Account,
  Step3About,
  Step4Location,
  Step5Faith,
  Step6LifeNow,
  Step7Intentions,
  Step8WhoToMeet,
  Step9Essentials,
  Step10Story,
];

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
          const parsed = JSON.parse(raw) as { data?: Partial<WizardData>; step?: number };
          if (parsed.data) setData((prev) => ({ ...prev, ...parsed.data }));
          if (parsed.step && parsed.step >= 1 && parsed.step <= TOTAL_STEPS) {
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
        JSON.stringify({ data: nextData, step: nextStep }),
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
    if (step === 2 && !authenticated) {
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
          }),
        });
        const json = (await res.json()) as { error?: string; message?: string; devLink?: string };
        if (!res.ok) {
          setSubmitError(json.error ?? "Could not send the confirmation email.");
          return;
        }
        setCheckEmail(data.email);
        setDevLink(json.devLink ?? null);
        persistLocal(data, 2);
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
      <div className="min-h-screen bg-ivory flex flex-col">
        <header className="flex items-center justify-between px-6 h-16 border-b border-border">
          <Logo />
        </header>
        <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-oxblood font-sans mb-4">
            Confirm your email
          </p>
          <h1 className="font-serif text-plum mb-5 text-4xl">Check your inbox</h1>
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
          <a href="/sign-in" className="underline text-oxblood text-[15px]">
            Didn&apos;t get it? Request another link
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <div className="h-1 bg-ivory-dark flex-shrink-0" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
        <div className="h-full bg-life transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <header className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-border flex-shrink-0">
        <div className="flex flex-col">
          <Logo />
          <span className="text-[10px] tracking-[0.16em] uppercase text-stone font-sans mt-1 pl-11">
            Your application
          </span>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-stone font-sans">
          <span className="uppercase tracking-[0.18em]">
            {reviewing ? "Review your profile" : `Step ${step} of ${TOTAL_STEPS}`}
          </span>
          {!reviewing && (
            <span className="hidden sm:inline text-plum-muted">{stepTitles[step - 1]}</span>
          )}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-10 md:py-14">
        <div key={reviewing ? "review" : step} className="animate-[fadeSlideUp_0.35s_ease-out_both]">
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
            <StepComponent
              data={data}
              update={update}
              onNext={goNext}
              onBack={goBack}
              step={step}
            />
          )}
        </div>
        {submitError && !reviewing && (
          <p className="mt-6 text-[14px] text-oxblood" role="alert">{submitError}</p>
        )}
      </main>

      {!reviewing && (
        <nav className="sticky bottom-0 z-10 bg-ivory/95 border-t border-border px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <button
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center min-h-[48px] px-5 text-[15px] text-plum-muted border border-border rounded-md disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            onClick={goNext}
            disabled={!canContinue || submitting}
            className="inline-flex items-center min-h-[52px] px-7 text-[15px] font-sans font-medium bg-life text-white rounded-full disabled:opacity-50"
          >
            {submitting && step === 2 && !authenticated
              ? "Sending link…"
              : isLastStep
                ? "Review →"
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
