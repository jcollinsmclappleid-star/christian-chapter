import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { INCOGNITO_PRICE_LABEL, INCOGNITO_STARTS_LABEL, MEMBER_PRICE_LABEL, OPENING_OFFER_ENDS_LABEL, siteConfig } from "@/lib/site-config";
import { CheckCircle } from "lucide-react";

export const metadata = buildMetadata({
  title: "Pricing — Mature Christian Dating",
  description: `Mature Christian Dating is free until ${OPENING_OFFER_ENDS_LABEL}. After that the member price is ${MEMBER_PRICE_LABEL}. No payment is taken during the opening offer.`,
  path: "/pricing",
});

const foundingBenefits = [
  "Complete your full profile",
  "Set your Essentials, Preferred and Open-minded preferences",
  "A profile ready for when matching goes live on 14 February 2027",
  "No payment during the opening offer. You can save a card for 15 February 2027",
];

const faqs = [
  {
    q: "Is it really free right now?",
    a: `Yes, until ${OPENING_OFFER_ENDS_LABEL}. No payment is taken during that time. This is an opening offer with an end date, not an open-ended promise.`,
  },
  {
    q: "What does it cost after that?",
    a: `The member price is ${MEMBER_PRICE_LABEL} from 15 February 2027. You can save a card before then. The first payment is taken on that date. Private browsing, if you want it, is a separate ${INCOGNITO_PRICE_LABEL} from ${INCOGNITO_STARTS_LABEL}.`,
  },
  {
    q: "How does that compare?",
    a: "Public one-month list prices checked in September 2026 were about £29.99 on Match in the UK, about £29.95 on Christian Connection, about £44.95 on eharmony, and about £24.95 a month for a short SilverSingles plan. Longer plans on those services cost less per month. Offers change.",
  },
  {
    q: "When does matching go live?",
    a: `Matching goes live on ${OPENING_OFFER_ENDS_LABEL}. Until then you can build your profile free as a founding member. It is not a guarantee of a match.`,
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
            Then matching goes live, and the member price is {MEMBER_PRICE_LABEL}. Nothing is charged during the opening offer.
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
              After that date the member price is {MEMBER_PRICE_LABEL}. You can save a card from your account. Nothing is charged when you save it.
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

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-ivory p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-stone font-sans mb-2">
                From 15 February 2027
              </p>
              <h2 className="font-sans font-semibold text-[22px] text-plum mb-2">Member · {MEMBER_PRICE_LABEL}</h2>
              <p className="text-[15px] text-plum-muted leading-6">
                The membership price. Saving a card from your account holds it for the first payment on 15 February 2027.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-ivory p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-stone font-sans mb-2">
                Optional, from {INCOGNITO_STARTS_LABEL}
              </p>
              <h2 className="font-sans font-semibold text-[22px] text-plum mb-2">Private browsing · {INCOGNITO_PRICE_LABEL}</h2>
              <p className="text-[15px] text-plum-muted leading-6">
                A separate subscription. While it is on, opening someone’s introduction does not put your name on their list. Nothing is charged now.
              </p>
            </div>
          </div>

          <p className="text-[13px] text-stone text-center">
            The price above is the price after the opening offer. If you save a card, the first membership payment is taken on 15 February 2027.
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
