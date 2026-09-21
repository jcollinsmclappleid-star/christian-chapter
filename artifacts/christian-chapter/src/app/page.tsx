import { ChapterHouseExperience } from "@/components/chapter-house/ChapterHouseExperience";
import { HOUSE_DESTINATIONS } from "@/components/chapter-house/houseContent";
import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christian Chapter — UK Christian dating for your next chapter",
  description:
    "A more thoughtful way for Christians to meet. A considered UK founding cohort for Christian singles aged 40 and over — introductions with care, not endless swiping.",
  alternates: { canonical: "https://christianchapter.co.uk" },
};

const rooms = [
  {
    id: "how-it-works",
    title: "The Common Table",
    body: "Finite introductions, each with a reason. No swipe deck. No percentage score. Matching is not live in production today.",
  },
  {
    id: "library",
    title: "The Library",
    body: "A life told in five chapters. What another member would see is shaped by your visibility choices — shown here only as a labelled demonstration.",
  },
  {
    id: "path",
    title: "The Garden Path",
    body: "Essential, Preferred and Open-minded. Nearby, Worth the journey, and Open to distance. We do not publish exact miles or live candidate counts.",
  },
  {
    id: "garden",
    title: "The Sheltered Garden",
    body: "Visibility, taking a break, block and report, and versioned religious-data consent. Verification is not live and is never proof of faith or character.",
  },
  {
    id: "courtyard",
    title: "The Gathering Courtyard",
    body: "Events and personal matchmaking are upcoming. They are not offered as a live service in this founding phase.",
  },
  {
    id: "membership",
    title: "The Membership Room",
    body: "Free during the founding phase. Planned Member and Plus outcomes are described on the pricing page. Prices are not published and there is no checkout.",
  },
];

export default function HomePage() {
  return (
    <>
      <ChapterHouseExperience>
        <div className="house-arrival">
          <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-6">
            Christian dating for the next chapter of life
          </p>
          <h1 className="font-serif text-plum leading-[1.05] mb-6 max-w-[18ch]">
            A more thoughtful way for Christians to meet.
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 mb-8 max-w-[34rem]">
            Meaningful introductions for UK Christians over 40 — shaped by faith, life experience and what truly matters next.
          </p>
          <div className="flex flex-wrap items-center gap-5 mb-8">
            <LinkButton href="/register" size="lg" variant="primary">
              Begin your chapter
            </LinkButton>
            <a href="/?house=table" className="text-[15px] text-plum-muted underline underline-offset-4 hover:text-plum">
              Explore how it works
            </a>
          </div>
          <p className="text-[14px] text-stone">
            No endless swiping · Introductions with reasons · Privacy by design
          </p>
        </div>
      </ChapterHouseExperience>

      <section id="how-it-works" className="house-rooms">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-4">
            The Chapter House
          </p>
          <h2 className="font-serif text-plum mb-3">Every room, in writing.</h2>
          <p className="text-[17px] text-plum-muted leading-7 max-w-[36rem] mb-10">
            The house is a way to walk the product. The pages below remain if 3D cannot run.
            {siteConfig.foundingStage ? " Joining is free during the founding phase." : ""}
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {rooms.map((room) => (
              <article key={room.id} id={room.id === "how-it-works" ? undefined : room.id}>
                <h3 className="font-serif text-[1.6rem] text-plum mb-2">{room.title}</h3>
                <p className="text-[16px] text-plum-muted leading-7">{room.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-[14px] text-stone">
            Destinations in the house: {HOUSE_DESTINATIONS.map((item) => item.name).join(", ")}.
          </p>
        </div>
      </section>
    </>
  );
}
