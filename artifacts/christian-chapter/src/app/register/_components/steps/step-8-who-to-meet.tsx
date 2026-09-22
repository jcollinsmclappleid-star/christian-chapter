"use client";

import type { StepProps } from "../wizard-types";

const radiusOptions = [10, 20, 30, 40, 50, 75, 100, 150, 200];
const AGE_MIN = 30;
const AGE_MAX = 80;

export function Step8WhoToMeet({ data, update }: StepProps) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-oxblood font-sans mb-4">
        Step 8 of 10
      </p>
      <h2 className="font-serif text-plum mb-4 text-3xl md:text-4xl">
        Who you hope to meet
      </h2>
      <p className="text-[17px] text-plum-muted leading-7 mb-10">
        These are preferences, not filters. A small age or distance difference
        won&rsquo;t stop a promising introduction — but it helps us prioritise.
      </p>

      <div className="space-y-9">
        {/* Age range */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            Preferred age range
          </legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ageMin" className="block text-[13px] text-stone mb-1 font-sans">
                From
              </label>
              <select
                id="ageMin"
                value={data.ageRangeMin}
                onChange={(e) =>
                  update({
                    ageRangeMin: Number(e.target.value),
                    ageRangeMax: Math.max(data.ageRangeMax, Number(e.target.value) + 1),
                  })
                }
                className="w-full min-h-[52px] px-4 bg-paper border border-border-medium rounded-md text-plum text-[16px] focus:outline-none focus:ring-2 focus:ring-oxblood appearance-none"
              >
                {Array.from({ length: AGE_MAX - AGE_MIN }, (_, i) => AGE_MIN + i).map(
                  (age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label htmlFor="ageMax" className="block text-[13px] text-stone mb-1 font-sans">
                To
              </label>
              <select
                id="ageMax"
                value={data.ageRangeMax}
                onChange={(e) =>
                  update({
                    ageRangeMax: Number(e.target.value),
                    ageRangeMin: Math.min(data.ageRangeMin, Number(e.target.value) - 1),
                  })
                }
                className="w-full min-h-[52px] px-4 bg-paper border border-border-medium rounded-md text-plum text-[16px] focus:outline-none focus:ring-2 focus:ring-oxblood appearance-none"
              >
                {Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + 1 + i).map(
                  (age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
          <p className="mt-2 text-[13px] text-stone">
            You&rsquo;ve indicated {data.ageRangeMin}–{data.ageRangeMax}.
          </p>
        </fieldset>

        {/* Max distance willing to travel */}
        <fieldset>
          <legend className="block text-[15px] font-sans font-medium text-plum mb-3">
            Maximum distance you&rsquo;d consider
          </legend>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {radiusOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => update({ preferredDistanceMiles: r })}
                className={`min-h-[52px] rounded-md border text-[15px] font-sans transition-colors ${
                  data.preferredDistanceMiles === r
                    ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
                    : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
                }`}
              >
                {r}&nbsp;mi
              </button>
            ))}
          </div>
        </fieldset>

        {/* Open text */}
        <div>
          <label htmlFor="meetingPreferences" className="block text-[15px] font-sans font-medium text-plum mb-2">
            Is there anything else that matters to you in who you meet?{" "}
            <span className="font-normal text-stone">(optional)</span>
          </label>
          <textarea
            id="meetingPreferences"
            value={data.meetingPreferences}
            onChange={(e) => update({ meetingPreferences: e.target.value })}
            rows={4}
            placeholder="For example: family importance, career, sense of humour, or anything that matters to you."
            className="w-full p-4 bg-paper border border-border-medium rounded-md text-plum text-[16px] leading-7 resize-y placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-oxblood"
          />
        </div>
      </div>
    </div>
  );
}
