"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultWizardData, WIZARD_STORAGE_KEY } from "@/app/register/_components/wizard-types";
import { MINIMUM_AGE } from "@/lib/site-config";

const genders = ["Woman", "Man"] as const;
const seekingOptions = ["Women", "Men", "Open to both"] as const;

export function HeroIntake() {
  const router = useRouter();
  const [gender, setGender] = useState<(typeof genders)[number] | "">("");
  const [seeking, setSeeking] = useState<(typeof seekingOptions)[number] | "">("");
  const [ageOk, setAgeOk] = useState(false);
  const ready = Boolean(gender && seeking && ageOk);

  function continueProfile() {
    if (!ready) return;
    let priorStep = 2;
    let priorData: Partial<typeof defaultWizardData> = {};
    try {
      const raw = localStorage.getItem(WIZARD_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { data?: Partial<typeof defaultWizardData>; step?: number };
        priorData = parsed.data ?? {};
        if (parsed.step && parsed.step >= 2) priorStep = parsed.step;
      }
    } catch {
      priorData = {};
    }
    const data = {
      ...defaultWizardData,
      ...priorData,
      gender,
      seekingGender: [seeking],
      eligibilityAcknowledged: true,
    };
    localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify({ data, step: priorStep }));
    router.push("/register");
  }

  return (
    <form
      className="mt-3"
      onSubmit={(event) => {
        event.preventDefault();
        continueProfile();
      }}
    >
      <fieldset>
        <legend className="mb-2 font-sans text-[15px] font-semibold text-plum">I am</legend>
        <div className="grid grid-cols-2 gap-2">
          {genders.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={gender === option}
              onClick={() => setGender(option)}
              className={`min-h-12 rounded-full border text-[15px] font-semibold ${
                gender === option
                  ? "border-life bg-life text-white"
                  : "border-border-medium bg-ivory text-plum"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <legend className="mb-2 font-sans text-[15px] font-semibold text-plum">Looking to meet</legend>
        <div className="grid grid-cols-3 gap-2">
          {seekingOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={seeking === option}
              onClick={() => setSeeking(option)}
              className={`min-h-12 rounded-full border px-2 text-[14px] font-semibold ${
                seeking === option
                  ? "border-life bg-life text-white"
                  : "border-border-medium bg-ivory text-plum"
              }`}
            >
              {option === "Open to both" ? "Both" : option}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-3 flex items-start gap-3">
        <input
          type="checkbox"
          checked={ageOk}
          onChange={(event) => setAgeOk(event.target.checked)}
          className="mt-1 h-5 w-5 accent-life"
        />
        <span className="text-[15px] leading-6 text-plum">I confirm I am aged {MINIMUM_AGE} or over.</span>
      </label>

      <button
        type="submit"
        disabled={!ready}
        className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-life px-8 text-[16px] font-semibold text-white disabled:opacity-40"
      >
        Create your free profile
      </button>
    </form>
  );
}
