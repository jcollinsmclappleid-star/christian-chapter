"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DatingProfileView } from "@/components/profile/dating-profile-view";
import { PROFILE_PHOTO_LIMIT } from "@/lib/profile/photos";
import type { StudioProfile } from "@/lib/profile/types";
import { MemberSpace } from "./member-space";
import {
  ATTENDANCE_OPTIONS,
  CENTRALITY_OPTIONS,
  ESSENTIAL_FACTORS,
  INTERESTS_OPTIONS,
  TRADITIONS,
  UK_REGIONS,
} from "@/app/register/_components/wizard-types";
import { VISIBILITY_FIELDS } from "@/lib/profile/visibility";

const GENDERS = ["Man", "Woman", "Non-binary", "Prefer not to say"];
const SEEKING = ["Men", "Women", "Open to both"];
const GOALS = ["A committed relationship", "Companionship", "Open to seeing what grows"];
const HISTORY = [
  { value: "never_married", label: "Never married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];
const PACE = ["Unhurried", "Steady", "Ready when it is right"];
const WORK = ["Working", "Semi-retired", "Retired", "Other"];
const SLOTS = Array.from({ length: PROFILE_PHOTO_LIMIT }, (_, index) => index + 1);

type Section = "photos" | "story" | "about" | "faith" | "life" | "looking" | "place" | "essentials" | "privacy";

function Choice({
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
      onClick={onClick}
      className={`min-h-[48px] px-4 rounded-md border text-[15px] text-left transition-colors ${
        selected
          ? "border-oxblood bg-oxblood-light text-oxblood font-medium"
          : "border-border-medium bg-ivory text-plum-muted hover:bg-ivory-dark"
      }`}
    >
      {label}
    </button>
  );
}

export function ProfileStudio({ initial }: { initial: StudioProfile }) {
  const [profile, setProfile] = useState(initial);
  const [section, setSection] = useState<Section>("photos");
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pending = useRef<Record<string, unknown>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const persist = useCallback(async (patch: Record<string, unknown>) => {
    setSaveState("saving");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      setSaveState("error");
      return;
    }
    const next = (await res.json()) as StudioProfile;
    setProfile((current) => ({ ...current, ...next, photos: current.photos, messages: current.messages }));
    setSaveState("saved");
  }, []);

  const update = useCallback(
    (patch: Partial<StudioProfile> & Record<string, unknown>) => {
      setProfile((current) => ({ ...current, ...patch }));
      pending.current = { ...pending.current, ...patch };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const body = pending.current;
        pending.current = {};
        void persist(body);
      }, 500);
    },
    [persist],
  );

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function uploadPhotos(files: File[]) {
    setUploading(true);
    setUploadError(null);
    let added = 0;
    for (const file of files) {
      if (profile.photos.length + added >= PROFILE_PHOTO_LIMIT) {
        setUploadError("Five photographs is the maximum.");
        break;
      }
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/profile/photos", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUploadError(json.error ?? "That photograph could not be added.");
        break;
      }
      added += 1;
      setProfile((current) => ({
        ...current,
        photos: [...current.photos, json].sort((a, b) => a.position - b.position),
        completion: {
          ...current.completion,
          photoCount: current.photos.length + 1,
        },
      }));
    }
    setUploading(false);
  }

  function openPhotos() {
    setSection("photos");
    requestAnimationFrame(() => {
      document.getElementById("photographs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function removePhoto(id: string) {
    await fetch(`/api/profile/photos/${id}`, { method: "DELETE" });
    setProfile((current) => ({
      ...current,
      photos: current.photos.filter((photo) => photo.id !== id),
    }));
  }

  async function makeFirst(id: string) {
    await fetch(`/api/profile/photos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: 1 }),
    });
    setProfile((current) => {
      const chosen = current.photos.find((photo) => photo.id === id);
      if (!chosen) return current;
      const others = current.photos.filter((photo) => photo.id !== id);
      return {
        ...current,
        photos: [{ ...chosen, position: 1 }, ...others.map((photo, i) => ({ ...photo, position: i + 2 }))],
      };
    });
  }

  async function submit() {
    setSubmitError(null);
    if (timer.current) {
      clearTimeout(timer.current);
      await persist(pending.current);
      pending.current = {};
    }
    const res = await fetch("/api/profile/submit", { method: "POST" });
    const json = await res.json();
    if (!res.ok) {
      setSubmitError(json.missing?.[0] ?? json.error ?? "A few things still need completing.");
      return;
    }
    setProfile((current) => ({ ...current, ...json }));
  }

  const photosBySlot = useMemo(() => {
    const sorted = [...profile.photos].sort((a, b) => a.position - b.position);
    if (sorted.length > PROFILE_PHOTO_LIMIT) return sorted;
    return SLOTS.map((_, index) => sorted[index] ?? null);
  }, [profile.photos]);

  const hasSpace = Boolean(profile.firstName) || profile.photos.length > 0 || profile.completion.ready;

  const sections: { id: Section; label: string }[] = [
    { id: "photos", label: "Photos" },
    { id: "story", label: "Story" },
    { id: "about", label: "About" },
    { id: "faith", label: "Faith" },
    { id: "life", label: "My life" },
    { id: "looking", label: "Looking for" },
    { id: "place", label: "Place" },
    { id: "essentials", label: "Essentials" },
    { id: "privacy", label: "Privacy" },
  ];

  return (
    <div>
      {hasSpace && <MemberSpace profile={profile} onEditPhotos={openPhotos} />}
      <div className={`grid gap-10 items-start ${hasSpace ? "" : "lg:grid-cols-[minmax(280px,390px)_minmax(0,1fr)]"}`}>
      {!hasSpace && (
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-[28px] border border-border bg-ivory-dark/40 p-3 md:p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone text-center mb-3">
            How you appear
          </p>
          <DatingProfileView profile={profile} compact />
        </div>
      </aside>
      )}

      <div>
        {profile.messages.length > 0 && (
          <div className="mb-6 space-y-3">
            {profile.messages.map((message) => (
              <div key={message.id} className="rounded-lg border border-brass/30 bg-brass-light px-5 py-4 text-[15px] text-plum">
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-1">A note from Mature Christian Dating</p>
                {message.body}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-life mb-2">Your profile</p>
            {hasSpace ? (
              <h2 className="font-serif text-plum text-[2.4rem] leading-none">Edit your profile</h2>
            ) : (
              <h1 className="font-serif text-plum text-[2.4rem] leading-none">Be someone worth meeting.</h1>
            )}
          </div>
          <p className="text-[13px] text-stone" aria-live="polite">
            {saveState === "saving" ? "Saving…" : saveState === "error" ? "Couldn’t save — try again." : "Saved"}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 -mx-1 px-1">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`min-h-[40px] px-4 rounded-full text-[13px] whitespace-nowrap border ${
                section === item.id
                  ? "bg-plum text-ivory border-plum"
                  : "bg-ivory text-plum-muted border-border hover:border-plum/30"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {section === "photos" && (
          <section id="photographs">
            <h2 className="font-serif text-3xl text-plum mb-2">Photographs</h2>
            <p className="text-[16px] text-plum-muted mb-6 max-w-[48ch]">
              Up to five photographs. You can add several at once. The first is how someone meets you — a clear, current face works best.
            </p>
            {profile.photos.length > PROFILE_PHOTO_LIMIT && (
              <p className="mb-4 text-[15px] text-oxblood">Remove photographs until five remain.</p>
            )}
            {uploadError && (
              <p className="mb-4 text-[15px] text-oxblood" role="alert">{uploadError}</p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(e) => {
                const files = [...(e.target.files ?? [])];
                if (files.length) void uploadPhotos(files);
                e.target.value = "";
              }}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photosBySlot.map((photo, index) => (
                <div
                  key={photo?.id ?? `slot-${index}`}
                  className={`relative overflow-hidden rounded-xl bg-ivory-dark border border-dashed border-border-medium ${
                    index === 0 ? "col-span-2 aspect-[5/4] md:col-span-2" : "aspect-[4/5]"
                  }`}
                >
                  {photo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 flex gap-2 p-2 bg-gradient-to-t from-plum/70">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => void makeFirst(photo.id)}
                            className="min-h-[36px] px-3 rounded-md bg-ivory/95 text-[12px] text-plum"
                          >
                            Make first
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => void removePhoto(photo.id)}
                          className="min-h-[36px] px-3 rounded-md bg-ivory/95 text-[12px] text-oxblood"
                        >
                          Remove
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute top-3 left-3 text-[11px] uppercase tracking-[0.16em] bg-ivory/95 text-plum px-2.5 py-1 rounded-full">
                          First impression
                        </span>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={uploading || profile.photos.length >= PROFILE_PHOTO_LIMIT}
                      onClick={() => fileRef.current?.click()}
                      className="absolute inset-0 flex flex-col items-center justify-center text-plum-muted hover:bg-ivory-darker/60"
                    >
                      <span className="text-[28px] leading-none mb-2">+</span>
                      <span className="text-[13px]">{uploading ? "Adding…" : index === 0 ? "Add your first photo" : "Add photo"}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <label className="mt-6 block text-[15px] font-medium">
              Optional voice introduction
              <input
                type="file"
                accept="audio/mpeg,audio/mp4,audio/webm,audio/wav"
                className="mt-2 block text-[14px]"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const data = new FormData();
                  data.append("file", file);
                  data.append("kind", "voice");
                  await fetch("/api/profile/media", { method: "POST", body: data });
                  e.target.value = "";
                }}
              />
            </label>
          </section>
        )}

        {section === "story" && (
          <section className="space-y-5">
            <h2 className="font-serif text-3xl text-plum">Your story</h2>
            <p className="text-[16px] text-plum-muted max-w-[48ch]">
              Answer in your own words. These appear as cards between your photographs — the way people actually read a profile.
            </p>
            {profile.prompts.map((item, index) => (
              <label key={item.prompt} className="block rounded-[18px] border border-border bg-ivory p-5">
                <span className="block text-[12px] uppercase tracking-[0.18em] text-life mb-3">
                  {item.prompt}
                </span>
                <textarea
                  value={item.answer}
                  rows={4}
                  onChange={(e) => {
                    const prompts = profile.prompts.map((row, i) =>
                      i === index ? { ...row, answer: e.target.value } : row,
                    );
                    update({ prompts });
                  }}
                  placeholder="There’s no right answer — just what feels true."
                  className="w-full bg-transparent font-serif text-[1.35rem] leading-snug text-plum placeholder:text-stone resize-y focus:outline-none"
                />
              </label>
            ))}
          </section>
        )}

        {section === "about" && (
          <section className="space-y-6">
            <h2 className="font-serif text-3xl text-plum">About you</h2>
            <div>
              <label className="block text-[15px] font-medium mb-2" htmlFor="firstName">First name</label>
              <input
                id="firstName"
                value={profile.firstName ?? ""}
                onChange={(e) => update({ firstName: e.target.value })}
                className="w-full min-h-[52px] px-4 rounded-md border border-border-medium bg-ivory"
              />
            </div>
            <div>
              <label className="block text-[15px] font-medium mb-2" htmlFor="dob">Date of birth</label>
              <input
                id="dob"
                type="date"
                value={profile.dateOfBirth ?? ""}
                onChange={(e) => update({ dateOfBirth: e.target.value })}
                className="w-full min-h-[52px] px-4 rounded-md border border-border-medium bg-ivory"
              />
            </div>
            <div>
              <p className="text-[15px] font-medium mb-2">I am</p>
              <div className="grid grid-cols-2 gap-2">
                {GENDERS.map((label) => (
                  <Choice key={label} label={label} selected={profile.gender === label} onClick={() => update({ gender: label })} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[15px] font-medium mb-2">I would like to meet</p>
              <div className="grid grid-cols-2 gap-2">
                {SEEKING.map((label) => {
                  const selected = profile.seekingGender?.includes(label) ?? false;
                  return (
                    <Choice
                      key={label}
                      label={label}
                      selected={selected}
                      onClick={() => {
                        const current = profile.seekingGender ?? [];
                        update({
                          seekingGender: selected
                            ? current.filter((item) => item !== label)
                            : [...current, label],
                        });
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-[15px] font-medium mb-2" htmlFor="aboutMe">Introduce yourself</label>
              <textarea
                id="aboutMe"
                rows={5}
                value={profile.aboutMe ?? ""}
                onChange={(e) => update({ aboutMe: e.target.value })}
                placeholder="A few sentences a person could read over coffee."
                className="w-full p-4 rounded-md border border-border-medium bg-ivory text-[16px] leading-7"
              />
            </div>
            <div>
              <p className="text-[15px] font-medium mb-2">What you are hoping for</p>
              <div className="grid gap-2">
                {GOALS.map((label) => (
                  <Choice key={label} label={label} selected={profile.relationshipGoal === label} onClick={() => update({ relationshipGoal: label })} />
                ))}
              </div>
            </div>
          </section>
        )}

        {section === "faith" && (
          <section className="space-y-6">
            <h2 className="font-serif text-3xl text-plum">What faith means to you</h2>
            <p className="text-[15px] leading-6 text-plum-muted">
              This is your faith section. Signed-in members read it on your profile.
            </p>
            <div>
              <label className="block text-[15px] font-medium mb-2" htmlFor="faithDescription">In your own words</label>
              <textarea
                id="faithDescription"
                rows={5}
                value={profile.faithDescription ?? ""}
                onChange={(e) => update({ faithDescription: e.target.value })}
                placeholder="What faith means in your week, your church, and the life you want."
                className="w-full p-4 rounded-md border border-border-medium bg-ivory font-serif text-[1.25rem] leading-snug"
              />
            </div>
            <div>
              <p className="text-[15px] font-medium mb-2">Tradition</p>
              <div className="grid gap-2">
                {TRADITIONS.map((label) => (
                  <Choice key={label} label={label} selected={profile.tradition === label} onClick={() => update({ tradition: label })} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[15px] font-medium mb-2">Church</p>
              <div className="grid gap-2">
                {ATTENDANCE_OPTIONS.map((label) => (
                  <Choice key={label} label={label} selected={profile.churchAttendance === label} onClick={() => update({ churchAttendance: label })} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[15px] font-medium mb-2">How central is faith</p>
              <div className="grid gap-2">
                {CENTRALITY_OPTIONS.map((label) => (
                  <Choice key={label} label={label} selected={profile.faithCentrality === label} onClick={() => update({ faithCentrality: label })} />
                ))}
              </div>
            </div>
          </section>
        )}

        {section === "life" && (
          <section className="space-y-6">
            <h2 className="font-serif text-3xl text-plum">This chapter</h2>
            <div>
              <p className="text-[15px] font-medium mb-2">Relationship history</p>
              <div className="grid gap-2">
                {HISTORY.map((item) => (
                  <Choice key={item.value} label={item.label} selected={profile.relationshipHistory === item.value} onClick={() => update({ relationshipHistory: item.value })} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[15px] font-medium mb-2" htmlFor="family">Family</label>
              <input
                id="family"
                value={profile.familySituation ?? ""}
                onChange={(e) => update({ familySituation: e.target.value })}
                placeholder="Adult children, grandchildren, or no children — however you would say it."
                className="w-full min-h-[52px] px-4 rounded-md border border-border-medium bg-ivory"
              />
            </div>
            <div>
              <p className="text-[15px] font-medium mb-2">Work</p>
              <div className="grid grid-cols-2 gap-2">
                {WORK.map((label) => (
                  <Choice key={label} label={label} selected={profile.workStatus === label} onClick={() => update({ workStatus: label })} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[15px] font-medium mb-2">Pace</p>
              <div className="grid gap-2">
                {PACE.map((label) => (
                  <Choice key={label} label={label} selected={profile.relationshipPace === label} onClick={() => update({ relationshipPace: label })} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[15px] font-medium mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_OPTIONS.map((label) => {
                  const selected = profile.interests?.includes(label) ?? false;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        const current = profile.interests ?? [];
                        update({
                          interests: selected ? current.filter((item) => item !== label) : [...current, label],
                        });
                      }}
                      className={`min-h-[40px] px-3 rounded-full border text-[13px] ${
                        selected ? "bg-plum text-ivory border-plum" : "border-border text-plum-muted"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {section === "place" && (
          <section className="space-y-6">
            <h2 className="font-serif text-3xl text-plum">Place</h2>
            <div>
              <p className="text-[15px] font-medium mb-2">Region</p>
              <div className="grid gap-2">
                {UK_REGIONS.map((label) => (
                  <Choice key={label} label={label} selected={profile.ukRegion === label} onClick={() => update({ ukRegion: label })} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[15px] font-medium mb-2" htmlFor="travel">
                How far you can travel · {profile.travelRadiusMiles ?? 40} miles
              </label>
              <input
                id="travel"
                type="range"
                min={10}
                max={200}
                step={5}
                value={profile.travelRadiusMiles ?? 40}
                onChange={(e) => update({ travelRadiusMiles: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-5 h-5 accent-oxblood"
                checked={Boolean(profile.openToRelocation)}
                onChange={(e) => update({ openToRelocation: e.target.checked })}
              />
              <span>Open to relocating for the right person</span>
            </label>
            <div>
              <p className="text-[15px] font-medium mb-2">UK residence</p>
              <div className="grid gap-2">
                <Choice
                  label="I live in the UK"
                  selected={profile.ukResidence === "resident"}
                  onClick={() => update({ ukResidence: "resident" })}
                />
                <Choice
                  label="I intend to relocate to the UK"
                  selected={profile.ukResidence === "intending_to_relocate"}
                  onClick={() => update({ ukResidence: "intending_to_relocate" })}
                />
              </div>
            </div>
          </section>
        )}

        {section === "looking" && (
          <section className="space-y-6">
            <h2 className="font-serif text-3xl text-plum">What I’m looking for</h2>
            <label className="block">
              <span className="block text-[15px] font-medium mb-2">In your words</span>
              <textarea
                rows={4}
                value={profile.lookingFor ?? ""}
                onChange={(e) => update({ lookingFor: e.target.value })}
                className="w-full p-4 rounded-md border border-border-medium bg-ivory font-serif text-[1.25rem] leading-snug"
              />
            </label>
            <h3 className="font-serif text-2xl text-plum">My next chapter</h3>
            <label className="block">
              <span className="block text-[15px] font-medium mb-2">What you hope this season holds</span>
              <textarea
                rows={4}
                value={profile.nextChapter ?? ""}
                onChange={(e) => update({ nextChapter: e.target.value })}
                className="w-full p-4 rounded-md border border-border-medium bg-ivory font-serif text-[1.25rem] leading-snug"
              />
            </label>
            <label className="block">
              <span className="block text-[15px] font-medium mb-2">Caring responsibilities</span>
              <input
                value={profile.caringResponsibilities ?? ""}
                onChange={(e) => update({ caringResponsibilities: e.target.value })}
                className="w-full min-h-[52px] px-4 rounded-md border border-border-medium bg-ivory"
              />
            </label>
          </section>
        )}

        {section === "essentials" && (
          <section className="space-y-5">
            <h2 className="font-serif text-3xl text-plum">My Essentials</h2>
            <p className="text-[16px] text-plum-muted max-w-[48ch]">
              Essential is never relaxed. Preferred ranks higher. Open-minded is worth discussing.
            </p>
            {ESSENTIAL_FACTORS.map(({ factor, label }) => {
              const current = profile.essentials?.find((row) => row.factor === factor)?.tier;
              return (
                <div key={factor} className="rounded-md border border-border p-4">
                  <p className="text-[15px] font-medium mb-3">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {(["essential", "preferred", "open"] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => {
                          const rest = (profile.essentials ?? []).filter((row) => row.factor !== factor);
                          update({
                            essentials:
                              current === tier ? rest : [...rest, { factor, label, tier }],
                          });
                        }}
                        className={`min-h-[44px] px-3 rounded-md border text-[13px] ${
                          current === tier
                            ? tier === "essential"
                              ? "border-oxblood bg-oxblood-light text-oxblood"
                              : tier === "preferred"
                                ? "border-evergreen bg-evergreen-light text-evergreen"
                                : "border-plum-muted bg-ivory-dark"
                            : "border-border text-plum-muted"
                        }`}
                      >
                        {tier === "open" ? "Open-minded" : tier[0].toUpperCase() + tier.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {section === "privacy" && (
          <section className="space-y-5">
            <h2 className="font-serif text-3xl text-plum">Who sees what</h2>
            <p className="text-[16px] text-plum-muted max-w-[48ch]">
              Members see the public card. Matches see extra fields you allow. Hidden stays with you and review staff.
            </p>
            {VISIBILITY_FIELDS.filter((field) => field !== "photos" && field !== "media").map((field) => (
              <div key={field} className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3">
                <p className="text-[15px]">{field}</p>
                <div className="flex gap-2">
                  {(["members", "matches", "hidden"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        update({
                          visibility: { ...(profile.visibility ?? {}), [field]: level },
                        })
                      }
                      className={`min-h-[40px] px-3 rounded-full border text-[12px] ${
                        profile.visibility?.[field] === level
                          ? "bg-plum text-ivory border-plum"
                          : "border-border text-plum-muted"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        <div className="mt-12 pt-8 border-t border-border">
          {submitError && <p className="text-oxblood text-[14px] mb-3">{submitError}</p>}
          {!profile.completion.ready && (
            <p className="text-[14px] text-plum-muted mb-4">
              Still to add: {profile.completion.missing.slice(0, 3).join(" ")}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <a href="/profile/preview" className="min-h-[48px] px-5 inline-flex items-center rounded-md border border-border text-[14px]">
              Full preview
            </a>
            <a href="/profile/verify" className="min-h-[48px] px-5 inline-flex items-center rounded-md border border-border text-[14px]">
              Confirm your photograph
            </a>
            {profile.status === "approved" ? (
              <p className="min-h-[48px] inline-flex items-center text-[14px] text-evergreen">Approved and visible to the team.</p>
            ) : profile.status === "changes_required" ? (
              <p className="min-h-[48px] inline-flex items-center text-[14px] text-oxblood">Changes requested — update and submit again.</p>
            ) : profile.status === "submitted" || profile.status === "review" ? (
              <p className="min-h-[48px] inline-flex items-center text-[14px] text-plum-muted">With the team for review.</p>
            ) : (
              <button
                type="button"
                onClick={() => void submit()}
                className="min-h-[48px] px-6 rounded-md bg-life text-paper text-[14px] hover:bg-life-hover"
              >
                Submit for review
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
