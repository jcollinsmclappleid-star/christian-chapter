import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating over 40 — UK Christian singles in your 40s",
  description:
    "Christian Chapter helps Christians in their 40s meet people who share their faith, intentions and life stage. Considered introductions, not swiping. Join free.",
  path: "/christian-dating/over-40",
});

export default function ChristianDatingOver40Page() {
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
              <li className="text-plum">In your 40s</li>
            </ol>
          </nav>
          <h1 className="font-serif text-plum mb-6">
            Christian dating<br />
            <em>in your 40s</em>
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[580px]">
            Life has changed. You know more clearly what you believe, what you want, and what kind of relationship would actually work. Christian Chapter is built around that clarity — not against it.
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-2 gap-12">
          <div className="space-y-5 text-[16px] text-plum-muted leading-7">
            <h2 className="font-serif text-plum text-3xl mb-4">What your 40s actually look like</h2>
            <p>
              In your 40s, you may have children still at home, a demanding career, custody arrangements, or a life that simply doesn&apos;t fit neatly around dating apps designed for people twenty years younger.
            </p>
            <p>
              The questions you have aren&apos;t about finding anyone — they&apos;re about finding someone whose faith is real, whose intentions are clear, and whose life could realistically fit with yours.
            </p>
            <p>
              That might mean someone who understands custody schedules. Someone who is clear about whether they want more children. Someone who shares your commitment to faith without needing it to look identical to yours.
            </p>
          </div>
          <div className="space-y-5 text-[16px] text-plum-muted leading-7">
            <h2 className="font-serif text-plum text-3xl mb-4">How we approach your life stage</h2>
            <p>
              Christian Chapter&apos;s profile covers the things that matter at this stage: dependent children, openness to future children, work patterns, custody arrangements, distance flexibility and faith expectations in a partner.
            </p>
            <p>
              You set Essentials — the preferences that are firm requirements — and we never introduce you to someone who breaks them. If you need a non-smoker, you see non-smokers. If a partner&apos;s faith is essential, every introduction shares that.
            </p>
            <p>
              Introductions come with plain-language reasons. You can see why we thought it was worth your time before deciding whether to respond.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-6">What we don&apos;t do</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { no: "We don't call you mature, older or senior.", yes: "We describe you by what you&apos;re looking for — a meaningful relationship with someone who shares your faith and values." },
              { no: "We don't show you people who break your firm requirements.", yes: "We respect your Essentials completely. You set them, we honour them." },
              { no: "We don't keep inactive profiles circulating.", yes: "Members who stop engaging are removed from introductions automatically." },
              { no: "We don't give you an endless feed to scroll.", yes: "You receive a manageable set of considered introductions on a known cadence." },
            ].map(({ no, yes }) => (
              <div key={no} className="rounded-lg border border-border bg-ivory p-5">
                <p className="text-[14px] text-oxblood mb-2 font-medium">✕ {no}</p>
                <p className="text-[14px] text-plum-muted">✓ {yes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-6">Common questions from Christians in their 40s</h2>
          <div className="space-y-6">
            {[
              {
                q: "I have children at home. Is Christian Chapter realistic for me?",
                a: "Yes. Many members in their 40s have dependent children. Your profile covers family situation fully, and you can set your preferences around meeting someone who is comfortable with your circumstances. We never show you someone who would be a poor fit on this.",
              },
              {
                q: "I'm not sure whether I want more children. How do I handle that?",
                a: "Be honest in your profile — it&apos;s the best approach. You can mark this as Open-minded, which means it won&apos;t exclude you from introductions but will surface it as a 'worth discussing' point.",
              },
              {
                q: "I'm recently divorced. Is it too soon to join?",
                a: "That is a personal decision we leave to you. We ask that members describe their status honestly — and that separated members are living separately and are transparent about their situation. Research suggests the community has a range of views on this, which is why we keep it as a preference you can set, not a platform rule.",
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
          <h2 className="font-serif text-plum mb-5">Join free. No card needed.</h2>
          <LinkButton href="/register" size="lg" variant="primary">Start your profile</LinkButton>
          <p className="mt-4 text-[13px] text-stone">Takes around 10–12 minutes. Your progress is saved at every step.</p>
        </div>
      </section>
    </>
  );
}
