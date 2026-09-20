"use client";

import { useState, useEffect, useCallback } from "react";
import {
  defaultWizardData,
  WIZARD_STORAGE_KEY,
  TOTAL_STEPS,
} from "./wizard-types";
import type { WizardData } from "./wizard-types";

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

// ── Validation: can the user continue from this step? ────────────────────────

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function canContinueStep(step: number, d: WizardData): boolean {
  switch (step) {
    case 1:
      return true;
    case 2:
      return !!d.firstName.trim() && validateEmail(d.email);
    case 3:
      return !!d.dateOfBirth && !!d.gender && d.seekingGender.length > 0;
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
      return true; // essentials are optional
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

// ── Wizard shell ─────────────────────────────────────────────────────────────

export function Wizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(defaultWizardData);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  // ── Hydrate from localStorage ─────────────────────────────────────────────
  useEffect(() => {
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
    setMounted(true);
  }, []);

  // ── Persist to localStorage ───────────────────────────────────────────────
  const persist = useCallback((nextData: WizardData, nextStep: number) => {
    try {
      localStorage.setItem(
        WIZARD_STORAGE_KEY,
        JSON.stringify({ data: nextData, step: nextStep })
      );
    } catch {
      // ignore
    }
  }, []);

  const update = useCallback(
    (partial: Partial<WizardData>) => {
      setData((prev) => {
        const next = { ...prev, ...partial };
        persist(next, step);
        return next;
      });
    },
    [persist, step]
  );

  // ── Navigation ────────────────────────────────────────────────────────────
  const goNext = useCallback(async () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => {
        const next = s + 1;
        persist(data, next);
        return next;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Final submission
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch("/api/founding-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          localStorage.removeItem(WIZARD_STORAGE_KEY);
          window.location.href = "/register/confirm";
        } else {
          const json = (await res.json()) as { error?: string };
          setSubmitError(
            json.error ?? "Something went wrong. Please try again."
          );
        }
      } catch {
        setSubmitError("Network error. Please check your connection and try again.");
      } finally {
        setSubmitting(false);
      }
    }
  }, [step, data, persist]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => {
        const prev = s - 1;
        persist(data, prev);
        return prev;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, data, persist]);

  const canContinue = canContinueStep(step, data);
  const isLastStep = step === TOTAL_STEPS;
  const progress = (step / TOTAL_STEPS) * 100;

  const StepComponent = StepComponents[step - 1];

  // Don't flash default state before hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-ivory" aria-hidden>
        <div className="h-1 bg-ivory-dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* ── Progress bar ───────────────────────────────────────────────── */}
      <div className="h-1 bg-ivory-dark flex-shrink-0" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
        <div
          className="h-full bg-oxblood transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-border flex-shrink-0">
        <a href="/" className="font-serif text-plum text-lg tracking-tight">
          Christian Chapter
        </a>
        <div className="flex items-center gap-3 text-[12px] text-stone font-sans">
          <span className="uppercase tracking-[0.18em]">
            Step {step} of {TOTAL_STEPS}
          </span>
          <span className="hidden sm:inline text-border">·</span>
          <span className="hidden sm:inline text-plum-muted">
            {stepTitles[step - 1]}
          </span>
        </div>
      </header>

      {/* ── Step content ───────────────────────────────────────────────── */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-10 md:py-14">
        <div
          key={step}
          className="animate-[fadeSlideUp_0.35s_ease-out_both]"
          style={{
            // simple CSS animation fallback if framer-motion not used
          }}
        >
          <StepComponent
            data={data}
            update={update}
            onNext={goNext}
            onBack={goBack}
            step={step}
          />
        </div>
      </main>

      {/* ── Sticky navigation bar ──────────────────────────────────────── */}
      <nav className="sticky bottom-0 z-10 bg-ivory/95 backdrop-blur border-t border-border px-6 md:px-10 py-4 flex items-center justify-between gap-4 flex-shrink-0">
        <button
          onClick={goBack}
          disabled={step === 1}
          className="inline-flex items-center gap-1.5 min-h-[48px] px-5 text-[15px] text-plum-muted border border-border rounded-md hover:bg-ivory-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-sans"
        >
          ← Back
        </button>

        <div className="flex-1 flex justify-end">
          {submitError && (
            <p className="text-[13px] text-oxblood mr-4 self-center max-w-[260px] text-right">
              {submitError}
            </p>
          )}
          <button
            onClick={goNext}
            disabled={!canContinue || submitting}
            className="inline-flex items-center gap-2 min-h-[52px] px-7 text-[15px] font-sans font-medium bg-oxblood text-ivory rounded-md hover:bg-oxblood-hover transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Submitting…"
              : isLastStep
              ? "Complete my profile"
              : "Continue →"}
          </button>
        </div>
      </nav>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
