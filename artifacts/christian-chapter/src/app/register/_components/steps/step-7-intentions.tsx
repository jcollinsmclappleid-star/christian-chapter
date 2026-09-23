"use client";

import { StepNote } from "../step-note";
import type { StepProps } from "../wizard-types";

const goals = [
  "A committed long-term relationship",
  "Open to marriage when the time is right",
  "Open to a serious partnership (not necessarily marriage)",
  "Companionship — and see where it leads",
  "Unsure, but open to something meaningful",
];

const paces = [
  "Slowly and carefully",
  "At a comfortable, unhurried pace",
  "Fairly naturally — let it find its own speed",
];

export function Step7Intentions({ data, update }: StepProps) {
  return (
    <div>
      <h2 className="font-sans font-bold text-plum mb-4 text-3xl md:text-4xl tracking-[-0.03em]">
        Say what you actually want.
      </h2>
      <StepNote>There is no hurry, and no wrong pace. Companionship and marriage can both be honest answers.</StepNote>

      <div className="space-y-9">
        {/* What you're looking for */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            What are you hoping to find?
          </legend>
          <div className="space-y-2">
            {goals.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => update({ relationshipGoal: goal })}
                className={`w-full min-h-[56px] px-4 py-3 rounded-md border text-[15px] font-sans text-left leading-5 transition-colors ${
                  data.relationshipGoal === goal
                    ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
                    : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Open to remarriage */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            Open to remarriage or a first marriage?
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {([
              { label: "Yes, open to it", value: true },
              { label: "Not looking for marriage", value: false },
              { label: "Not sure yet", value: null },
            ] as const).map(({ label, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => update({ openToRemarriage: value })}
                className={`min-h-[52px] px-4 py-2 rounded-md border text-[15px] font-sans leading-5 transition-colors ${
                  data.openToRemarriage === value
                    ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
                    : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Pace */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            How do you think about the pace of a new relationship?{" "}
            <span className="font-normal text-stone">(optional)</span>
          </legend>
          <div className="space-y-2">
            {paces.map((pace) => (
              <button
                key={pace}
                type="button"
                onClick={() =>
                  update({ relationshipPace: data.relationshipPace === pace ? "" : pace })
                }
                className={`w-full min-h-[52px] px-4 py-2 rounded-md border text-[15px] font-sans text-left transition-colors ${
                  data.relationshipPace === pace
                    ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
                    : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
                }`}
              >
                {pace}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
