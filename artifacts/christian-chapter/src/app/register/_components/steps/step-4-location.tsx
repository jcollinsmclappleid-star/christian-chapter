"use client";

import { StepNote } from "../step-note";
import type { StepProps } from "../wizard-types";
import { UK_REGIONS } from "../wizard-types";

const radiusOptions = [10, 20, 30, 40, 50, 75, 100, 150, 200];

export function Step4Location({ data, update }: StepProps) {
  return (
    <div>
      <h2 className="font-sans font-bold text-plum mb-4 text-3xl md:text-4xl tracking-[-0.03em]">
        Somewhere you already know.
      </h2>
      <StepNote>A broad area is enough. We never publish miles, and we never store a street address.</StepNote>

      <div className="space-y-9">
        {/* UK region */}
        <div>
          <label htmlFor="region" className="block text-[15px] font-sans font-medium text-plum mb-2">
            Broad area (UK region)
          </label>
          <select
            id="region"
            value={data.ukRegion}
            onChange={(e) => update({ ukRegion: e.target.value })}
            className="w-full min-h-[52px] px-4 bg-paper border border-border-medium rounded-md text-plum text-[16px] focus:outline-none focus:ring-2 focus:ring-oxblood appearance-none"
          >
            <option value="" disabled>
              Select your region…
            </option>
            {UK_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Travel radius */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            How far are you willing to travel to meet someone?
          </legend>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {radiusOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => update({ travelRadiusMiles: r })}
                className={`min-h-[52px] rounded-md border text-[15px] font-sans transition-colors ${
                  data.travelRadiusMiles === r
                    ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
                    : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
                }`}
              >
                {r}&nbsp;mi
              </button>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-stone">
            Currently set to <strong className="text-plum font-medium">{data.travelRadiusMiles} miles</strong>.
            This is a guide — you can always discuss it with any introduction.
          </p>
        </fieldset>
      </div>
    </div>
  );
}
