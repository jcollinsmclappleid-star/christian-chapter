"use client";

import type { StepProps } from "../wizard-types";
import { STORY_PROMPTS } from "../wizard-types";

const PRIORITY_COUNT = 3;

export function Step10Story({ data, update }: StepProps) {
  const setPriority = (index: number, value: string) => {
    const next = [...data.priorities];
    next[index] = value;
    update({ priorities: next });
  };

  const storyFields = [
    { key: "storyPrompt1" as const, prompt: STORY_PROMPTS[0] },
    { key: "storyPrompt2" as const, prompt: STORY_PROMPTS[1] },
    { key: "storyPrompt3" as const, prompt: STORY_PROMPTS[2] },
  ];

  const answered = storyFields.filter((f) => data[f.key].trim().length > 0).length;

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-oxblood font-sans mb-4">
        Step 10 of 10
      </p>
      <h2 className="font-serif text-plum mb-4 text-3xl md:text-4xl">
        Your story
      </h2>
      <p className="text-[17px] text-plum-muted leading-7 mb-5">
        These responses help us understand who you are beyond the categories.
        Answer at least one — as little or as much as feels right.
      </p>
      <p className="text-[13px] text-stone mb-10">
        {answered === 0
          ? "Answer at least one prompt to continue."
          : `${answered} of 3 prompts answered.`}
      </p>

      {/* Story prompts */}
      <div className="space-y-8 mb-12">
        {storyFields.map(({ key, prompt }, i) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="block text-[15px] font-sans font-medium text-plum mb-2 leading-6"
            >
              <span className="text-oxblood font-serif text-sm mr-2">{i + 1}.</span>
              {prompt}
            </label>
            <textarea
              id={key}
              value={data[key]}
              onChange={(e) => update({ [key]: e.target.value })}
              rows={4}
              placeholder="There's no right answer — just tell us what feels true."
              className="w-full p-4 bg-paper border border-border-medium rounded-md text-plum text-[16px] leading-7 resize-y placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-oxblood"
            />
          </div>
        ))}
      </div>

      {/* Three priorities */}
      <div className="mb-10">
        <p className="text-[15px] font-sans font-medium text-plum mb-2">
          Your three priorities{" "}
          <span className="font-normal text-stone">(optional)</span>
        </p>
        <p className="text-[13px] text-stone mb-4">
          In a few words each, what are the three most important things you&rsquo;re
          looking for in a relationship? For example: &ldquo;shared faith&rdquo;,
          &ldquo;kindness&rdquo;, &ldquo;makes me laugh&rdquo;.
        </p>
        <div className="space-y-3">
          {Array.from({ length: PRIORITY_COUNT }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="font-serif text-oxblood text-lg w-5 text-center flex-shrink-0">
                {i + 1}.
              </span>
              <input
                type="text"
                value={data.priorities[i] ?? ""}
                onChange={(e) => setPriority(i, e.target.value)}
                placeholder={`Priority ${i + 1}`}
                maxLength={80}
                className="flex-1 min-h-[48px] px-4 bg-paper border border-border-medium rounded-md text-plum text-[16px] placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-oxblood"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Photo note */}
      <div className="bg-ivory-dark border border-border rounded-lg p-5">
        <p className="text-[14px] font-sans font-medium text-plum mb-2">
          Profile photo — add after joining
        </p>
        <p className="text-[13px] text-plum-muted leading-5">
          During the founding phase, photos are added after your profile is reviewed.
          We&rsquo;ll send you a link once your account is active. Photos are always
          optional — an introduction is never dependent on having one.
        </p>
      </div>
    </div>
  );
}
