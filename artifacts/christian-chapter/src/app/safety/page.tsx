import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { FOUNDING_MEMBER_COPY } from "@/lib/site-config";
import { Shield, AlertTriangle, Flag, FileText } from "lucide-react";

export const metadata = buildMetadata({
  title: "Safety at Mature Christian Dating",
  description:
    "How the Mature Christian Dating founding cohort is protected today, and which safety controls are still being built for later introductions.",
  path: "/safety",
});

const now = [
  {
    icon: FileText,
    title: "Confirmed email before an application is active",
    desc: "A founding application is not treated as active until the person confirms an email address they control. Unverified addresses cannot be presented as founding members.",
  },
  {
    icon: Shield,
    title: "Separate religious-data consent",
    desc: "Faith answers are special-category data. They are collected only after an explicit checkbox, recorded with a version and time, and can be withdrawn from the account page.",
  },
  {
    icon: Flag,
    title: "Human review of submitted applications",
    desc: "Administrators can read submitted founding applications, change status, and leave notes. That queue exists. It is not 24/7 member-to-member moderation.",
  },
];

const planned = [
  "Phone and selfie verification before messaging",
  "Duplicate-image detection and automated photo matching",
  "Romance-fraud pattern friction inside conversations",
  "Private relay calling that never shares your number",
  "In-product report from a live profile, message or call",
  "Automatic removal of long-inactive profiles from introductions",
];

export default function SafetyPage() {
  return (
    <>
      <section className="section bg-evergreen text-ivory pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/60 font-sans mb-5">
            Trust and safety
          </p>
          <h1 className="font-serif text-ivory mb-6">
            Safety is part of the product, not a footnote.
          </h1>
          <p className="text-[18px] text-ivory/80 leading-7 max-w-[580px]">
            Mature Christian Dating is currently a founding cohort, not a live
            introductions network. This page separates what already operates
            from what we are building.
          </p>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-plum mb-8">How the founding cohort is protected now</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {now.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-lg border border-border bg-ivory">
                <Icon size={22} className="text-evergreen mb-4" />
                <h3 className="font-sans font-semibold text-[17px] text-plum mb-2">{title}</h3>
                <p className="text-[15px] text-plum-muted leading-6">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-plum mb-4">Safety controls being built for member introductions</h2>
          <p className="text-[17px] text-plum-muted mb-8 leading-7 max-w-[640px]">
            These are design intent. They are not live, and we do not publish an
            operating response-time SLA until the corresponding product exists
            and is staffed.
          </p>
          <ul className="space-y-3">
            {planned.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-plum">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-oxblood flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-5">Warning signs of romance fraud</h2>
          <p className="text-[17px] text-plum-muted mb-7 leading-7">
            Romance fraud causes serious harm. Be alert to money, crypto, gift
            cards, emergency travel, visa requests and pressure to leave email
            for WhatsApp. If something feels wrong, stop and tell someone you trust.
          </p>
          <ul className="grid md:grid-cols-2 gap-3 mb-8">
            {[
              "Rapid declarations of love before you have met",
              "Requests for money, gift cards or cryptocurrency",
              "Encouragement to move off this site quickly",
              "Inconsistent details about age, location or profession",
              "Claims of a sudden emergency requiring financial help",
              "Reluctance to video call or meet in person",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-plum-muted">
                <AlertTriangle size={15} className="text-oxblood mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[15px] text-plum-muted leading-6">
            During the founding cohort, email {""}
            <a href="mailto:hello@christianchapter.co.uk" className="underline">
              hello@christianchapter.co.uk
            </a>{" "}
            to report concern. You can also contact{" "}
            <a
              href="https://www.actionfraud.police.uk"
              className="underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              Action Fraud
            </a>
            . In an emergency call 999.
          </p>
          <p className="mt-6">
            <a href="/guides/safety/romance-fraud" className="underline text-oxblood">
              Read the romance fraud guide →
            </a>
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-plum mb-5">Create your profile</h2>
          <p className="text-[17px] text-plum-muted mb-8 leading-7">{FOUNDING_MEMBER_COPY}</p>
          <LinkButton href="/register" size="lg" variant="trust">
            Create your profile
          </LinkButton>
        </div>
      </section>
    </>
  );
}
