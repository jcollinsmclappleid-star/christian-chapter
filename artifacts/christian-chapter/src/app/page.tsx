import { IconBlock, IconCovenant, IconEye, IconFaith, IconLamp, IconLeave, IconOlive, IconPause } from "@/components/home/mark-icons";
import { LegacyHouseRedirect } from "@/components/home/legacy-house-redirect";
import { PhoneMocks } from "@/components/home/phone-mock";
import { LinkButton } from "@/components/ui/button";
import { FOUNDING_MEMBER_COPY, HERO_OFFER, siteConfig, TRAVEL_MILES_COPY } from "@/lib/site-config";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: {
    absolute: "Mature Christian dating",
  },
  description:
    "Free concierge matchmaking for UK Christian adults aged 40 and over. A matchmaker hand-picks an introduction for founding members. There is no maximum age.",
  alternates: { canonical: siteConfig.siteUrl },
};

const promise = [
  {
    icon: IconCovenant,
    title: "Your person",
    body: "Not a crowd. A small number of people, each one a possible yes.",
  },
  {
    icon: IconOlive,
    title: "A love that can last",
    body: "Marriage if it is right. Company that is serious. You say which.",
  },
  {
    icon: IconFaith,
    title: "Faith, in your words",
    body: "After you sign in, you write what faith means to you. Other members read it on your profile.",
  },
];

const path = [
  {
    n: "1",
    title: "Show who you are",
    body: "Your faith, the life you have, and the love you want. A few honest lines are enough to begin.",
  },
  {
    n: "2",
    title: "A matchmaker chooses",
    body: "Complete your profile. A concierge matchmaker hand-picks an introduction, and founding members are matched free.",
  },
  {
    n: "3",
    title: "You decide",
    body: "Interest, a conversation, or a no. Nothing moves forward unless you want it to.",
  },
];

const safety = [
  {
    icon: IconLamp,
    title: "Checked before anyone else sees it",
    body: "Photographs and profile lines are checked before a profile can be seen.",
  },
  {
    icon: IconBlock,
    title: "Block, and it holds",
    body: "Someone you block is kept out of your introductions.",
  },
  {
    icon: IconFaith,
    title: "Faith is never sold",
    body: "Faith answers need their own consent, and they are never sold.",
  },
];

const charge = [
  {
    icon: IconCovenant,
    title: "Only a real fit",
    body: "A person who misses what you marked essential is not introduced.",
  },
  {
    icon: IconEye,
    title: "You choose what is seen",
    body: "Every answer has a visibility you set.",
  },
  {
    icon: IconLeave,
    title: "Hide it in one step",
    body: "Confirm it, and your profile is hidden at once.",
  },
  {
    icon: IconPause,
    title: "Step away, and it stays",
    body: "Take a break from introductions without losing what you wrote.",
  },
];

const photos = [
  {
    src: "/images/home/joy-courtyard.jpg",
    alt: "A couple in their forties, she in a rust top and he in a light blue shirt, walking on a park path",
    line: "Someone who chooses you",
    note: "Love that is glad to be seen with you.",
  },
  {
    src: "/images/home/joy-kitchen.jpg",
    alt: "A couple in their forties, in a cream cardigan and blue shirt, cooking together",
    line: "A life you share",
    note: "Ordinary days, and the person who wants them with you.",
  },
  {
    src: "/images/home/joy-park.jpg",
    alt: "A couple in their sixties, in a mustard raincoat and olive jacket, walking on a park path",
    line: "The match you hoped for",
    note: "A person who wants the same future.",
  },
];

const display = "font-sans font-bold leading-[1.05] tracking-[-0.03em] text-plum";
const displayOnNight = "font-sans font-bold leading-[1.05] tracking-[-0.03em] text-paper";

