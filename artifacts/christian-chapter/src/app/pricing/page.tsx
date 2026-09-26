import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { OPENING_OFFER_ENDS_LABEL, siteConfig } from "@/lib/site-config";
import { CheckCircle } from "lucide-react";

export const metadata = buildMetadata({
  title: "Pricing — Mature Christian Dating",
  description: `Mature Christian Dating is free for founding members. Payment is not open. Live matching opens on ${OPENING_OFFER_ENDS_LABEL}.`,
  path: "/pricing",
});

const foundingBenefits = [
  "Complete your full profile",
  "Set your Essentials, Preferred and Open-minded preferences",
  "A matchmaker hand-picks an introduction from a complete profile",
  "Live matching opens on 14 February 2027",
  "Free for founding members. Payment is not open",
];

const faqs = [
  {
    q: "Is it really free right now?",
    a: "Yes. Founding membership is free. Payment is not open, and no card is taken.",
  },
  {
    q: "What does it cost after that?",
    a: "Nothing. Payment is not open. Founding membership stays free, and no card is taken.",
  },
  {
    q: "What is the difference between the concierge and live matching?",
    a: "A matchmaker hand-picks an introduction from a complete profile. That concierge service is free for founding members. The live matching system is the later service, and it opens on 14 February 2027.",
  },
  {
    q: "When does matching go live?",
    a: `A matchmaker can hand-pick an introduction from a complete profile now. Founding members are matched free. The live matching system goes live on ${OPENING_OFFER_ENDS_LABEL}. It is not a guarantee of a match.`,
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. You can close your account from your settings. Your profile is hidden at once. Deletion of remaining records follows the privacy notice.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="section bg-ivory pb-10">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-life font-sans mb-5">
            Pricing
          </p>
          <h1 className="font-serif text-plum mb-5">
            Free until {OPENING_OFFER_ENDS_LABEL}.
          </h1>
          <p className="text-[17px] text-plum-muted leading-7 max-w-[540px]">
            Founding membership is free concierge matchmaking. A matchmaker hand-picks an introduction from a complete profile. The live matching system opens on {OPENING_OFFER_ENDS_LABEL}. Payment is not open.
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
              <span className="text-[15px] text-stone">until {OPENING_OFFER_ENDS_LABEL}</span>
            </div>
            <p className="text-[15px] text-plum-muted leading-6 mb-6">
              No card is taken. A photograph is optional when you start, and you can keep building the profile afterwards.
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
              Meet Christian Singles
            </LinkButton>
          </div>

          <p className="text-[13px] text-stone text-center">
            Payment is not open. Founding membership is free.
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
          <h2 className="font-serif text-plum mb-5">Free until {OPENING_OFFER_ENDS_LABEL}</h2>
          <LinkButton href="/register" size="lg" variant="primary">
            Join as a founding member
          </LinkButton>
        </div>
      </section>
    </>
  );
}
