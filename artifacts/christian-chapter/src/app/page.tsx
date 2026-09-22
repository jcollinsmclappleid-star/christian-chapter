import { ExampleIntroduction } from "@/components/home/example-introduction";
import { IconCovenant, IconFaith, IconLamp, IconOlive } from "@/components/home/mark-icons";
import { LegacyHouseRedirect } from "@/components/home/legacy-house-redirect";
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

const points = [
  {
    icon: IconFaith,
    tone: "text-life bg-life-light",
    title: "A living faith",
    body: "Your faith and the life you already have come before a photo.",
  },
  {
    icon: IconOlive,
    tone: "text-tide bg-tide-light",
    title: "A grown life",
    body: "Written for people with work, family, and a church they already belong to.",
  },
  {
    icon: IconCovenant,
    tone: "text-life bg-life-light",
    title: "A considered introduction",
    body: "Finite introductions, each one meant to say why it is worth your time.",
  },
  {
    icon: IconLamp,
    tone: "text-tide bg-tide-light",
    title: "Unhurried",
    body: "Interest, later, or no. A conversation starts only when interest is mutual.",
  },
];

const steps = [
  { n: "1", title: "Create your profile", body: "About ten minutes. You can return to it." },
  { n: "2", title: "Set what matters", body: "Essential, Preferred, or Open-minded." },
  { n: "3", title: "Receive a reason", body: "A small set, once a cohort can support it." },
  { n: "4", title: "Answer in your own time", body: "No swipe deck, and no percentage score." },
];

export default function HomePage() {
  return (
    <>
      <LegacyHouseRedirect />

      <section className="bg-ivory">
        <div className="mx-auto flex max-w-6xl flex-col md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-center md:gap-12 md:px-8 md:py-14">
          <div className="relative order-1 h-[42vh] min-h-[260px] md:order-2 md:h-[36rem]">
            <Image
              src="/images/home/hero-park.jpg"
              alt="A couple in their fifties walking through a green park"
              fill
              priority
              className="object-cover md:rounded-[28px]"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div className="order-2 px-5 pb-8 pt-6 md:order-1 md:px-0 md:py-0">
            <p className="mb-3 inline-flex items-center rounded-full bg-life-light px-3 py-1 text-[12px] font-medium text-life">
              Christians 40+ · UK
            </p>
            <h1 className="font-sans font-semibold text-[2.15rem] md:text-[3.15rem] leading-[1.08] tracking-tight text-plum">
              Mature Christian dating.
            </h1>
            <p className="mt-3 text-[17px] leading-6 text-plum">
              Meet Christian singles who share your faith and want a meaningful relationship.
            </p>
            <div className="mt-6">
              <LinkButton href="/register" size="lg" fullWidth className="md:w-auto md:min-w-[16rem]">
                Create your free profile
              </LinkButton>
            </div>
            <p className="mt-4 text-[15px]">
              <a href="/sign-in" className="font-medium text-tide underline underline-offset-4">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ivory">
        <ul className="mx-auto grid max-w-6xl gap-3 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
          {points.map((point) => (
            <li key={point.title} className="rounded-2xl border border-border bg-paper shadow-card p-4">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${point.tone}`}>
                <point.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-3 font-sans text-[16px] font-semibold text-plum">{point.title}</h2>
              <p className="mt-1 text-[14px] leading-5 text-plum-muted">{point.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-4 md:grid-cols-2 md:px-8">
          <figure className="overflow-hidden rounded-[28px]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/home/cafe-daylight.jpg"
                alt="A woman in her late fifties reading by a sunlit cafe window"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
          </figure>
          <figure className="overflow-hidden rounded-[28px]">
            <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[18rem]">
              <Image
                src="/images/home/churchyard-walk.jpg"
                alt="Two people in their sixties walking out of a churchyard onto green grass"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
          </figure>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 bg-ivory">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
          <h2 className="mb-5 font-sans text-[1.35rem] font-semibold text-plum">How it works</h2>
          <ol className="grid max-w-3xl gap-3 sm:grid-cols-2">
            {steps.map((step) => (
              <li key={step.n} className="rounded-2xl border border-border bg-paper shadow-card p-4">
                <span className="font-sans text-[13px] font-semibold text-life">{step.n}</span>
                <h3 className="mt-1 font-sans text-[16px] font-semibold text-plum">{step.title}</h3>
                <p className="text-[14px] leading-5 text-plum-muted">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5">
            <a href="/how-it-works" className="text-[15px] font-medium text-tide underline underline-offset-4">
              See how it works
            </a>
          </p>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 pb-10 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:px-8">
          <ExampleIntroduction />
          <div className="max-w-xl md:pt-2">
            <p className="text-[16px] leading-6 text-plum">{FOUNDING_MEMBER_COPY}</p>
            <div className="mt-6">
              <LinkButton href="/register" size="lg" fullWidth className="md:w-auto md:min-w-[16rem]">
                Create your free profile
              </LinkButton>
            </div>
            <p className="mt-4 text-[15px]">
              <a href="/safety" className="font-medium text-tide underline underline-offset-4">
                Read how safety works
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
