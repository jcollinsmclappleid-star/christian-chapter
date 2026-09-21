"use client";

import { MINIMUM_AGE } from "@/lib/site-config";
import type { StepProps } from "../wizard-types";

export function Step1Welcome({ data, update }: StepProps) {
  return (
    <div>
      <h1 className="font-serif text-plum mb-4 text-4xl md:text-[3.2rem] leading-[1.1]">
        Begin here.
      </h1>
      <p className="text-[18px] text-plum-muted leading-7 mb-8 max-w-[36rem]">
        A short application for Christian singles aged {MINIMUM_AGE} and over.
        About ten minutes. You can come back to it.
      </p>

      <ul className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { title: "Private", body: "Faith details are asked for with your consent, and never sold." },
          { title: "Reviewed", body: "A person reads what you share before anyone is introduced." },
          { title: "Unhurried", body: "No swipe deck. A few considered introductions, when ready." },
        ].map((item) => (
          <li key={item.title} className="border-t border-oxblood/25 pt-4">
            <p className="font-sans font-semibold text-[15px] text-plum mb-1">{item.title}</p>
            <p className="text-[14px] text-plum-muted leading-6">{item.body}</p>
          </li>
        ))}
      </ul>

      <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-border-medium bg-ivory p-5">
        <input
          type="checkbox"
          checked={data.eligibilityAcknowledged}
          onChange={(e) => update({ eligibilityAcknowledged: e.target.checked })}
          className="mt-1 w-5 h-5 rounded accent-oxblood flex-shrink-0"
          aria-required="true"
        />
        <span className="text-[15px] text-plum leading-6">
          I am aged {MINIMUM_AGE} or over, and I understand this is a UK founding
          cohort — not a live introductions marketplace yet.
        </span>
      </label>
    </div>
  );
}
