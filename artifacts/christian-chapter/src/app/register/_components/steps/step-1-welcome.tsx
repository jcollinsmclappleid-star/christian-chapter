"use client";

import type { StepProps } from "../wizard-types";
import { CheckCircle } from "lucide-react";

const whatWeCover = [
  "Your account and a way to reach you",
  "A little about your life and faith",
  "Who you're hoping to meet",
  "Your relationship intentions",
  "The things that matter most to you",
  "Some words about who you are",
];

export function Step1Welcome({ data: _, update: __, onNext: ___, onBack: ____, step: _____ }: StepProps) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-oxblood font-sans mb-4">
        Step 1 of 10
      </p>
      <h1 className="font-serif text-plum mb-5 text-4xl md:text-5xl">
        Let&rsquo;s build your profile.
      </h1>
      <p className="text-[17px] text-plum-muted leading-7 mb-8 max-w-prose">
        This takes around 10–12 minutes. There are no right or wrong answers —
        just tell us what feels true for you. Your progress is saved automatically
        after each step.
      </p>

      <div className="bg-ivory-dark rounded-lg border border-border p-6 mb-8">
        <p className="text-[13px] uppercase tracking-[0.2em] text-oxblood font-sans font-medium mb-5">
          What we&apos;ll ask
        </p>
        <ul className="space-y-3">
          {whatWeCover.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] text-plum">
              <CheckCircle size={16} className="text-evergreen mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border pt-6 space-y-3 text-[13px] text-stone">
        <p>
          Your answers are used only to identify genuine matches. They are never
          shared publicly or sold to third parties.
        </p>
        <p>
          You can return and update your profile at any time.
          We&rsquo;ll give you advance notice before anything changes.
        </p>
      </div>
    </div>
  );
}
