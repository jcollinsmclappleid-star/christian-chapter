import { ExampleIntroduction } from "@/components/home/example-introduction";
import { LegacyHouseRedirect } from "@/components/home/legacy-house-redirect";
import { LinkButton } from "@/components/ui/button";
import { FOUNDING_MEMBER_COPY } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Mature Christian dating",
  },
  description:
    "Mature Christian dating for UK adults aged 40 and over. Meet thoughtful Christian singles who share your faith and want a meaningful relationship — without endless swiping.",
  alternates: { canonical: "https://christianchapter.co.uk" },
};

const steps = [
  {
    n: "1",
    title: "Create your profile",
    body: "Faith, the life you have now, and what you hope comes next. About ten minutes, and you can return to it.",
  },
  {
    n: "2",
    title: "Set what matters",
    body: "Mark each factor Essential, Preferred, or Open-minded. An Essential is a boundary we are designed to respect.",
  },
  {
    n: "3",
    title: "Receive a reason",
    body: "When a cohort is ready, introductions are finite. Each one is meant to say why it was worth your time — no swipe deck and no percentage score.",
  },
  {
    n: "4",
    title: "Answer in your own time",
    body: "Interest, later, or no. A conversation is designed to start only when interest is mutual.",
  },
];

const faqs = [
  {
    q: "Who is Mature Christian Dating for?",
    a: "UK Christians aged 40 and over. There is no maximum age. The questions are written for people with an established life, not for a student scene.",
  },
  {
    q: "What does it cost?",
    a: "Creating a profile is free while we welcome founding members. Planned Member and Plus outcomes are described on the pricing page. Prices are not published, and there is no checkout.",
  },
  {
    q: "When do introductions begin?",
    a: FOUNDING_MEMBER_COPY,
  },
  {
    q: "Who reviews my profile?",
    a: "Submitted profiles are reviewed as a quality and safety control before anyone can be introduced. The review is not a judgment of your faith or your worth.",
  },
];

export default function HomePage() {
  return (
    <>
      <LegacyHouseRedirect />

      <section className="bg-ivory pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="font-serif text-plum leading-[1.05] mb-6 max-w-[14ch]">
            Mature Christian dating.
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 mb-8 max-w-[36rem]">
            Meet thoughtful Christian singles who share your faith and want a meaningful relationship — without endless swiping.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 mb-8">
            <LinkButton href="/register" size="lg" variant="primary">
              Create your free profile
            </LinkButton>
            <a
              href="#how-it-works"
              className="inline-flex items-center min-h-[56px] text-[15px] text-plum underline underline-offset-4 hover:text-oxblood"
            >
              See how it works
            </a>
          </div>
          <p className="text-[14px] text-stone">
            UK-wide · Designed for Christians 40+ · Privacy by design
          </p>
        </div>
      </section>

      <section className="bg-ivory border-t border-border py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-plum mb-5 max-w-[20ch]">
            After 40, a photo is not the point.
          </h2>
          <p className="text-[18px] text-plum leading-8 max-w-[40rem]">
            Endless swiping treats a life as a picture. Faith, family, and the shape of an ordinary week matter more than a streak.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="bg-ivory-dark section scroll-mt-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-4">
            How it works
          </p>
          <h2 className="font-serif text-plum mb-10 max-w-[16ch]">Four steps. No deck.</h2>
          <ol className="max-w-3xl space-y-8">
            {steps.map((step) => (
              <li key={step.n} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="font-serif text-[1.6rem] text-oxblood leading-none pt-1">{step.n}</span>
                <div>
                  <h3 className="font-sans font-semibold text-[18px] text-plum mb-1">{step.title}</h3>
                  <p className="text-[16px] text-plum-muted leading-7">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10">
            <a href="/how-it-works" className="text-[15px] text-plum underline underline-offset-4 hover:text-oxblood">
              Read the full explanation
            </a>
          </p>
        </div>
      </section>

      <ExampleIntroduction />

      <section className="bg-ivory section">
        <div className="mx-auto max-w-5xl px-6 grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">
          <h2 className="font-serif text-plum max-w-[14ch]">Built for a life that is already underway.</h2>
          <div className="space-y-5 text-[17px] text-plum-muted leading-7">
            <p>
              Grown children. A church you already belong to. Work that still takes the week. A distance you will travel, and a distance you will not.
            </p>
            <p>
              The profile asks about those realities so an introduction can respect them. You choose what another member is allowed to see.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-evergreen text-ivory">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-ivory mb-5 max-w-[18ch]">Privacy and safety, stated plainly.</h2>
          <p className="text-[17px] text-ivory/90 leading-7 max-w-[40rem] mb-8">
            Faith answers are collected only with a separate consent. You choose what another member can see. The Safety page lists what already operates and what is still being built.
          </p>
          <a href="/safety" className="text-[15px] text-ivory underline underline-offset-4">
            Read how safety works
          </a>
        </div>
      </section>

      <section className="bg-ivory section" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl px-6">
          <h2 id="faq-heading" className="font-serif text-plum mb-8">
            Questions worth answering first.
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="cursor-pointer font-sans font-semibold text-[17px] text-plum list-none flex justify-between gap-6">
                  {item.q}
                  <span aria-hidden className="text-oxblood font-serif text-[1.4rem] leading-none group-open:hidden">
                    +
                  </span>
                  <span aria-hidden className="text-oxblood font-serif text-[1.4rem] leading-none hidden group-open:inline">
                    –
                  </span>
                </summary>
                <p className="mt-3 text-[16px] text-plum-muted leading-7">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory-dark section border-t border-border">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-plum mb-5 max-w-[16ch]">Create your profile. It is free.</h2>
          <p className="text-[17px] text-plum-muted leading-7 mb-8">{FOUNDING_MEMBER_COPY}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <LinkButton href="/register" size="lg" variant="primary">
              Create your free profile
            </LinkButton>
            <LinkButton href="/sign-in" size="lg" variant="ghost">
              Sign in
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
