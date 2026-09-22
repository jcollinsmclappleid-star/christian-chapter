"use client";

import { StepNote } from "../step-note";
import type { StepProps } from "../wizard-types";
import { INTERESTS_OPTIONS } from "../wizard-types";

const workStatuses = [
  "Working full-time",
  "Working part-time",
  "Self-employed",
  "Semi-retired",
  "Fully retired",
  "Carer",
  "Prefer not to say",
];

const familySituations = [
  "No children",
  "Young children at home",
  "Older children at home",
  "Adult children, independent",
  "Grandchildren",
  "Adult children and grandchildren",
  "Prefer not to say",
];

export function Step6LifeNow({ data, update }: StepProps) {
  const toggleInterest = (interest: string) => {
    const current = data.interests;
    update({
      interests: current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest],
    });
  };

  return (
    <div>
      <h2 className="font-sans font-bold text-plum mb-4 text-3xl md:text-4xl tracking-[-0.03em]">
        The ordinary bits are the good bits.
      </h2>
      <StepNote>Work, family, and what you do for joy. This is a life with room for someone new.</StepNote>

      <div className="space-y-9">
        {/* Work / retirement status */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            Work or retirement
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {workStatuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update({ workStatus: s })}
                className={`min-h-[52px] px-4 py-2 rounded-md border text-[15px] font-sans text-left transition-colors ${
                  data.workStatus === s
                    ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
                    : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Family situation */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            Family situation
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {familySituations.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update({ familySituation: s })}
                className={`min-h-[52px] px-4 py-2 rounded-md border text-[15px] font-sans text-left transition-colors ${
                  data.familySituation === s
                    ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
                    : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Interests */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-1">
            Interests{" "}
            <span className="font-normal text-stone">— select any that apply (optional)</span>
          </legend>
          <p className="text-[13px] text-stone mb-3">
            {data.interests.length === 0
              ? "None selected yet"
              : `${data.interests.length} selected`}
          </p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`min-h-[44px] px-4 py-2 rounded-full border text-[14px] font-sans transition-colors ${
                  data.interests.includes(interest)
                    ? "border-evergreen bg-evergreen-light text-evergreen font-medium"
                    : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
