"use client";

import { FOUNDING_MEMBER_COPY, MINIMUM_AGE } from "@/lib/site-config";
import type { StepProps } from "../wizard-types";

export function Step1Welcome({ data, update }: StepProps) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-oxblood font-sans mb-4">
        Mature Christian Dating
      </p>
      <h1 className="font-serif text-plum mb-4 text-4xl md:text-[3.2rem] leading-[1.1]">
        Create your profile.
      </h1>
      <p className="text-[18px] text-plum-muted leading-7 mb-8 max-w-[36rem]">
        For Christian singles aged {MINIMUM_AGE} and over. About ten minutes. You can come back to it.
      </p>

      <ul className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { title: "Private", body: "Faith details are asked for with your consent, and never sold." },
          { title: "Reviewed", body: "Submitted profiles are checked as a quality and safety control before anyone is introduced." },
          { title: "Unhurried", body: "No swipe deck. Introductions are finite, and only once a cohort can support them." },
        ].map((item) => (
          <li key={item.title} className="border-t border-oxblood/25 pt-4">
            <p className="font-sans font-semibold text-[15px] text-plum mb-1">{item.title}</p>
            <p className="text-[14px] text-plum-muted leading-6">{item.body}</p>
          </li>
        ))}
      </ul>

      <p className="text-[15px] text-plum-muted leading-7 mb-6">{FOUNDING_MEMBER_COPY}</p>
      <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-border-medium bg-ivory p-5">
        <input
          type="checkbox"
          checked={data.eligibilityAcknowledged}
          onChange={(e) => update({ eligibilityAcknowledged: e.target.checked })}
          className="mt-1 w-5 h-5 rounded accent-oxblood flex-shrink-0"
          aria-required="true"
        />
        <span className="text-[15px] text-plum leading-6">
          I confirm I am aged {MINIMUM_AGE} or over.
        </span>
      </label>
    </div>
  );
}
