import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { Heart } from "lucide-react";

export const metadata = buildMetadata({
  title: "Success stories — Mature Christian Dating",
  description:
    "Real stories from Mature Christian Dating members who found meaningful relationships. We publish stories only with full, granular consent.",
  path: "/success-stories",
});

export default function SuccessStoriesPage() {
  return (
    <>
      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[11px] uppercase tracking-[0.28em] text-oxblood font-sans mb-5">
            Success stories
          </p>
          <h1 className="font-serif text-plum mb-6">
            Meaningful connections,<br />
            <em>in their own words.</em>
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[560px]">
            We publish real stories only with the full, specific consent of everyone involved. As our community grows and people share their outcomes, their stories will appear here.
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-lg border border-border bg-ivory p-10 text-center max-w-xl mx-auto">
            <Heart size={28} className="text-oxblood/40 mx-auto mb-5" />
            <h2 className="font-serif text-plum text-2xl mb-4">Stories coming soon</h2>
            <p className="text-[16px] text-plum-muted leading-6 mb-6">
              Mature Christian Dating is in its founding phase. We&apos;re building a community of genuine connections, and as members share their outcomes with us — and give their explicit consent to be featured — their stories will appear on this page.
            </p>
            <p className="text-[14px] text-stone">
              We do not fabricate or paraphrase testimonials. Every story is published as written, with the member&apos;s knowledge and consent, and can be withdrawn at any time.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-5">What we measure</h2>
          <div className="space-y-4 text-[17px] text-plum-muted leading-7 max-w-[580px]">
            <p>
              Our measure of success is not how many messages are sent. It is how many members reach a genuine, substantive conversation with a compatible person and feel the experience was safe and worthwhile. That is what we optimise for.
            </p>
            <p>
              We plan to track introductions viewed, mutual interest rates, first-conversation rates and, with consent, relationship outcomes — and to publish summaries of these as the service matures. We&apos;ll tell members when and how we do that.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ivory-dark border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-plum mb-5">Be part of the first chapter.</h2>
          <p className="text-[17px] text-plum-muted mb-8 leading-7">
            Join now as a founding member and help build a community where stories like this become possible.
          </p>
          <LinkButton href="/register" size="lg" variant="primary">
            Join free
          </LinkButton>
        </div>
      </section>
    </>
  );
}