export default function HomePage() {
  return (
    <>
      <LegacyHouseRedirect />

      <section className="relative h-[calc(100svh-3.5rem)] overflow-hidden bg-life">
        <Image
          src="/images/home/joy-rooftop.jpg"
          alt="A couple in their fifties, in a sage shirt and charcoal polo, talking on a sunny rooftop"
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        <div className="hero-shade absolute inset-0" />
        <div className="relative z-10 flex h-full items-end md:items-center">
          <div className="mx-auto w-full max-w-6xl md:px-8">
            <div className="px-5 pb-3 md:max-w-[26rem] md:px-1">
              <h1 className="font-sans text-[2.15rem] font-bold leading-[1.02] tracking-[-0.03em] text-white md:text-[2.6rem]">
                Mature Christian dating.
              </h1>
              <p className="mt-2 max-w-[22rem] text-[16px] leading-5 text-white/90">
                Find a lasting love, with someone who shares your faith.
              </p>
            </div>
            <div className="w-full rounded-t-[28px] bg-paper px-5 pb-5 pt-5 shadow-card md:max-w-[26rem] md:rounded-[28px] md:px-6 md:py-6">
              <a
                href="/register"
                className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-life px-8 text-[17px] font-semibold text-white"
              >
                Meet Christian Singles
              </a>
              <p className="mt-3 text-center text-[14px] leading-5 text-plum">{HERO_OFFER}</p>
              <p className="mt-2 text-center text-[15px]">
                <a href="/sign-in" className="font-semibold text-life underline underline-offset-4">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 bg-life">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <h2 className={`${displayOnNight} text-[2.05rem] md:text-[2.6rem]`}>The person you have been hoping to meet.</h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-foam">
            A match who wants the same relationship, and a faith you do not have to explain.
          </p>
          <ul className="mt-8">
            {promise.map((item) => (
              <li key={item.title} className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-white/15 py-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <item.icon className="h-7 w-7" />
                </span>
                <div>
                  <h3 className={`${displayOnNight} text-[1.3rem]`}>{item.title}</h3>
                  <p className="mt-1 text-[17px] leading-6 text-foam">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2">
            <a href="/how-it-works" className="text-[16px] font-semibold text-white underline underline-offset-4">
              See how it works
            </a>
          </p>
        </div>
      </section>

      <section className="bg-ivory" aria-labelledby="people-heading">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <h2 id="people-heading" className={`${display} max-w-[18ch] text-[2.05rem] md:text-[2.6rem]`}>
            Picture the match.
          </h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-plum-muted">
            Someone beside you, glad of the life you already have.
          </p>
          <ul className="mt-6 flex flex-col gap-4 md:grid md:grid-cols-3">
            {photos.map((photo) => (
              <li key={photo.src} className="overflow-hidden rounded-[28px] bg-ivory-dark">
                <div className="relative h-[62vh] max-h-[32rem] md:h-[28rem]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover object-[center_18%]"
                    sizes="(min-width: 768px) 30vw, 100vw"
                  />
                </div>
                <div className="px-5 py-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-stone">The love</p>
                  <p className="mt-1 font-sans text-[1.55rem] font-bold leading-none tracking-tight text-plum">{photo.line}</p>
                  <p className="mt-2 max-w-[24rem] text-[15px] leading-5 text-plum-muted">{photo.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-life" aria-labelledby="path-heading">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <h2 id="path-heading" className={`${displayOnNight} text-[2.05rem] md:text-[2.6rem]`}>How you reach them.</h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-foam">
            A clear path from the profile you write to the person you might choose. {TRAVEL_MILES_COPY}
          </p>
          <ol className="mt-8">
            {path.map((item) => (
              <li key={item.n} className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-white/15 py-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 font-sans text-[1.25rem] font-bold text-white">
                  {item.n}
                </span>
                <div>
                  <h3 className={`${displayOnNight} text-[1.3rem]`}>{item.title}</h3>
                  <p className="mt-1 text-[17px] leading-6 text-foam">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ivory" aria-labelledby="phone-heading">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <h2 id="phone-heading" className={`${display} max-w-[16ch] text-[2.05rem] md:text-[2.6rem]`}>
            A person you could say yes to.
          </h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-plum-muted">
            An introduction, and the reason it would make sense.
          </p>
          <div className="mt-8">
            <PhoneMocks />
          </div>
        </div>
      </section>

      <section className="bg-ivory-dark" aria-labelledby="assurance-heading">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <h2 id="assurance-heading" className={`${display} text-[2.05rem] md:text-[2.6rem]`}>
            You are safe to hope.
          </h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-plum-muted">
            The safety of the people here comes first. A profile is not a free-for-all.
          </p>
          <ul className="mt-8">
            {safety.map((item) => (
              <li key={item.title} className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-border py-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-life text-paper">
                  <item.icon className="h-7 w-7" />
                </span>
                <div>
                  <h3 className={`${display} text-[1.3rem]`}>{item.title}</h3>
                  <p className="mt-1 text-[17px] leading-6 text-plum-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <h2 className={`${display} mt-12 text-[2.05rem] md:text-[2.6rem]`}>You decide who gets close.</h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-plum-muted">
            You set the boundary. We do not loosen it to fill a page.
          </p>
          <ul className="mt-8">
            {charge.map((item) => (
              <li key={item.title} className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-border py-5">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-life text-paper">
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
