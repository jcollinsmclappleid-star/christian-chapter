import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { CheckCircle } from "lucide-react";

export const metadata = buildMetadata({
  title: "Pricing — Mature Christian Dating",
  description:
    "Mature Christian Dating is free to join during our founding phase. We'll announce what paid tiers look like — and what founding members will pay — before anything changes.",
  path: "/pricing",
});

const foundingBenefits = [
  "Complete your full profile",
  "Set your Essentials, Preferred and Open-minded preferences",
  "Be among the first to receive introductions when we launch them",
  "Shape what the paid tiers include and cost — founding members will be asked",
  "Founding-member pricing when paid tiers launch, ahead of public announcement",
];

const plannedTiers = [
  {
    name: "Member",
    desc: "Receive and send introductions. The core experience.",
    features: [
      "Everything in Free",
      "Receive a regular set of considered introductions",
      "Send introductions",
      "Unlimited conversations",
    ],
  },
  {
    name: "Plus",
    desc: "Member benefits with direct team support and extended introductions.",
    features: [
      "Everything in Member",
      "Profile consultation with our team",
      "Extended introduction set",
      "Profile review and written feedback",
    ],
  },
];

const faqs = [
  {
    q: "Is it really free right now?",
    a: "Yes. During the founding phase, joining and using Mature Christian Dating is completely free. There is no credit card required, no free trial that expires. We will give clear advance notice before any paid tier is introduced.",
  },
  {
    q: "When will paid tiers launch?",
    a: "We have not announced a date. We'll launch paid tiers when the community is large enough to make introductions genuinely useful — not on a fixed calendar. Founding members will be told what the tiers look like and what they cost before anything changes for them.",
  },
  {
    q: "What will founding members pay?",
    a: "We haven't set founding-member prices yet. We plan to offer founding members a meaningful discount on whatever the public pricing is — because they took a chance on us early. We'll confirm the amount before it applies.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. You can close your account from your settings at any time. During the free founding phase this is immediate. When paid tiers launch, we'll publish a clear cancellation policy with it.",
  },
  {
    q: "What am I signing up for right now?",
    a: "A profile in our founding cohort. You'll be able to complete your full profile, set your preferences, and see how the introduction system is designed to work. When introductions launch, founding members are first.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="section bg-ivory pb-10">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-5">
            Pricing
          </p>
          <h1 className="font-serif text-plum mb-5">
            Free during the founding phase.
          </h1>
          <p className="text-[17px] text-plum-muted leading-7 max-w-[540px]">
            We&apos;re building our founding community before introducing any paid features. Join now — it&apos;s free, and we&apos;ll tell you what comes next before it affects you.
          </p>
        </div>
      </section>

      {/* Founding membership */}
      <section className="section bg-ivory-dark pt-8">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-xl mx-auto rounded-lg border border-evergreen/30 bg-evergreen-light p-8 mb-12">
            <p className="text-[11px] uppercase tracking-[0.2em] text-evergreen font-sans font-bold mb-3">
              Founding membership
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-serif text-5xl text-plum">Free</span>
              <span className="text-[15px] text-stone">during founding phase</span>
            </div>
            <p className="text-[15px] text-plum-muted leading-6 mb-6">
              Complete your profile, set your preferences, and be first in line when introductions launch.
            </p>
            <ul className="space-y-3 mb-7">
              {foundingBenefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[14px] text-plum">
                  <CheckCircle size={15} className="text-evergreen mt-0.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <LinkButton href="/register" variant="trust" fullWidth size="lg">
              Join as a founding member — free
            </LinkButton>
          </div>

          {/* Planned future tiers */}
          <div className="mb-6">
            <h2 className="font-serif text-plum text-2xl mb-2">Planned paid tiers</h2>
            <p className="text-[15px] text-plum-muted leading-6 mb-6 max-w-[540px]">
              These are the tiers we plan to introduce once the community is ready. Prices are not set — founding members will be involved in that conversation before anything is announced publicly.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {plannedTiers.map(({ name, desc, features }) => (
                <div key={name} className="rounded-lg border border-border bg-ivory p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-sans font-semibold text-[18px] text-plum">{name}</h3>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-stone font-sans border border-border rounded-full px-2.5 py-0.5">
                      Price TBD
                    </span>
                  </div>
                  <p className="text-[14px] text-plum-muted mb-4 leading-5">{desc}</p>
                  <ul className="space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[14px] text-plum-muted">
                        <span className="text-stone mt-0.5 flex-shrink-0">–</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[13px] text-stone text-center">
            We will announce pricing and give founding applicants advance notice before any paid tier goes live.
            {siteConfig.vatRegistered
              ? " Published prices include UK VAT where applicable."
              : " We do not publish a VAT number until the organisation is registered."}
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-ivory">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-plum mb-10 text-center">Questions about pricing</h2>
          <div className="space-y-7">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-7 last:border-0 last:pb-0">
                <h3 className="font-sans font-semibold text-[16px] text-plum mb-2">{q}</h3>
                <p className="text-[15px] text-plum-muted leading-6">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory-dark border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-plum mb-5">Join free — no card, no commitment</h2>
          <LinkButton href="/register" size="lg" variant="primary">
            Join as a founding member
          </LinkButton>
        </div>
      </section>
    </>
  );
}
