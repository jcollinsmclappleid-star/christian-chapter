import { HeroIntake } from "@/components/home/hero-intake";
import { IconCovenant, IconFaith, IconLamp, IconOlive } from "@/components/home/mark-icons";
import { LegacyHouseRedirect } from "@/components/home/legacy-house-redirect";
import { PhoneMocks } from "@/components/home/phone-mock";
import { LinkButton } from "@/components/ui/button";
import { FOUNDING_MEMBER_COPY } from "@/lib/site-config";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: {
    absolute: "Mature Christian dating",
  },
  description:
    "Mature Christian dating for UK adults aged 40 and over. Meet thoughtful Christian singles who share your faith and want a meaningful relationship — without endless swiping.",
  alternates: { canonical: "https://christianchapter.co.uk" },
};

const rightPlace = [
  {
    icon: IconFaith,
    title: "Faith belongs in the introduction",
    body: "Not as a line added to a general dating profile.",
  },
  {
    icon: IconOlive,
    title: "A life already underway",
    body: "Work, family, and a church you already belong to.",
  },
  {
    icon: IconCovenant,
    title: "A few people, with a reason",
    body: "Finite introductions. No swipe deck and no percentage score.",
  },
];

const assurance = [
  {
    icon: IconLamp,
    title: "Reviewed with care",
    body: "Submitted profiles are checked as a quality and safety control before anyone is introduced.",
  },
  {
    icon: IconOlive,
    title: "Private by design",
    body: "You choose what another member is allowed to see.",
  },
  {
    icon: IconFaith,
    title: "Faith, with consent",
    body: "Faith answers are collected only with a separate consent, and they are never sold.",
  },
  {
    icon: IconCovenant,
    title: "Free to start",
    body: "Create your profile while we welcome founding members. There is no checkout.",
  },
];

const photos = [
  {
    src: "/images/home/hero-park.jpg",
    alt: "A couple in their fifties walking through a green park",
    caption: "An ordinary afternoon.",
  },
  {
    src: "/images/home/cafe-daylight.jpg",
    alt: "A woman in her late fifties reading by a sunlit cafe window",
    caption: "Daylight, and time.",
  },
  {
    src: "/images/home/churchyard-walk.jpg",
    alt: "Two people in their sixties leaving a churchyard onto green grass",
    caption: "After church, the rest of the day.",
  },
];

const display = "font-sans font-bold leading-[1.05] tracking-[-0.03em] text-plum";

export default function HomePage() {
  return (
    <>
      <LegacyHouseRedirect />

      <section className="relative h-[calc(100svh-3.5rem)] overflow-hidden bg-plum">
        <Image
          src="/images/home/hero-park.jpg"
          alt="A couple in their fifties walking through a green park"
          fill
          priority
          className="object-cover object-[center_20%]"
          sizes="100vw"
        />
        <div className="hero-shade absolute inset-0" />
        <div className="relative z-10 flex h-full items-end md:items-center">
          <div className="mx-auto w-full max-w-6xl md:px-8">
            <div className="w-full rounded-t-[28px] bg-paper px-5 pb-4 pt-4 shadow-card md:max-w-[26rem] md:rounded-[28px] md:px-6 md:py-6">
              <h1 className={`${display} text-[1.7rem] md:text-[2.15rem]`}>Mature Christian dating.</h1>
              <p className="mt-1 text-[15px] leading-5 text-plum-muted">
                For Christian singles aged 40 and over who want a meaningful relationship.
              </p>
              <HeroIntake />
              <p className="mt-3 text-center text-[15px]">
                <a href="/sign-in" className="font-semibold text-tide underline underline-offset-4">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 bg-ivory">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <h2 className={`${display} text-[2.05rem] md:text-[2.6rem]`}>You are in the right place.</h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-plum-muted">
            Mature Christian dating for adults whose life and faith are already underway.
          </p>
          <ul className="mt-8">
            {rightPlace.map((item) => (
              <li key={item.title} className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-border py-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-life-light text-life">
                  <item.icon className="h-7 w-7" />
                </span>
                <div>
                  <h3 className={`${display} text-[1.3rem]`}>{item.title}</h3>
                  <p className="mt-1 text-[17px] leading-6 text-plum-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2">
            <a href="/how-it-works" className="text-[16px] font-semibold text-tide underline underline-offset-4">
              See how it works
            </a>
          </p>
        </div>
      </section>

      <section className="bg-ivory-dark" aria-labelledby="people-heading">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <h2 id="people-heading" className={`${display} max-w-[14ch] text-[2.05rem] md:text-[2.6rem]`}>
            Ordinary days. A shared faith.
          </h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-plum-muted">
            Photographs of a life like yours. These are not members.
          </p>
          <ul className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
            {photos.map((photo) => (
              <li key={photo.src} className="w-[82%] shrink-0 snap-start md:w-auto">
                <div className="relative h-[26rem] overflow-hidden rounded-[28px]">
                  <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 768px) 30vw, 82vw" />
                </div>
                <p className={`${display} mt-3 text-[1.15rem]`}>{photo.caption}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ivory" aria-labelledby="phone-heading">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <h2 id="phone-heading" className={`${display} max-w-[16ch] text-[2.05rem] md:text-[2.6rem]`}>
            An introduction, in your hand.
          </h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-plum-muted">
            A labelled demonstration of the profile and the reason. It is not a member.
          </p>
          <div className="mt-8">
            <PhoneMocks />
          </div>
        </div>
      </section>

      <section className="bg-ivory-dark" aria-labelledby="assurance-heading">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <h2 id="assurance-heading" className={`${display} text-[2.05rem] md:text-[2.6rem]`}>
            Begin with some assurance.
          </h2>
          <ul className="mt-8">
            {assurance.map((item) => (
              <li key={item.title} className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-border py-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-tide-light text-tide">
                  <item.icon className="h-7 w-7" />
                </span>
                <div>
                  <h3 className={`${display} text-[1.3rem]`}>{item.title}</h3>
                  <p className="mt-1 text-[17px] leading-6 text-plum-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-xl text-[17px] leading-6 text-plum">{FOUNDING_MEMBER_COPY}</p>
          <div className="mt-6">
            <LinkButton href="/register" size="lg" fullWidth className="md:w-auto md:min-w-[16rem]">
              Create your free profile
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
