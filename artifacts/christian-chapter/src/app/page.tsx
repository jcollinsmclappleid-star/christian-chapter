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

const points = [
  { title: "Faith first", body: "Your faith and the life you already have come before a photo." },
  { title: "A reason, not a deck", body: "Introductions are finite. Each one is meant to say why it is worth your time." },
  { title: "Free to start", body: "Create your profile while we welcome founding members. No checkout." },
];

const steps = [
  { n: "1", title: "Create your profile", body: "About ten minutes. You can return to it." },
  { n: "2", title: "Set what matters", body: "Essential, Preferred, or Open-minded." },
  { n: "3", title: "Receive a reason", body: "A small set, once a cohort can support it." },
  { n: "4", title: "Answer in your own time", body: "Interest, later, or no. A conversation starts only when interest is mutual." },
];

export default function HomePage() {
  return (
    <>
      <LegacyHouseRedirect />

      <section className="bg-ivory">
        <div className="mx-auto max-w-5xl px-5 pt-8 pb-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-center md:gap-14 md:pt-16 md:pb-10">
          <div className="max-w-md">
            <h1 className="font-sans font-semibold text-[2.15rem] md:text-[2.75rem] leading-[1.12] tracking-tight text-plum">
              Mature Christian dating.
            </h1>
            <p className="mt-4 text-[17px] leading-6 text-plum">
              Meet Christian singles aged 40 and over who share your faith and want a meaningful relationship.
            </p>
            <div className="mt-6">
              <LinkButton href="/register" size="lg" fullWidth className="md:w-auto md:min-w-[16rem]">
                Create your free profile
              </LinkButton>
            </div>
            <p className="mt-4 text-[15px]">
              <a href="/sign-in" className="text-plum underline underline-offset-4">
                Sign in
              </a>
            </p>
            <p className="mt-5 text-[13px] text-stone">UK-wide · Designed for Christians 40+ · Free to join</p>
          </div>
          <div className="mt-8 md:mt-0">
            <ExampleIntroduction />
          </div>
        </div>
      </section>

      <section className="bg-ivory border-t border-border">
        <ul className="mx-auto max-w-5xl px-5 grid md:grid-cols-3 md:divide-x md:divide-border">
          {points.map((point) => (
            <li key={point.title} className="py-5 md:px-6 md:first:pl-0 md:last:pr-0 border-b border-border md:border-b-0">
              <h2 className="font-sans font-semibold text-[16px] text-plum">{point.title}</h2>
              <p className="mt-1 text-[15px] leading-6 text-plum-muted">{point.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="how-it-works" className="bg-ivory border-t border-border scroll-mt-20">
        <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
          <h2 className="font-sans font-semibold text-[1.35rem] text-plum mb-5">How it works</h2>
          <ol className="max-w-xl divide-y divide-border border-y border-border">
            {steps.map((step) => (
              <li key={step.n} className="grid grid-cols-[1.75rem_1fr] gap-3 py-3.5">
                <span className="font-sans font-semibold text-oxblood">{step.n}</span>
                <div>
                  <h3 className="font-sans font-semibold text-[16px] text-plum">{step.title}</h3>
                  <p className="text-[15px] leading-6 text-plum-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5">
            <a href="/how-it-works" className="text-[15px] text-plum underline underline-offset-4">
              See how it works
            </a>
          </p>
        </div>
      </section>

      <section className="bg-ivory border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
          <div className="max-w-xl">
            <p className="text-[16px] leading-6 text-plum">{FOUNDING_MEMBER_COPY}</p>
            <div className="mt-6">
              <LinkButton href="/register" size="lg" fullWidth className="md:w-auto md:min-w-[16rem]">
                Create your free profile
              </LinkButton>
            </div>
            <p className="mt-4 text-[15px]">
              <a href="/safety" className="text-plum underline underline-offset-4">
                Read how safety works
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
