import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { Clock, UserCheck, MessageSquare, Heart } from "lucide-react";

export const metadata = buildMetadata({
  title: "How Christian Chapter works",
  description:
    "Christian Chapter uses considered introductions — not swiping or endless browsing. Learn how we introduce Christian singles based on faith, life stage, intentions and practical compatibility.",
  path: "/how-it-works",
});

const steps = [
  {
    icon: UserCheck,
    step: "1",
    title: "Tell us about yourself",
    desc: "Complete your profile — your faith, your life now, your hopes for what comes next. We ask about the things that genuinely shape a relationship: church attendance, family situation, intentions, and distance. It takes around 10–12 minutes.",
  },
  {
    icon: Heart,
    step: "2",
    title: "Set your Essentials",
    desc: "For each compatibility factor, choose Essential (a firm boundary we respect), Preferred (shapes the quality of introductions), or Open-minded (worth discussing, won't reduce recommendations). You stay in control. We never override an Essential.",
  },
  {
    icon: MessageSquare,
    step: "3",
    title: "Receive considered introductions",
    desc: "We send a small set of introductions on a regular cadence — not an endless feed. Each introduction comes with plain-language reasons: why we thought it was worth your time. No compatibility percentages, no algorithmic mystery.",
  },
  {
    icon: Clock,
    step: "4",
    title: "Respond at your pace",
    desc: "Express interest, save for later, or decline — no reason required. If interest is mutual, you move into a private conversation. We encourage thoughtful first messages and provide prompts drawn from your shared profile detail.",
  },
];

const activityStates = [
  { state: "Active now", rule: "Activity in last 24 hours", behaviour: "Can appear prominently in introductions" },
  { state: "Active recently", rule: "Active 2–7 days ago", behaviour: "Normal introductions" },
  { state: "Active this month", rule: "Active 8–30 days ago", behaviour: "Eligible with lower freshness weighting" },
  { state: "Taking a break", rule: "Member selected", behaviour: "Hidden immediately — conversations preserved" },
  { state: "Inactive", rule: "46+ days without activity", behaviour: "Removed from new introductions after reminder notices" },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-ivory section pb-14">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-5">
            The approach
          </p>
          <h1 className="font-serif text-plum mb-6">
            How Christian Chapter works
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[580px]">
            Introductions based on faith, life stage and intention — not an algorithm score. Here is what to expect.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-ivory-dark section">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-12">
            {steps.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="grid md:grid-cols-[60px_1fr] gap-6 items-start">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-oxblood-light border border-oxblood/20 flex items-center justify-center">
                    <Icon size={20} className="text-oxblood" />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-stone font-sans">{step}</span>
                </div>
                <div>
                  <h2 className="font-sans font-semibold text-[20px] text-plum mb-3">{title}</h2>
                  <p className="text-[17px] text-plum-muted leading-7">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity policy */}
      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-3">Only active members in your introductions</h2>
          <p className="text-[17px] text-plum-muted mb-3 leading-7">
            One of the most common frustrations with dating services is reaching out and hearing nothing — often because the person stopped using the service. The following policy is how Christian Chapter is designed to work from launch.
          </p>
          <p className="text-[14px] text-stone mb-8">
            This is the planned activity policy, not a description of current operating state during the founding phase.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-ivory-dark border-b border-border">
                  <th className="text-left px-5 py-3 font-sans font-semibold text-plum">Status</th>
                  <th className="text-left px-5 py-3 font-sans font-semibold text-plum">Activity</th>
                  <th className="text-left px-5 py-3 font-sans font-semibold text-plum">What this means</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activityStates.map(({ state, rule, behaviour }) => (
                  <tr key={state} className="bg-ivory">
                    <td className="px-5 py-3 font-medium text-plum">{state}</td>
                    <td className="px-5 py-3 text-plum-muted">{rule}</td>
                    <td className="px-5 py-3 text-plum-muted">{behaviour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-stone mt-4">
            Members receive reminder notices before any automatic hiding. Logging in alone does not confirm availability — we look at meaningful activity signals.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-ivory-dark border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-plum mb-5">Ready to begin?</h2>
          <p className="text-[17px] text-plum-muted mb-8 leading-7">
            Begin your application. We&apos;ll be in touch when introductions are ready.
          </p>
          <LinkButton href="/register" size="lg" variant="primary">
            Begin your application
          </LinkButton>
        </div>
      </section>
    </>
  );
}
