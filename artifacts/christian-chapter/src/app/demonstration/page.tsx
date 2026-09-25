import { DatingProfileView } from "@/components/profile/dating-profile-view";
import { DEMO_DISCLOSURE } from "@/lib/home/demo-fixture";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A complete profile",
  robots: { index: false, follow: false },
};

const profile = {
  firstName: "Samuel",
  age: 57,
  ukRegion: "Greater London",
  tradition: "Baptist",
  churchAttendance: "Most Sundays",
  faithCentrality: "Central to my life",
  faithDescription: "I have been in the same congregation for years. Faith is how I spend Sunday, and how I decide what matters in the week.",
  aboutMe: "I walk the river most evenings, cook properly at the weekend, and still work four days. I am looking for someone who wants a shared life, not a busy calendar.",
  lookingFor: "Someone kind, with a living faith and time for an ordinary shared life.",
  nextChapter: "Sunday lunch, a midweek walk, and a person who is glad to be seen with me.",
  relationshipGoal: "A lasting relationship",
  relationshipPace: "Steady",
  relationshipHistory: "Divorced",
  familySituation: "Adult children, living away",
  workStatus: "Working part of the week",
  interests: ["Walking", "Cooking", "Parish life", "Riverside paths"],
  travelRadiusMiles: null,
  openToRelocation: false,
  prompts: [
    { prompt: "A good week looks like", answer: "Work that finishes, a proper meal, and someone to tell about the day." },
    { prompt: "My faith in ordinary words", answer: "Baptist, most Sundays. I would rather live it than announce it." },
    { prompt: "What I hope for", answer: "Company that can last. Marriage if it is right for both of us." },
  ],
  photos: [
    { id: "1", url: "/images/home/profile-samuel.jpg", position: 0, moderationStatus: "clear" },
    { id: "2", url: "/images/home/samuel-park.jpg", position: 1, moderationStatus: "clear" },
    { id: "3", url: "/images/home/samuel-kitchen.jpg", position: 2, moderationStatus: "clear" },
  ],
};

export default function DemonstrationProfilePage() {
  return (
    <main className="bg-ivory">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-life">{DEMO_DISCLOSURE}</p>
        <h1 className="mb-3 font-sans text-[2rem] font-bold tracking-[-0.03em] text-plum">A complete profile</h1>
        <p className="mb-8 max-w-xl text-[16px] leading-6 text-plum-muted">
          This is not a member. The faith writing is the section a signed-in member sees on a profile. After you create a profile you can add photographs, your story, what faith means to you, your life, who you hope to meet, place, essentials, and privacy. A photograph is not required to begin.
        </p>
        <DatingProfileView profile={profile} />
      </div>
    </main>
  );
}
