"use client";

import { getAge } from "@/lib/age";
import type { WizardData } from "../wizard-types";

export function profileEncouragement(data: WizardData): string {
  if (data.storyPrompt1.trim()) return "That already sounds like you.";
  if (data.photoDataUrl) return "A face makes it yours.";
  if (data.interests.length || data.partnerHopes.length) return "This is starting to feel like a life.";
  if (data.tradition) return "Faith is in the room.";
  if (data.ukRegion) return "Your profile has a place in the world.";
  if (data.dateOfBirth) return "Your age is welcome here.";
  if (data.gender) return "A good start. Keep going.";
  return "Your profile will take shape as you go.";
}

export function MiniProfile({ data }: { data: WizardData }) {
  const age = getAge(data.dateOfBirth);
  const name = data.firstName.trim() || "You";
  const chips = [...data.interests.slice(0, 3), ...data.partnerHopes.slice(0, 1)];

  return (
    <aside className="intake-card rounded-[28px] p-4 shadow-card md:sticky md:top-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8C3D22]">Your profile</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#F3E6DA]">
          {data.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.photoDataUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[22px] font-semibold text-[#8C3D22]">
              {name.slice(0, 1)}
            </span>
          )}
        </div>
        <div>
          <p className="font-sans text-[1.35rem] font-bold leading-none tracking-tight text-[#2C2118]">
            {name}
            {age ? `, ${age}` : ""}
          </p>
          <p className="mt-1 text-[13px] leading-5 text-[#6B5346]">
            {[data.ukRegion, data.tradition].filter(Boolean).join(" · ") || "A life already underway"}
          </p>
        </div>
      </div>
      {chips.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <li key={chip} className="rounded-full bg-[#F3E6DA] px-2.5 py-1 text-[12px] font-medium text-[#5C3B2E]">
              {chip}
            </li>
          ))}
        </ul>
      )}
      {data.storyPrompt1.trim() && (
        <p className="mt-3 text-[14px] leading-5 text-[#2C2118]">{data.storyPrompt1.trim()}</p>
      )}
      <p className="mt-3 text-[13px] leading-5 text-[#8C3D22]">{profileEncouragement(data)}</p>
    </aside>
  );
}
