"use client";

import { useEffect, useRef, useState } from "react";
import { getAge } from "@/lib/age";
import { composeProfileLine } from "@/lib/register/compose-line";
import { FOUNDING_MEMBER_COPY, MINIMUM_AGE, OPENING_OFFER_ENDS_LABEL } from "@/lib/site-config";
import type { StepProps } from "../wizard-types";
import {
  ATTENDANCE_OPTIONS,
  CENTRALITY_OPTIONS,
  CHILDREN_SITUATIONS,
  INTENTION_OPTIONS,
  INTEREST_GROUPS,
  MARITAL_SITUATIONS,
  PARTNER_HOPES,
  RELIGIOUS_CONSENT_VERSION,
  TRADITIONS,
  UK_REGIONS,
} from "../wizard-types";

function Note({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 rounded-2xl bg-life-light px-4 py-3 text-[15px] leading-6 text-plum">{children}</p>;
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-11 rounded-full border px-3.5 text-left text-[14px] font-semibold ${
        selected ? "border-life bg-life text-white" : "border-ivory-darker bg-paper text-plum"
      }`}
    >
      {label}
    </button>
  );
}

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

async function compressPhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 720;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not read that photograph.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.72);
}

export function StepWho({ data, update }: StepProps) {
  const genders = ["Woman", "Man", "Non-binary", "Prefer not to say"];
  const seeking = ["Women", "Men", "Open to both"];
  return (
    <div>
      <h1 className="mb-4 font-sans text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-plum">
        Who would you be glad to meet?
      </h1>
      <Note>
        This is the first thing a future partner is allowed to know. It helps them recognise who the meeting is for.
        You can add more after you have a profile.
      </Note>
      <fieldset>
        <legend className="mb-3 font-sans text-[15px] font-semibold">I am</legend>
        <div className="grid grid-cols-2 gap-2">
          {genders.map((option) => (
            <Chip key={option} label={option} selected={data.gender === option} onClick={() => update({ gender: option })} />
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="mb-3 font-sans text-[15px] font-semibold">Looking to meet</legend>
        <div className="grid grid-cols-3 gap-2">
          {seeking.map((option) => (
            <Chip
              key={option}
              label={option === "Open to both" ? "Both" : option}
              selected={data.seekingGender.includes(option)}
              onClick={() => update({ seekingGender: [option] })}
            />
          ))}
        </div>
      </fieldset>
      <label className="mt-6 flex items-start gap-3 rounded-2xl border border-ivory-darker bg-paper p-5">
        <input
          type="checkbox"
          checked={data.eligibilityAcknowledged}
          onChange={(event) => update({ eligibilityAcknowledged: event.target.checked })}
          className="mt-1 h-5 w-5 accent-life"
        />
        <span className="text-[15px] leading-6">I confirm I am aged {MINIMUM_AGE} or over.</span>
      </label>
    </div>
  );
}

export function StepAge({ data, update }: StepProps) {
  const age = getAge(data.dateOfBirth);
  return (
    <div>
      <h2 className="mb-4 font-sans text-3xl font-bold tracking-[-0.03em] text-plum md:text-4xl">Your age is welcome here.</h2>
      <Note>
        Forty and over is the room. The age helps someone of a similar life stage recognise you, and it is said as a welcome.
        You can add more after you have a profile.
      </Note>
      <label htmlFor="dob" className="mb-2 block font-sans text-[15px] font-semibold">
        Date of birth
      </label>
      <input
        id="dob"
        type="date"
        value={data.dateOfBirth}
        min="1935-01-01"
        max={new Date().toISOString().split("T")[0]}
        onChange={(event) => update({ dateOfBirth: event.target.value })}
        className="min-h-[52px] w-full rounded-2xl border border-ivory-darker bg-paper px-4 text-[16px]"
      />
      {age !== null && <p className="mt-3 text-[15px] text-plum-muted">Age {age}</p>}
      {age !== null && age < MINIMUM_AGE && (
        <p className="mt-3 text-[14px] text-oxblood" role="alert">
          Mature Christian Dating is for people aged {MINIMUM_AGE} and over.
        </p>
      )}
    </div>
  );
}

export function StepPlace({ data, update }: StepProps) {
  return (
    <div>
      <h2 className="mb-4 font-sans text-3xl font-bold tracking-[-0.03em] text-plum md:text-4xl">Somewhere a good day could happen.</h2>
      <Note>
        A region is enough for a day out, and it helps someone picture meeting you. Miles are not published.
        You can add more after you have a profile.
      </Note>
      <div className="flex flex-wrap gap-2">
        {UK_REGIONS.map((region) => (
          <Chip key={region} label={region} selected={data.ukRegion === region} onClick={() => update({ ukRegion: region })} />
        ))}
      </div>
    </div>
  );
}

export function StepFaithLight({ data, update }: StepProps) {
  return (
    <div>
      <h2 className="mb-4 font-sans text-3xl font-bold tracking-[-0.03em] text-plum md:text-4xl">Faith can be quiet or central.</h2>
      <Note>
        Quiet or central, this helps someone recognise the faith already in the room. It is never sold.
        You can add more after you have a profile.
      </Note>
      <label className="mb-6 flex items-start gap-3 rounded-2xl border border-ivory-darker bg-paper p-5">
        <input
          type="checkbox"
          checked={data.religiousDataConsent}
          onChange={(event) =>
            update({
              religiousDataConsent: event.target.checked,
              religiousDataConsentTimestamp: event.target.checked ? new Date().toISOString() : null,
              religiousDataConsentVersion: RELIGIOUS_CONSENT_VERSION,
            })
          }
          className="mt-1 h-5 w-5 accent-life"
          aria-required="true"
        />
        <span className="text-[14px] leading-6">
          <span className="font-semibold">I consent to Mature Christian Dating processing my religious belief data — required.</span>{" "}
          Faith and denomination are special category data under UK GDPR. We collect them solely to identify compatible introductions.
          They are never displayed publicly, never sold, and not shared with third parties. You may withdraw this from your account,
          which removes your profile from active introductions.
        </span>
      </label>
      <div className={data.religiousDataConsent ? "" : "pointer-events-none opacity-40"} aria-hidden={!data.religiousDataConsent}>
      <fieldset>
        <legend className="mb-3 font-sans text-[15px] font-semibold">Tradition</legend>
        <div className="flex flex-wrap gap-2">
          {TRADITIONS.map((option) => (
            <Chip key={option} label={option} selected={data.tradition === option} onClick={() => update({ tradition: option })} />
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="mb-3 font-sans text-[15px] font-semibold">How often you gather</legend>
        <div className="flex flex-wrap gap-2">
          {ATTENDANCE_OPTIONS.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={data.churchAttendance === option}
              onClick={() => update({ churchAttendance: option })}
            />
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="mb-3 font-sans text-[15px] font-semibold">How faith sits in the week</legend>
        <div className="flex flex-wrap gap-2">
          {CENTRALITY_OPTIONS.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={data.faithCentrality === option}
              onClick={() => update({ faithCentrality: option })}
            />
          ))}
        </div>
      </fieldset>
      </div>
    </div>
  );
}

export function StepLife({ data, update }: StepProps) {
  return (
    <div>
      <h2 className="mb-4 font-sans text-3xl font-bold tracking-[-0.03em] text-plum md:text-4xl">What actually fills a week?</h2>
      <Note>
        This step is optional. A marital situation, children, and a few activities help someone picture a week they could join.
        You can add more after you have a profile.
      </Note>
      <fieldset>
        <legend className="mb-3 font-sans text-[15px] font-semibold">Marital situation</legend>
        <div className="flex flex-wrap gap-2">
          {MARITAL_SITUATIONS.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={data.maritalSituation === option}
              onClick={() => update({ maritalSituation: data.maritalSituation === option ? "" : option })}
            />
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="mb-3 font-sans text-[15px] font-semibold">Children</legend>
        <div className="flex flex-wrap gap-2">
          {CHILDREN_SITUATIONS.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={data.childrenSituation === option}
              onClick={() => update({ childrenSituation: data.childrenSituation === option ? "" : option })}
            />
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="mb-3 font-sans text-[15px] font-semibold">What you are hoping for</legend>
        <div className="flex flex-wrap gap-2">
          {INTENTION_OPTIONS.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={data.relationshipGoal === option}
              onClick={() => update({ relationshipGoal: option })}
            />
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="mb-3 font-sans text-[15px] font-semibold">In a partner</legend>
        <div className="flex flex-wrap gap-2">
          {PARTNER_HOPES.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={data.partnerHopes.includes(option)}
              onClick={() => update({ partnerHopes: toggle(data.partnerHopes, option) })}
            />
          ))}
        </div>
      </fieldset>
      {INTEREST_GROUPS.map((group) => (
        <fieldset key={group.title} className="mt-6">
          <legend className="mb-3 font-sans text-[15px] font-semibold">{group.title}</legend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => (
              <Chip
                key={option}
                label={option}
                selected={data.interests.includes(option)}
                onClick={() => update({ interests: toggle(data.interests, option) })}
              />
            ))}
          </div>
        </fieldset>
      ))}
      <label className="mt-6 block">
        <span className="mb-2 block font-sans text-[15px] font-semibold">Anything else, in your own words</span>
        <textarea
          value={data.hobbyNote}
          onChange={(event) => update({ hobbyNote: event.target.value })}
          rows={3}
          placeholder="A Tuesday habit, a thing you love that never makes the lists."
          className="w-full rounded-2xl border border-ivory-darker bg-paper px-4 py-3 text-[16px]"
        />
      </label>
    </div>
  );
}

export function StepPhoto({ data, update }: StepProps) {
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Choose a photograph.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Keep the photograph under 8MB.");
      return;
    }
    try {
      const photoDataUrl = await compressPhoto(file);
      update({ photoDataUrl, photoConsent: true });
    } catch {
      setError("That photograph could not be read. Try another.");
    }
  }

  return (
    <div>
      <h2 className="mb-4 font-sans text-3xl font-bold tracking-[-0.03em] text-plum md:text-4xl">One photograph is enough for now.</h2>
      <Note>
        This step is optional. A current face, in daylight, doing something you actually do, helps someone recognise you.
        A person reviews it before anyone else sees it. You can add more after you have a profile.
      </Note>
      <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-ivory-darker bg-paper px-6 py-8 text-center">
        <span className="font-sans text-[16px] font-semibold text-life">Add a photograph</span>
        <span className="mt-1 text-[14px] text-plum-muted">From your gallery or camera. A current face, in daylight, doing something you actually do.</span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => void onFile(event.target.files?.[0])}
        />
      </label>
      {data.photoDataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.photoDataUrl} alt="Your photograph" className="mt-4 h-48 w-full rounded-[28px] object-cover" />
      )}
      {error && (
        <p className="mt-3 text-[14px] text-oxblood" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function StepLine({ data, update }: StepProps) {
  function populate() {
    const line = composeProfileLine({
      age: getAge(data.dateOfBirth),
      region: data.ukRegion,
      tradition: data.tradition,
      churchAttendance: data.churchAttendance,
      interests: data.interests,
      partnerHopes: data.partnerHopes,
      hobbyNote: data.hobbyNote,
      maritalSituation: data.maritalSituation,
      childrenSituation: data.childrenSituation,
    });
    update({
      storyPrompt1: line,
      meetingPreferences: [data.hobbyNote, ...data.partnerHopes].filter(Boolean).join(". "),
    });
  }

  return (
    <div>
      <h2 className="mb-4 font-sans text-3xl font-bold tracking-[-0.03em] text-plum md:text-4xl">A short line is enough.</h2>
      <Note>
        Finish with this. A line in your own words helps someone recognise you, and every word stays editable.
        You can add more after you have a profile.
      </Note>
      <button
        type="button"
        onClick={populate}
        className="inline-flex min-h-12 items-center rounded-full bg-life px-5 text-[15px] font-semibold text-white"
      >
        Populate from my answers
      </button>
      <label className="mt-4 block">
        <span className="sr-only">Short profile line</span>
        <textarea
          value={data.storyPrompt1}
          onChange={(event) => update({ storyPrompt1: event.target.value })}
          rows={5}
          className="w-full rounded-2xl border border-ivory-darker bg-paper px-4 py-3 text-[16px] leading-6"
        />
      </label>
    </div>
  );
}

export function StepReady({ data, update }: StepProps) {
  const [phase, setPhase] = useState<"building" | "ready">(data.profileReady ? "ready" : "building");
  const updateRef = useRef(update);
  updateRef.current = update;

  useEffect(() => {
    if (data.profileReady) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setPhase("ready");
      updateRef.current({ profileReady: true });
    }, reduced ? 200 : 1600);
    return () => window.clearTimeout(timer);
  }, [data.profileReady]);

  if (phase === "building") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center" role="status">
        <div className="h-16 w-16 animate-pulse rounded-full bg-life-light" />
        <h2 className="mt-6 font-sans text-3xl font-bold tracking-[-0.03em] text-plum">Putting your profile together.</h2>
        <p className="mt-3 max-w-sm text-[16px] leading-6 text-plum-muted">The answers you gave are becoming someone a future partner could recognise.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 font-sans text-3xl font-bold tracking-[-0.03em] text-plum md:text-4xl">Your profile is ready.</h2>
      <Note>{FOUNDING_MEMBER_COPY}</Note>
      <p className="mb-6 text-[15px] leading-6 text-plum-muted">
        Matching goes live on {OPENING_OFFER_ENDS_LABEL}. Leave a name and an email, and this profile is kept for you. Nothing is charged.
        You can add more after you have a profile.
      </p>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block font-sans text-[15px] font-semibold">First name</span>
          <input
            value={data.firstName}
            onChange={(event) => update({ firstName: event.target.value })}
            autoComplete="given-name"
            className="min-h-[52px] w-full rounded-2xl border border-ivory-darker bg-paper px-4 text-[16px]"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-sans text-[15px] font-semibold">Email</span>
          <input
            type="email"
            value={data.email}
            onChange={(event) => update({ email: event.target.value })}
            autoComplete="email"
            className="min-h-[52px] w-full rounded-2xl border border-ivory-darker bg-paper px-4 text-[16px]"
          />
        </label>
      </div>
    </div>
  );
}

export const buildSteps = [StepWho, StepAge, StepPlace, StepFaithLight, StepLife, StepPhoto, StepLine, StepReady];
