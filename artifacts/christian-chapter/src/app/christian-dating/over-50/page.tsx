import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating over 50 — UK Christian singles in your 50s",
  description:
    "Christian Chapter helps Christians in their 50s meet someone who genuinely understands their faith, life and hopes for the next chapter. Considered UK introductions.",
  path: "/christian-dating/over-50",
});

export default function ChristianDatingOver50Page() {
  return (
    <>
      <section className="section bg-ivory pb-14">
        <div className="mx-auto max-w-4xl px-6">
          <nav className="text-[12px] text-stone mb-6 font-sans" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><a href="/" className="hover:text-plum">Home</a></li>
              <li className="text-mist">/</li>
              <li><a href="/christian-dating" className="hover:text-plum">Christian dating</a></li>
              <li className="text-mist">/</li>
              <li className="text-plum">In your 50s</li>
            </ol>
          </nav>
          <h1 className="font-serif text-plum mb-6">
            Christian dating<br />
            <em>in your 50s</em>
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[580px]">
            In your 50s, you have enough lived experience to know exactly what kind of relationship you want. Christian Chapter is built to help you find it — with clarity, nuance, and no wasted time.
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-plum text-3xl mb-5">The questions that matter at 50</h2>
            <div className="space-y-4 text-[16px] text-plum-muted leading-7">
              <p>
                By your 50s, the questions have changed. You&apos;re not wondering what kind of person you are — you know. You&apos;re wondering whether someone else has arrived at a similar place: in faith, in family, in what they want from the years ahead.
              </p>
              <p>
                Blended family dynamics, retirement horizons, housing situations, denomination openness, remarriage — these are the genuine compatibility questions that a dating app with twenty-character bios cannot address.
              </p>
              <p>
                Christian Chapter asks about them. Your profile covers faith tradition and importance, family situation, relationship intention, housing preferences, retirement plans and what faith looks like day to day.
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-plum text-3xl mb-5">What you can expect from us</h2>
            <div className="space-y-4 text-[16px] text-plum-muted leading-7">
              <p>
                Introductions in your 50s will often involve both people having adult or near-adult children from a previous relationship. Your profile captures how you feel about that — and how open you are to meeting someone in the same situation.
              </p>
              <p>
                We cover denomination openness explicitly: whether you need someone from the same tradition, a similar tradition, or whether you&apos;re open to meeting any committed Christian. This shapes introductions without imposing a judgment.
              </p>
              <p>
                Every introduction arrives with plain-language reasons explaining the alignment we saw. You can evaluate it thoughtfully, without pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-6">Life stage guidance</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                topic: "Blended families",
                content: "Many members in their 50s have children from a previous marriage. Your profile describes your situation and preferences around blended family life — and we only introduce you to people whose views are compatible.",
              },
              {
                topic: "Retirement horizons",
                content: "Whether you&apos;re approaching retirement, mid-career, or already retired shapes what a relationship could look like practically. We cover work and retirement status in the profile.",
              },
              {
                topic: "Remarriage",
                content: "Some members want a long-term committed relationship but not necessarily remarriage. Others feel strongly that remarriage is the right framing. We ask, and we respect the answer — it shapes introductions.",
              },
            ].map(({ topic, content }) => (
              <div key={topic} className="p-5 rounded-lg border border-border bg-ivory">
                <h3 className="font-sans font-semibold text-[15px] text-plum mb-3">{topic}</h3>
                <p className="text-[14px] text-plum-muted leading-6">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-6">Common questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "My children are mostly grown. Does that affect who I&apos;m matched with?",
                a: "You describe your family situation in full. We use it to find people whose situation is compatible with yours — not to judge it. Whether you have grown-up children, are a grandparent, or have no children, your profile reflects your reality.",
              },
              {
                q: "I&apos;m open to different denominations but not all. How do I handle that?",
                a: "You can set denomination preference as Essential (same tradition only), Preferred (shapes ranking), or Open-minded (worth discussing). You have full control — we don&apos;t override your choice.",
              },
              {
                q: "How do you handle the distance question for people in their 50s?",
                a: "Many members in their 50s have greater travel flexibility than they did earlier in life. You set your preferred radius, and you can also declare yourself open to travelling further where both people agree. We use actual travel bands, not straight-line distances.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-6 last:border-0 last:pb-0">
                <h3 className="font-sans font-semibold text-[16px] text-plum mb-2">{q}</h3>
                <p className="text-[15px] text-plum-muted leading-6">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-plum mb-5">Start your next chapter.</h2>
          <LinkButton href="/register" size="lg" variant="primary">Join free</LinkButton>
          <p className="mt-4 text-[13px] text-stone">Complete your profile in 10–12 minutes. Your progress is saved at every step.</p>
        </div>
      </section>
    </>
  );
}
