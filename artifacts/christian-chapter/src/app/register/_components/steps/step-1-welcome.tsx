"use client";

import { MINIMUM_AGE } from "@/lib/site-config";
import { StepNote } from "../step-note";
import type { StepProps } from "../wizard-types";

const genders = ["Woman", "Man", "Non-binary", "Prefer not to say"] as const;
const seeking = ["Women", "Men", "Open to both"] as const;

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-12 rounded-full border px-4 text-[15px] font-semibold ${
        selected ? "border-life bg-life text-white" : "border-border-medium bg-ivory-dark text-plum"
      }`}
    >
      {label === "Open to both" ? "Both" : label}
    </button>
  );
}

export function Step1Welcome({ data, update }: StepProps) {
  return (
    <div>
      <h1 className="font-sans font-bold text-plum mb-4 text-4xl md:text-[3.2rem] leading-[1.05] tracking-[-0.03em]">
        Meet Christian singles.
      </h1>
      <StepNote>You are in the right place. This is for love, company, and a faith you do not have to explain.</StepNote>

      <fieldset>
        <legend className="mb-3 font-sans text-[15px] font-semibold text-plum">I am</legend>
        <div className="grid grid-cols-2 gap-2">
          {genders.map((option) => (
            <Pill
              key={option}
              label={option}
              selected={data.gender === option}
              onClick={() => update({ gender: option })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="mb-3 font-sans text-[15px] font-semibold text-plum">Looking to meet</legend>
        <div className="grid grid-cols-3 gap-2">
          {seeking.map((option) => (
            <Pill
              key={option}
              label={option}
              selected={data.seekingGender.includes(option)}
              onClick={() => update({ seekingGender: [option] })}
            />
          ))}
        </div>
      </fieldset>

      <label className="mt-6 flex items-start gap-3 cursor-pointer rounded-2xl border border-border-medium bg-paper p-5">
        <input
          type="checkbox"
          checked={data.eligibilityAcknowledged}
          onChange={(e) => update({ eligibilityAcknowledged: e.target.checked })}
          className="mt-1 h-5 w-5 accent-life flex-shrink-0"
          aria-required="true"
        />
        <span className="text-[15px] text-plum leading-6">I confirm I am aged {MINIMUM_AGE} or over.</span>
      </label>
    </div>
  );
}
