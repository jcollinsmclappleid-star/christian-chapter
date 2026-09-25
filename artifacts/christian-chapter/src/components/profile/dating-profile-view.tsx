import { getAge } from "@/lib/age";
import type { ProfilePhoto, ProfilePrompt } from "@/lib/profile/types";

type ViewProfile = {
  firstName: string | null;
  dateOfBirth?: string | null;
  age?: number | null;
  ukRegion: string | null;
  tradition: string | null;
  churchAttendance: string | null;
  faithCentrality: string | null;
  faithDescription: string | null;
  aboutMe: string | null;
  lookingFor: string | null;
  nextChapter: string | null;
  relationshipGoal: string | null;
  relationshipPace: string | null;
  relationshipHistory: string | null;
  familySituation: string | null;
  workStatus: string | null;
  interests: string[] | null;
  travelRadiusMiles: number | null;
  openToRelocation: boolean | null;
  prompts: ProfilePrompt[];
  photos: ProfilePhoto[];
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-ivory/90 text-[13px] text-plum border border-border">
      {children}
    </span>
  );
}

function PhotoFrame({ photo, caption }: { photo: ProfilePhoto; caption?: React.ReactNode }) {
  return (
    <figure className="relative overflow-hidden rounded-[18px] bg-ivory-darker aspect-[4/5]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_18%]" />
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum/80 to-transparent px-5 pb-5 pt-16 text-ivory">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function PromptCard({ prompt }: { prompt: ProfilePrompt }) {
  return (
    <blockquote className="rounded-[18px] bg-ivory border border-border px-6 py-7">
      <p className="text-[12px] uppercase tracking-[0.2em] text-oxblood mb-3">{prompt.prompt}</p>
      <p className="font-serif text-[1.65rem] leading-snug text-plum">{prompt.answer}</p>
    </blockquote>
  );
}

export function DatingProfileView({
  profile,
  compact = false,
}: {
  profile: ViewProfile;
  compact?: boolean;
}) {
  const age = profile.age ?? (profile.dateOfBirth ? getAge(profile.dateOfBirth) : null);
  const photos = [...profile.photos].sort((a, b) => a.position - b.position);
  const hero = photos[0];
  const rest = photos.slice(1);
  const prompts = profile.prompts.filter((p) => p.answer.trim());
  const chips = [
    profile.ukRegion,
    profile.tradition,
    profile.workStatus,
    profile.relationshipGoal,
    profile.travelRadiusMiles ? `Within ${profile.travelRadiusMiles} miles` : null,
    profile.openToRelocation ? "Open to relocating" : null,
  ].filter(Boolean) as string[];

  const title = [profile.firstName, age].filter(Boolean).join(", ");

  return (
    <article className={compact ? "space-y-4" : "space-y-5"}>
      {hero ? (
        <PhotoFrame
          photo={hero}
          caption={
            <span>
              <span className="block font-serif text-[2rem] leading-none">{title || "Your profile"}</span>
              {profile.ukRegion && (
                <span className="mt-2 block text-[14px] text-ivory/80">{profile.ukRegion}</span>
              )}
            </span>
          }
        />
      ) : (
        <div className="rounded-[18px] bg-ivory-dark aspect-[4/5] flex items-center justify-center px-8 text-center">
          <p className="text-plum-muted text-[15px]">Add a first photograph — this is how someone meets you.</p>
        </div>
      )}

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
      )}

      {profile.aboutMe && (
        <section className="px-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-oxblood mb-2">About me</p>
          <p className="text-[17px] leading-7 text-plum">{profile.aboutMe}</p>
        </section>
      )}

      {prompts[0] && <PromptCard prompt={prompts[0]} />}
      {rest[0] && <PhotoFrame photo={rest[0]} />}
      {prompts[1] && <PromptCard prompt={prompts[1]} />}
      {rest[1] && <PhotoFrame photo={rest[1]} />}

      {(profile.faithDescription || profile.churchAttendance || profile.faithCentrality) && (
        <section className="rounded-[18px] bg-plum text-ivory px-6 py-7">
          <p className="text-[11px] uppercase tracking-[0.22em] text-brass mb-3">What faith means to me</p>
          {profile.faithDescription && (
            <p className="font-serif text-[1.5rem] leading-snug mb-4">{profile.faithDescription}</p>
          )}
          <p className="text-[14px] text-mist">
            {[profile.tradition, profile.churchAttendance, profile.faithCentrality]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </section>
      )}

      {rest.slice(2).map((photo) => (
        <PhotoFrame key={photo.id} photo={photo} />
      ))}

      {prompts[2] && <PromptCard prompt={prompts[2]} />}

      {profile.lookingFor && (
        <section className="rounded-[18px] border border-border bg-ivory px-6 py-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-oxblood mb-2">What I’m looking for</p>
          <p className="font-serif text-[1.45rem] leading-snug text-plum">{profile.lookingFor}</p>
        </section>
      )}

      {profile.nextChapter && (
        <section className="rounded-[18px] bg-ivory-dark px-6 py-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-oxblood mb-2">My next chapter</p>
          <p className="font-serif text-[1.45rem] leading-snug text-plum">{profile.nextChapter}</p>
        </section>
      )}

      {(profile.familySituation || profile.relationshipHistory || profile.interests?.length) && (
        <section className="rounded-[18px] border border-border bg-ivory px-6 py-6 space-y-3">
          {profile.relationshipHistory && (
            <p className="text-[15px] text-plum">
              <span className="text-stone">This chapter · </span>
              {profile.relationshipHistory.replaceAll("_", " ")}
            </p>
          )}
          {profile.familySituation && (
            <p className="text-[15px] text-plum">
              <span className="text-stone">Family · </span>
              {profile.familySituation}
            </p>
          )}
          {profile.relationshipPace && (
            <p className="text-[15px] text-plum">
              <span className="text-stone">Pace · </span>
              {profile.relationshipPace}
            </p>
          )}
          {!!profile.interests?.length && (
            <div className="flex flex-wrap gap-2 pt-2">
              {profile.interests.map((interest) => (
                <Chip key={interest}>{interest}</Chip>
              ))}
            </div>
          )}
        </section>
      )}
    </article>
  );
}
