import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { Shield, Eye, Phone, AlertTriangle, MessageCircle, Flag } from "lucide-react";

export const metadata = buildMetadata({
  title: "Safety at Christian Chapter",
  description:
    "How Christian Chapter is designed to keep members safe — verification, moderation, fraud detection, private calling, and how to report. Safety is part of the product, not a footnote.",
  path: "/safety",
});

const safetyPillars = [
  {
    icon: Shield,
    title: "Verification before introductions",
    desc: "Email and mobile verification are required before a profile enters introductions. Photo and selfie-liveness checks are required before messaging. We check that your profile photo matches your selfie.",
  },
  {
    icon: Eye,
    title: "Profile and image review",
    desc: "Every profile is reviewed by our team before it becomes active. Photos are checked for authenticity and appropriateness. Duplicate or stolen images are flagged automatically.",
  },
  {
    icon: AlertTriangle,
    title: "Romance fraud protection",
    desc: "Patterns associated with romance fraud — rapid declarations of love, requests for money or gifts, encouragement to leave the platform, inconsistent age or location — trigger automatic friction and human review.",
  },
  {
    icon: Phone,
    title: "Private calling",
    desc: "Audio and video calls use relay infrastructure. Your phone number and email address are never revealed to another member. You can block or report instantly during a call.",
  },
  {
    icon: Flag,
    title: "Easy reporting",
    desc: "You can report from any profile, message or call in two actions. You can block without reporting. We acknowledge all reports and apply our enforcement process consistently.",
  },
  {
    icon: MessageCircle,
    title: "Image safety",
    desc: "Image sharing in conversations is disabled by default. When enabled after explicit mutual consent, every image is scanned before delivery and appears blurred until the recipient chooses to reveal it.",
  },
];

const responseTargets = [
  { type: "Credible imminent harm or active extortion", target: "Within 15 minutes during staffed hours" },
  { type: "Suspected romance fraud or unsolicited sexual content", target: "Within 1 hour" },
  { type: "Profile, photo and conduct reports", target: "Within 24 hours" },
  { type: "Appeals", target: "Acknowledged within 24 hours, decision within 5 working days" },
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
            The way Christian Chapter is designed and will operate is meant to make you feel safe — not to list safety features in small print.
          </p>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {safetyPillars.map(({ icon: Icon, title, desc }) => (
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
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-3">Planned response time targets</h2>
          <p className="text-[17px] text-plum-muted mb-4 leading-7">
            When you report something, we aim to respond within the following timeframes. These are designed targets — we&apos;ll publish actual performance against them as the service matures.
          </p>
          <p className="text-[14px] text-stone mb-8">
            These are aspirational targets set during design. We will update this page with actual response data once we are operating at scale.
          </p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-ivory border-b border-border">
                  <th className="text-left px-5 py-3 font-sans font-semibold text-plum">Report type</th>
                  <th className="text-left px-5 py-3 font-sans font-semibold text-plum">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-ivory">
                {responseTargets.map(({ type, target }) => (
                  <tr key={type}>
                    <td className="px-5 py-4 text-plum">{type}</td>
                    <td className="px-5 py-4 text-plum-muted">{target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-5">Warning signs of romance fraud</h2>
          <p className="text-[17px] text-plum-muted mb-7 leading-7">
            Romance fraud causes serious harm. We build detection into the product, but awareness matters too. Be alert to:
          </p>
          <ul className="grid md:grid-cols-2 gap-3">
            {[
              "Rapid declarations of love before you have met",
              "Requests for money, gift cards or cryptocurrency",
              "Encouragement to move to WhatsApp or another platform quickly",
              "Inconsistent details about age, location or profession",
              "Claims of a sudden emergency requiring financial help",
              "Reluctance to video call or meet in person",
              "Pressure or urgency around financial decisions",
              "Profiles with very few photos, all professionally taken",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-plum-muted">
                <AlertTriangle size={15} className="text-oxblood mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px] text-plum-muted leading-6">
            If something feels wrong, report it immediately using the report button on any profile or message. You can also contact{" "}
            <a
              href="https://www.actionfraud.police.uk"
              className="underline underline-offset-2 hover:text-plum"
              target="_blank"
              rel="noreferrer noopener"
            >
              Action Fraud
            </a>{" "}
            at any time.
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-plum mb-5">Join with confidence.</h2>
          <p className="text-[17px] text-plum-muted mb-8 leading-7">
            Safety shaped the design from the start. Join free as a founding member.
          </p>
          <LinkButton href="/register" size="lg" variant="trust">
            Join free
          </LinkButton>
        </div>
      </section>
    </>
  );
}
