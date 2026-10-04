import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { CONCIERGE_PRICE_LABEL, MEMBER_PRICE_LABEL, OPENING_OFFER_ENDS_LABEL, siteConfig } from "@/lib/site-config";
import { CheckCircle } from "lucide-react";

export const metadata = buildMetadata({
  title: "Pricing — Mature Christian Dating",
  description: `Mature Christian Dating is free until ${OPENING_OFFER_ENDS_LABEL}. After that the member price is ${MEMBER_PRICE_LABEL}. A concierge introduction, ${CONCIERGE_PRICE_LABEL}, is included free until matching technology opens. No payment is taken during the opening offer.`,
  path: "/pricing",
});

const foundingBenefits = [
  "Complete your full profile",
  "Set your Essentials, Preferred and Open-minded preferences",
  "Matching technology opens on 14 February 2027",
  `A personal concierge introduction, ${CONCIERGE_PRICE_LABEL}, included free until then`,
  "No card is taken during the opening offer",
];

const faqs = [
  {
    q: "Is it really free right now?",
    a: "Yes. Founding membership is free. Payment is not open, and no card is taken.",
  },
  {
    q: "What does it cost after that?",
    a: `Membership is planned at ${MEMBER_PRICE_LABEL} from 15 February 2027. Billing is not switched on, so no card is taken now.`,
  },
  {
    q: "What is the concierge offer?",
    a: `It is a temporary extra, not the service itself. Until ${OPENING_OFFER_ENDS_LABEL} a matchmaker may hand-pick an introduction. That concierge is ${CONCIERGE_PRICE_LABEL}, and founding members receive it free. Matching technology opens on ${OPENING_OFFER_ENDS_LABEL}.`,
  },
  {
    q: "When does matching go live?",
    a: `Matching technology goes live on ${OPENING_OFFER_ENDS_LABEL}. Until then, a matchmaker may hand-pick an introduction for founding members. It is not a guarantee of a match.`,
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
            Christian dating for adults aged 40 and over. Join free until {OPENING_OFFER_ENDS_LABEL}, when matching technology goes live. Membership is then {MEMBER_PRICE_LABEL}. Until that date, a personal concierge introduction — {CONCIERGE_PRICE_LABEL} — is included at no charge. No card is taken now.
          </p>
        </div>
      </section>

      {/* Founding membership */}
      <section className="section bg-ivory-dark pt-8">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <div className="rounded-lg border border-evergreen/30 bg-evergreen-light p-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-evergreen font-sans font-bold mb-3">
                Until {OPENING_OFFER_ENDS_LABEL}
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-serif text-5xl text-plum">Free</span>
              </div>
              <p className="text-[15px] text-plum-muted leading-6 mb-6">
                Create your profile at no charge. A personal concierge introduction, priced at {CONCIERGE_PRICE_LABEL}, is included. No card is taken.
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
            <div className="rounded-lg border border-border bg-paper p-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-life font-sans font-bold mb-3">
                From 15 February 2027
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-serif text-5xl text-plum">{MEMBER_PRICE_LABEL.replace(" a month", "")}</span>
                <span className="text-[15px] text-stone">a month</span>
              </div>
              <p className="text-[15px] text-plum-muted leading-6">
                This is the dating membership, when matching technology is live. It sits with other UK dating subscriptions. Billing is not switched on, so nothing is charged today. The concierge extra ends when matching opens.
              </p>
            </div>
          </div>

          <p className="text-[13px] text-stone text-center">
            Payment is not open. Founding membership is free.
            {siteConfig.vatRegistered
              ? " Published prices include UK VAT where applicable."
              : " Ianson Systems Limited is not VAT registered."}
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
