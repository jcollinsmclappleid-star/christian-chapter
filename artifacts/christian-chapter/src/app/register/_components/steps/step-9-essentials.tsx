"use client";

import type { StepProps, EssentialTier, EssentialFactor } from "../wizard-types";
import { ESSENTIAL_FACTORS } from "../wizard-types";

const tiers: { value: EssentialTier; label: string; desc: string; colourClass: string }[] = [
  {
    value: "essential",
    label: "Essential",
    desc: "Non-negotiable — we never override it",
    colourClass: "border-oxblood bg-oxblood-light text-oxblood",
  },
  {
    value: "preferred",
    label: "Preferred",
    desc: "Important — ranks introductions higher",
    colourClass: "border-evergreen bg-evergreen-light text-evergreen",
  },
  {
    value: "open",
    label: "Open-minded",
    desc: "Worth discussing — doesn't block introductions",
    colourClass: "border-border-medium bg-ivory-dark text-plum-muted",
  },
];

export function Step9Essentials({ data, update }: StepProps) {
  const getFactorTier = (factor: string): EssentialTier | null => {
    return data.essentials.find((e) => e.factor === factor)?.tier ?? null;
  };

  const setTier = (factor: string, label: string, tier: EssentialTier) => {
    const existing = data.essentials.filter((e) => e.factor !== factor);
    update({ essentials: [...existing, { factor, label, tier }] });
  };

  const clearTier = (factor: string) => {
    update({ essentials: data.essentials.filter((e) => e.factor !== factor) });
  };

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-oxblood font-sans mb-4">
        Step 9 of 10
      </p>
      <h2 className="font-serif text-plum mb-4 text-3xl md:text-4xl">
        My Essentials
      </h2>
      <p className="text-[17px] text-plum-muted leading-7 mb-5">
        For each of the factors below, tell us how it sits with you. This step is
        optional — skip any you&rsquo;re unsure about.
      </p>

      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {tiers.map(({ value, label, desc, colourClass }) => (
          <div
            key={value}
            className={`rounded-md border px-4 py-3 ${colourClass.split(" ").slice(0, 2).join(" ")} border-opacity-50`}
          >
            <p className={`text-[11px] uppercase tracking-[0.2em] font-sans font-bold mb-1 ${colourClass.split(" ")[2]}`}>
              {label}
            </p>
            <p className="text-[12px] text-plum-muted">{desc}</p>
          </div>
        ))}
      </div>

      {/* Factor rows */}
      <div className="space-y-4">
        {ESSENTIAL_FACTORS.map(({ factor, label }) => {
          const current = getFactorTier(factor);
          return (
            <div key={factor} className="bg-ivory-dark border border-border rounded-md p-4">
              <p className="text-[15px] font-sans font-medium text-plum mb-3">{label}</p>
              <div className="flex flex-wrap gap-2">
                {tiers.map(({ value, label: tierLabel }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      current === value
                        ? clearTier(factor)
                        : setTier(factor, label, value)
                    }
                    className={`min-h-[44px] px-4 py-1.5 rounded-md border text-[13px] font-sans transition-colors ${
                      current === value
                        ? value === "essential"
                          ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
                          : value === "preferred"
                          ? "border-evergreen bg-evergreen-light text-evergreen font-medium"
                          : "border-plum-muted bg-ivory-darker text-plum font-medium"
                        : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
                    }`}
                  >
                    {tierLabel}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-[13px] text-stone">
        {data.essentials.length === 0
          ? "No preferences set yet — that's fine. You can always update these later."
          : `${data.essentials.length} preference${data.essentials.length === 1 ? "" : "s"} set.`}
      </p>
    </div>
  );
}
