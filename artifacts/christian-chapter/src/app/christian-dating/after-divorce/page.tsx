import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating after divorce — a thoughtful guide",
  description:
    "A sensitive, practical guide to Christian dating after divorce. Questions of faith, readiness and finding someone who understands your history — from Christian Chapter.",
  path: "/christian-dating/after-divorce",
});

export default function ChristianDatingAfterDivorcePage() {
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
              <li className="text-plum">After divorce</li>
            </ol>
          </nav>
          <h1 className="font-serif text-plum mb-6">
            Christian dating<br />
            <em>after divorce</em>
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[580px]">
            Divorce is one of the most difficult experiences a person goes through. Meeting someone new afterwards — while navigating your faith, your children, your church community and your own readiness — is a genuinely complex thing. This guide is for people who are seriously considering it.
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-ivory rounded-lg border border-border p-7 mb-10 max-w-2xl">
            <p className="text-[13px] uppercase tracking-[0.2em] text-stone font-sans mb-3">A note on this guide</p>
            <p className="text-[15px] text-plum-muted leading-6">
              Christians hold a range of views on divorce and remarriage. This guide does not take a denominational position on those questions. It addresses the practical and emotional experience of dating again after divorce, and how Christian Chapter approaches it — respectfully, and without judgment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-plum text-3xl mb-5">The questions people actually ask</h2>
              <div className="space-y-4 text-[16px] text-plum-muted leading-7">
                <p>
                  Am I ready? Will people in my church judge me? How do I talk about my previous marriage? How do I meet someone who understands what I&apos;ve been through? Will my children accept someone new?
                </p>
                <p>
                  These are real questions, and there are no universal answers. But they are worth naming — because the people who ask them deserve a service that takes them seriously.
                </p>
                <p>
                  Christian Chapter allows you to describe your situation honestly in your profile. Your relationship history is part of your story, not a disqualifying factor.
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-plum text-3xl mb-5">Readiness is personal</h2>
              <div className="space-y-4 text-[16px] text-plum-muted leading-7">
                <p>
                  There is no timeline for being ready to meet someone new after divorce. Grief, anger, relief and hope can coexist. Some people know after a year that they want to try again. Others take much longer.
                </p>
                <p>
                  If you&apos;re wondering whether you&apos;re ready, it may help to ask: can I describe clearly what I&apos;m looking for, and approach a new relationship without expecting it to repair what the previous one damaged? That is probably the more useful question than how much time has passed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-6">How Christian Chapter handles this</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                heading: "Your status is your own",
                content: "You describe your relationship history in your profile. Divorced, separated and living apart, annulled — these are options. Your status is not made public by default. You control what is visible and to whom.",
              },
              {
                heading: "Your preferences around remarriage",
                content: "Whether you&apos;re open to remarriage, committed to it, or looking for companionship without formal commitment — you set this, and it shapes your introductions. We don&apos;t assume.",
              },
              {
                heading: "Denomination and remarriage views",
                content: "Some traditions have specific views on remarriage after divorce. You can indicate your own position and set denomination openness accordingly — Essential, Preferred, or Open-minded.",
              },
              {
                heading: "Transparency about children",
                content: "If you have children, their ages and living arrangements are part of your profile. Potential partners know what they&apos;re considering. You can set preferences around meeting someone in a similar situation.",
              },
            ].map(({ heading, content }) => (
              <div key={heading} className="p-5 rounded-lg border border-border bg-ivory">
                <h3 className="font-sans font-semibold text-[15px] text-plum mb-2">{heading}</h3>
                <p className="text-[14px] text-plum-muted leading-6">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-plum mb-6">Practical guidance</h2>
          <div className="space-y-5 text-[16px] text-plum-muted leading-7">
            <p>
              <strong className="text-plum font-medium">Be honest about your history in your profile.</strong> Not exhaustively — you don&apos;t owe anyone the full story before you&apos;ve met. But describe your situation clearly. It builds trust and ensures you meet people who are already comfortable with your circumstances.
            </p>
            <p>
              <strong className="text-plum font-medium">Be clear about what you&apos;re looking for.</strong> If you want a long-term committed relationship, say so. If you&apos;re open to remarriage or not yet sure, say that. Clarity saves everyone time and prevents misunderstanding.
            </p>
            <p>
              <strong className="text-plum font-medium">Don&apos;t rush the question of introducing children.</strong> There is no rule, but most people who navigate blended family situations well move slowly. Meeting someone who is right for you is the first step — the family question comes much later.
            </p>
            <p>
              <strong className="text-plum font-medium">Consider the church question separately.</strong> How your church community responds to you dating again is a separate question from whether dating is right for you. Conflating the two can lead to either guilt that isn&apos;t warranted, or decisions driven by community pressure rather than your own convictions.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ivory border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-plum mb-5">When you&apos;re ready, we&apos;re here.</h2>
          <p className="text-[17px] text-plum-muted mb-8 leading-7">Join free. Complete your profile at your own pace. We&apos;ll look for genuine, compatible introductions when you&apos;re ready.</p>
          <LinkButton href="/register" size="lg" variant="primary">Start your profile</LinkButton>
        </div>
      </section>
    </>
  );
}
