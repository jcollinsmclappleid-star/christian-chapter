import { IconBlock, IconCovenant, IconEye, IconFaith, IconLamp, IconLeave, IconOlive, IconPause } from "@/components/home/mark-icons";
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
    title: "Faith, in the room",
    body: "It belongs in the introduction, not as a line added later.",
  },
  {
    icon: IconOlive,
    title: "A life with colour in it",
    body: "Work, family, church, and room for someone new.",
  },
  {
    icon: IconCovenant,
    title: "A few people, with a reason",
    body: "An introduction you can understand. No swipe deck and no percentage score.",
  },
];

const charge = [
  {
    icon: IconLeave,
    title: "Close in one step",
    body: "Confirm it, and your profile is hidden at once.",
  },
  {
    icon: IconEye,
    title: "You choose what is seen",
    body: "Every answer has a visibility you set.",
  },
  {
    icon: IconPause,
    title: "Take a break",
    body: "Step out of introductions without losing your profile.",
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
  {
    icon: IconLamp,
    title: "A person reviews first",
    body: "A profile is checked for quality and safety before anyone is introduced.",
  },
];

const photos = [
  {
    src: "/images/home/joy-courtyard.jpg",
    alt: "A couple laughing together in a sunny courtyard",
    event: "Out in the light",
    note: "Fun, and someone glad to be beside you.",
  },
  {
    src: "/images/home/joy-kitchen.jpg",
    alt: "A couple laughing while cooking in a bright kitchen",
    event: "In the kitchen",
    note: "Love that looks like a real afternoon.",
  },
  {
    src: "/images/home/joy-park.jpg",
    alt: "A couple laughing together on a sunny park lawn",
    event: "A good day outside",
    note: "Joy, and a life with room for someone new.",
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
          alt="A couple in their fifties laughing together on a sunny rooftop"
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
                Love, company, and a faith you do not have to explain.
              </p>
            </div>
            <div className="w-full rounded-t-[28px] bg-paper px-5 pb-5 pt-5 shadow-card md:max-w-[26rem] md:rounded-[28px] md:px-6 md:py-6">
              <a
                href="/register"
                className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-life px-8 text-[17px] font-semibold text-white"
              >
                Meet Christian Singles
              </a>
              <p className="mt-3 text-center text-[15px]">
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
          <h2 className={`${displayOnNight} text-[2.05rem] md:text-[2.6rem]`}>You are in the right place.</h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-foam">
            For people who want love, and want it with a faith already in the room.
          </p>
          <ul className="mt-8">
            {rightPlace.map((item) => (
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
          <h2 id="people-heading" className={`${display} max-w-[16ch] text-[2.05rem] md:text-[2.6rem]`}>
            A life, in pictures.
          </h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-plum-muted">
            Other people, other days: outside in the sun, and inside where the light is good. These photographs are not members.
          </p>
          <ul className="mt-6 flex flex-col gap-4 md:grid md:grid-cols-3">
            {photos.map((photo) => (
              <li key={photo.src} className="relative h-[78vh] max-h-[40rem] overflow-hidden rounded-[28px] md:h-[34rem]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 30vw, 100vw"
                />
                <div className="life-caption absolute inset-x-0 bottom-0 px-5 pb-5 pt-24 text-white">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/80">Life event</p>
                  <p className="mt-1 font-sans text-[1.55rem] font-bold leading-none tracking-tight">{photo.event}</p>
                  <p className="mt-2 max-w-[24rem] text-[15px] leading-5 text-white/90">{photo.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-life" aria-labelledby="phone-heading">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <h2 id="phone-heading" className={`${displayOnNight} max-w-[16ch] text-[2.05rem] md:text-[2.6rem]`}>
            An introduction, in your hand.
          </h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-foam">
            A labelled demonstration of the profile and the reason. It is not a member.
          </p>
          <div className="mt-8">
            <PhoneMocks />
          </div>
        </div>
      </section>

      <section className="bg-ivory" aria-labelledby="assurance-heading">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <h2 id="assurance-heading" className={`${display} text-[2.05rem] md:text-[2.6rem]`}>
            You stay in charge.
          </h2>
          <p className="mt-3 max-w-xl text-[17px] leading-6 text-plum-muted">
            The controls people expect, already part of how this works.
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
