"use client";

import { getAge } from "@/lib/age";
import { MINIMUM_AGE } from "@/lib/site-config";
import { StepNote } from "../step-note";
import type { StepProps } from "../wizard-types";

export function Step3About({ data, update }: StepProps) {
  const calculatedAge = getAge(data.dateOfBirth);

  return (
    <div>
      <h2 className="font-sans font-bold text-plum mb-4 text-3xl md:text-4xl tracking-[-0.03em]">
        Your age is welcome here.
      </h2>
      <StepNote>This is for people with a life already underway. There is no upper age.</StepNote>

      <div className="space-y-9">
        <div>
          <label htmlFor="dob" className="block text-[15px] font-sans font-medium text-plum mb-2">
            Date of birth
          </label>
          <div className="flex items-center gap-4">
            <input
              id="dob"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => update({ dateOfBirth: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
              min="1935-01-01"
              className="flex-1 min-h-[52px] px-4 bg-paper border border-border-medium rounded-md text-plum text-[16px] focus:outline-none focus:ring-2 focus:ring-oxblood"
            />
            {calculatedAge !== null && (
              <span className="text-[15px] text-plum-muted font-sans whitespace-nowrap">
                Age {calculatedAge}
              </span>
            )}
          </div>
          <p className="mt-2 text-[12px] text-stone">
            Used to confirm you are {MINIMUM_AGE} or over. Not displayed to other
            members. There is no maximum age.
          </p>
          {calculatedAge !== null && calculatedAge < MINIMUM_AGE && (
            <p className="mt-3 text-[14px] text-oxblood leading-6" role="alert">
              Mature Christian Dating is for people aged {MINIMUM_AGE} and over. You can
              leave this application here — there is nothing further to complete.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
