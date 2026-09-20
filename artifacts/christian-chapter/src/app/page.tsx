import { LinkButton } from "@/components/ui/button";
import { IntroductionDemo } from "@/components/home/introduction-demo";
import { Shield, CheckCircle, MapPin, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christian Chapter — UK Christian dating for your next chapter",
  description:
    "Christian dating for your next chapter. Meet genuine Christian singles aged 40–70 who share your faith, values and hopes for what comes next. UK-wide, considered introductions.",
  alternates: { canonical: "https://christianchapter.co.uk" },
};

const trustPillars = [
  {
    icon: Heart,
    label: "Faith-first introductions",
    desc: "Every introduction is based on genuine faith and life-stage compatibility — not an algorithm score.",
  },
  {
    icon: Shield,
    label: "Designed for this life stage",
    desc: "Profile questions, introduction logic and copy built for Christians in their 40s, 50s and 60s — not adapted from something younger.",
  },
  {
    icon: CheckCircle,
    label: "Your essentials respected",
    desc: "Set what matters most. We never show you someone who breaks a firm requirement you've set.",
  },
  {
    icon: MapPin,
    label: "UK-wide service",
    desc: "Open to Christian singles across England, Scotland, Wales and Northern Ireland.",
  },
];

const essentialTiers = [
  {
    tier: "Essential",
    colour: "text-oxblood",
    bg: "bg-oxblood-light border-oxblood/20",
    desc: "A firm boundary. We will never introduce you to someone who doesn't meet it.",
    example: "Non-smoker",
  },
  {
    tier: "Preferred",
    colour: "text-evergreen",
    bg: "bg-evergreen-light border-evergreen/20",
    desc: "Important to you. Introductions that match this are ranked higher.",
    example: "Same denomination",
  },
  {
    tier: "Open-minded",
    colour: "text-plum-muted",
    bg: "bg-ivory-dark border-border",
    desc: "Worth discussing. This difference won't reduce your recommendations.",
    example: "Has young children",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ivory">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, #1E1220 39px, #1E1220 40px)",
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-[700px]">
            <p className="text-[11px] uppercase tracking-[0.32em] text-oxblood font-sans mb-7">
              For Christian singles · 40–70 · UK-wide
            </p>
            <h1 className="font-serif text-plum leading-[1.05] mb-8">
              Christian dating for<br />
              <em className="not-italic text-oxblood">your next chapter.</em>
            </h1>
            <p className="text-[18px] text-plum-muted leading-7 mb-10 max-w-[540px]">
              Meet genuine Christian singles who share your faith, values and hopes for what comes next. Considered introductions — not endless swiping.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <LinkButton href="/register" size="lg" variant="primary">
                Join free as a founding member
              </LinkButton>
              <a
                href="/how-it-works"
                className="text-[14px] text-plum-muted hover:text-plum underline underline-offset-4 transition-colors"
              >
                See how introductions work →
              </a>
            </div>

            {/* Honest founding-phase signals */}
            <div className="mt-14 flex flex-wrap gap-6">
              {[
                "Christian-focused",
                "Faith-first introductions",
                "UK-wide",
                "Free during founding phase",
              ].map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-2 text-[13px] text-stone"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-evergreen inline-block" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* ── Approach ─────────────────────────────────────────────── */}
      <section className="bg-ivory section">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-5">
              The premise
            </p>
            <h2 className="font-serif text-plum mb-6">
              Not a marketplace.<br />
              <em>A considered beginning.</em>
            </h2>
            <div className="w-16 h-px bg-oxblood/40 mb-6" />
          </div>
          <div className="space-y-5 text-[17px] text-plum-muted leading-7">
            <p>
              At this stage of life, the question is rarely &ldquo;Who is available?&rdquo; It is &ldquo;Who might understand the shape of my life?&rdquo;
            </p>
            <p>
              We listen for the things that hold a relationship together: faith alignment, life stage, intentions, distance, and the values you want to live by. Then we introduce — not recommend.
            </p>
            <p>
              An introduction from Christian Chapter comes with a reason. You know why we thought this person was worth meeting, and you can decide from there.
            </p>
          </div>
        </div>
      </section>

      {/* ── Design pillars ────────────────────────────────────────── */}
      <section className="bg-ivory-dark section">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-8 text-center">
            How it&apos;s designed
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-ivory rounded-lg p-6 border border-border"
              >
                <Icon size={20} className="text-oxblood mb-4" />
                <h3 className="font-sans font-semibold text-[15px] text-plum mb-2">
                  {label}
                </h3>
                <p className="text-[14px] text-plum-muted leading-5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fictional introduction demo ───────────────────────────── */}
      <IntroductionDemo />

      {/* ── My Essentials ─────────────────────────────────────────── */}
      <section className="section bg-ivory">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-4">
              Your preferences, respected
            </p>
            <h2 className="font-serif text-plum mb-5">My Essentials</h2>
            <p className="text-[17px] text-plum-muted max-w-[520px] mx-auto leading-7">
              You decide what matters most. We never introduce you to someone who breaks an Essential. Preferred and Open-minded preferences shape the quality and ranking of introductions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {essentialTiers.map(({ tier, colour, bg, desc, example }) => (
              <div key={tier} className={`rounded-lg border p-6 ${bg}`}>
                <p className={`text-[11px] uppercase tracking-[0.22em] font-sans font-bold mb-3 ${colour}`}>
                  {tier}
                </p>
                <p className="text-[15px] text-plum leading-6 mb-4">{desc}</p>
                <div className="mt-auto pt-4 border-t border-current/10">
                  <span className="text-[13px] text-stone">Example: </span>
                  <span className={`text-[13px] font-medium ${colour}`}>{example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety ────────────────────────────────────────────────── */}
      <section className="section bg-evergreen text-ivory">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/60 font-sans mb-5">
                Built to be trustworthy
              </p>
              <h2 className="font-serif text-ivory mb-6">Safety is part of the product, not a footnote.</h2>
              <a
                href="/safety"
                className="text-[14px] text-ivory/70 hover:text-ivory underline underline-offset-4 transition-colors"
              >
                How we&apos;re designing for safety →
              </a>
            </div>
            <ul className="space-y-4">
              {[
                "Phone and selfie verification before introductions",
                "Profile and image review by our team",
                "Romance fraud pattern detection",
                "Private calling — your number is never shared",
                "Report from any profile or message in two taps",
                "Inactive profiles removed from introductions automatically",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ivory/85">
                  <CheckCircle size={16} className="mt-1 flex-shrink-0 text-ivory/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Founding member CTA ───────────────────────────────────── */}
      <section className="section bg-ivory">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-lg border border-evergreen/30 bg-evergreen-light p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-evergreen font-sans font-bold mb-3">
                Founding membership
              </p>
              <h2 className="font-serif text-plum text-3xl md:text-4xl mb-4">
                Free during the founding phase.
              </h2>
              <p className="text-[16px] text-plum-muted leading-6">
                We&apos;re building our founding community before introducing paid features. Join now, shape how the service develops, and receive founding-member pricing when paid tiers launch.
              </p>
            </div>
            <div className="space-y-4">
              <ul className="space-y-2.5">
                {[
                  "Complete your profile",
                  "Set your Essentials and preferences",
                  "Be first in line when introductions launch",
                  "Input on what paid tiers should include and cost",
                  "Founding-member pricing before public announcement",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14px] text-plum">
                    <CheckCircle size={14} className="text-evergreen mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <LinkButton href="/register" size="lg" variant="trust" fullWidth>
                Join as a founding member — free
              </LinkButton>
              <p className="text-[12px] text-stone text-center">
                No credit card. No trial period. We&apos;ll give advance notice before anything changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="section bg-ivory-dark border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-plum mb-5">
            Your next chapter<br />
            <em>starts with a conversation.</em>
          </h2>
          <p className="text-[17px] text-plum-muted mb-9 leading-7">
            Join free. Tell us about yourself and who you&apos;re hoping to meet. As the community grows, we&apos;ll look for genuine mutual connections and invite you both to consider an introduction.
          </p>
          <LinkButton href="/register" size="lg" variant="primary">
            Join Christian Chapter — free
          </LinkButton>
          <p className="mt-5 text-[13px] text-stone">
            We do not guarantee a match. We&apos;ll be in touch when we identify a promising mutual connection.
          </p>
        </div>
      </section>
    </>
  );
}
