import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to Christian Chapter",
  robots: { index: false, follow: false },
};

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        {/* Wordmark */}
        <div className="mb-16 text-center">
          <p className="font-serif text-plum text-xl tracking-tight">Christian Chapter</p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone mt-1 font-sans">
            Christian dating for your next chapter.
          </p>
        </div>

        {/* Welcome heading */}
        <div className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.3em] text-oxblood font-sans mb-6">
            Welcome to the community
          </p>
          <h1 className="font-serif text-plum mb-6">
            You&rsquo;re a founding member.
          </h1>
          <p className="text-[18px] text-plum-muted leading-8 max-w-[560px] mx-auto">
            Your profile is with us. As our founding community grows, we&rsquo;ll
            be looking for genuine mutual connections — and we&rsquo;ll be in touch
            when we think there&rsquo;s someone worth introducing you to.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-14" />

        {/* What happens next — 3 steps */}
        <div className="mb-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-10 text-center">
            What happens next
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Profile review",
                body: "Our team reviews each profile before it enters introductions. We&rsquo;ll let you know if there&rsquo;s anything we need.",
              },
              {
                num: "02",
                title: "We look for alignment",
                body: "As the community grows, we search for people whose faith, life stage and intentions genuinely align with yours.",
              },
              {
                num: "03",
                title: "An invitation to connect",
                body: "When we find a promising connection, we invite you both to consider an introduction. The choice is always yours.",
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="border-t-2 border-oxblood/30 pt-5">
                <p className="font-serif text-oxblood text-3xl mb-4">{num}</p>
                <h3 className="font-sans font-semibold text-[15px] text-plum mb-2">
                  {title}
                </h3>
                <p
                  className="text-[14px] text-plum-muted leading-6"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-12" />

        {/* Referral */}
        <div className="mb-14 text-center">
          <p className="text-[16px] text-plum mb-3">
            Know a Christian friend who might appreciate a different kind of dating?
          </p>
          <a
            href="/"
            className="text-[14px] text-oxblood underline underline-offset-4 hover:text-oxblood-hover transition-colors"
          >
            Share Christian Chapter →
          </a>
        </div>

        {/* Honest note */}
        <div className="bg-ivory-dark rounded-lg border border-border px-6 py-5 text-center mb-12">
          <p className="text-[13px] text-plum-muted leading-6">
            We don&rsquo;t guarantee a match. We do promise to be thoughtful, honest, and unhurried — and to be in touch when we identify someone genuinely worth introducing you to.
          </p>
        </div>

        {/* Return home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-[14px] text-plum-muted underline underline-offset-4 hover:text-plum transition-colors"
          >
            ← Return to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
