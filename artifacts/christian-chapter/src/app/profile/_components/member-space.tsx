"use client";

import { getAge } from "@/lib/age";
import { PROFILE_PHOTO_LIMIT } from "@/lib/profile/photos";
import type { StudioProfile } from "@/lib/profile/types";

export function MemberSpace({
  profile,
  onEditPhotos,
}: {
  profile: StudioProfile;
  onEditPhotos: () => void;
}) {
  const photos = [...profile.photos].sort((a, b) => a.position - b.position);
  const hero = photos[0];
  const rest = photos.slice(1, PROFILE_PHOTO_LIMIT);
  const age = profile.dateOfBirth ? getAge(profile.dateOfBirth) : null;
  const title = [profile.firstName, age].filter(Boolean).join(", ") || "Your profile";
  const suspended = profile.activityState === "taking_a_break" || profile.status === "paused";
  const emptySlots = Math.max(0, PROFILE_PHOTO_LIMIT - photos.length);
  const about = profile.aboutMe?.trim();

  return (
    <section className="mb-12 overflow-hidden rounded-[28px] bg-life text-paper">
      <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
        <div className="relative min-h-[22rem] bg-life-hover md:min-h-[34rem]">
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-end p-8">
              <p className="max-w-xs font-serif text-[1.8rem] leading-tight text-paper">
                A photograph makes this feel like yours.
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-8 px-6 py-8 md:px-8 md:py-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-paper/70">Your space</p>
            <h1 className="mt-3 font-serif text-[2.6rem] leading-none text-paper md:text-[3.2rem]">{title}</h1>
            {profile.ukRegion && <p className="mt-3 text-[16px] text-paper/80">{profile.ukRegion}</p>}
            {suspended && (
              <p className="mt-4 inline-flex rounded-full bg-paper/15 px-3 py-1 text-[13px] text-paper">
                Suspended — left out of new introductions
              </p>
            )}
            {about && <p className="mt-6 max-w-md text-[17px] leading-7 text-paper/90">{about}</p>}
          </div>
          <div>
            <ul className="grid grid-cols-4 gap-2">
              {rest.map((photo) => (
                <li key={photo.id} className="relative aspect-square overflow-hidden rounded-xl bg-paper/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </li>
              ))}
              {Array.from({ length: Math.min(emptySlots, 4) }, (_, index) => (
                <li key={`empty-${index}`}>
                  <button
                    type="button"
                    onClick={onEditPhotos}
                    className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-paper/40 text-[20px] text-paper/80 hover:bg-paper/10"
                  >
                    +
                    <span className="sr-only">Add a photograph</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onEditPhotos}
                className="min-h-[44px] rounded-md bg-paper px-4 text-[14px] font-medium text-life"
              >
                Edit photographs
              </button>
              <a
                href="/account"
                className="inline-flex min-h-[44px] items-center rounded-md border border-paper/40 px-4 text-[14px] text-paper"
              >
                Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
