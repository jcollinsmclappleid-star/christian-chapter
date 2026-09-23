"use client";

import { getAge } from "@/lib/age";
import { hopeSummary, profileEncouragement } from "@/lib/register/profile-card";
import type { WizardData } from "../wizard-types";

function cardInput(data: WizardData) {
  return {
    storyPrompt1: data.storyPrompt1,
    photoDataUrl: data.photoDataUrl,
    interests: data.interests,
    maritalSituation: data.maritalSituation,
    childrenSituation: data.childrenSituation,
    partnerHopes: data.partnerHopes,
    relationshipGoal: data.relationshipGoal,
    tradition: data.tradition,
    churchAttendance: data.churchAttendance,
    ukRegion: data.ukRegion,
    age: getAge(data.dateOfBirth),
    gender: data.gender,
    seekingGender: data.seekingGender,
  };
}

export function MiniProfile({ data }: { data: WizardData }) {
  const age = getAge(data.dateOfBirth);
  const card = cardInput(data);
  const name = data.firstName.trim() || "You";
  const activities = data.interests.slice(0, 3);
  const household = [data.maritalSituation, data.childrenSituation].filter(Boolean);

  return (
    <aside className="intake-card rounded-[28px] p-4 shadow-card md:sticky md:top-6">
      <section aria-label="You">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-life">You</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-life-light">
            {data.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photoDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-[22px] font-semibold text-life">
                {name.slice(0, 1)}
              </span>
            )}
          </div>
          <div>
            <p className="font-sans text-[1.35rem] font-bold leading-none tracking-tight text-plum">
              {name}
              {age ? `, ${age}` : ""}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-plum-muted">
              {[data.ukRegion, data.tradition].filter(Boolean).join(" · ") || "A life already underway"}
            </p>
            {household.length > 0 && (
              <p className="mt-1 text-[13px] leading-5 text-plum">{household.join(" · ")}</p>
            )}
          </div>
        </div>
        {activities.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {activities.map((chip) => (
              <li key={chip} className="rounded-full bg-life-light px-2.5 py-1 text-[12px] font-medium text-plum">
                {chip}
              </li>
            ))}
          </ul>
        )}
        {data.storyPrompt1.trim() && (
          <p className="mt-3 text-[14px] leading-5 text-plum">{data.storyPrompt1.trim()}</p>
        )}
        <p className="mt-3 text-[13px] leading-5 text-life">{profileEncouragement(card)}</p>
      </section>
      <section aria-label="Who you're hoping to meet" className="mt-4 border-t border-ivory-darker pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-life">Who you&apos;re hoping to meet</p>
        <p className="mt-2 text-[14px] leading-5 text-plum">{hopeSummary(card)}</p>
      </section>
    </aside>
  );
}
