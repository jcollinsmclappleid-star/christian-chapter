import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating over 60 — UK Christian singles in your 60s",
  description:
    "Christian dating in your 60s with Mature Christian Dating. A contemporary, accessible service designed for mature faith and genuine companionship. UK-wide introductions.",
  path: "/christian-dating/over-60",
});

export default function ChristianDatingOver60Page() {
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
              <li className="text-plum">In your 60s</li>
            </ol>
          </nav>
          <h1 className="font-serif text-plum mb-6">
            Christian dating<br />
            <em>in your 60s</em>
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[580px]">
            Security, companionship, travel, shared faith and the space to be yourself. In your 60s, you know what a good relationship looks like — and what it would add to your life. We help you find it.
          </p>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-plum text-3xl mb-5">What matters most at this stage</h2>
            <div className="space-y-4 text-[16px] text-plum-muted leading-7">
              <p>
                In your 60s, the emphasis often shifts. Security — emotional, practical, physical — matters more. The depth of a shared faith, the quality of daily life together, travel plans, grandchildren, wellbeing activities and a compatible social rhythm all become significant.
              </p>
              <p>
                For many members in their 60s, the question is not whether to enter a relationship — it&apos;s whether the right person is out there. Christianity remains the largest stated religion among this age group in the UK. The community exists. It needs a better way to find itself.
              </p>
              <p>
                Mature Christian Dating&apos;s profile covers the practical questions clearly: retirement status, mobility, travel openness, grandchildren, housing preferences, and what companionship and commitment mean to you.
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-plum text-3xl mb-5">An accessible platform, by design</h2>
            <div className="space-y-4 text-[16px] text-plum-muted leading-7">
              <p>
                Mature Christian Dating is designed to be straightforward to use. Large text, clear labels, plain language, and a format that explains what each step is for — and why we&apos;re asking.
              </p>
              <p>
                The platform is a contemporary web product that works on any device. There is no app required. Every action is described in plain terms, and the support team is available if anything is unclear.
              </p>
              <p>
                Safety features are visible and accessible: you can report or block from any screen in two steps, and you never need to reveal your phone number or email address to another member.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-5">Distance and geography in your 60s</h2>
          <div className="space-y-4 text-[16px] text-plum-muted leading-7 max-w-[620px]">
            <p>
              Many members in their 60s have greater geographic flexibility than earlier in life — retirement may mean the ability to relocate or to make longer journeys comfortably. Mature Christian Dating captures this.
            </p>
            <p>
              You set your preferred radius and whether you&apos;re open to travelling further where both people agree. You can also declare openness to relocation — long-term or exploratory — and this shapes your introduction pool. We use travel bands, not straight-line distances.
            </p>
            <p>
              Members in smaller cities, towns and rural areas are explicitly included. We use distance-flexible introductions to connect people who would be a genuine fit, even when they&apos;re farther apart.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-6">Questions from members in their 60s</h2>
          <div className="space-y-6">
            {[
              {
                q: "Is the platform easy to use if I&apos;m not particularly technical?",
                a: "Yes. The profile and introduction process are designed in plain, clear steps. Each section explains what it&apos;s for. Your progress is saved automatically. If you&apos;re unsure about anything, our support team is available to help — no question is too simple.",
              },
              {
                q: "I&apos;m a widower/widow. Is there guidance for my situation?",
                a: "We approach bereavement with care. Your profile has a dedicated section for relationship history. Our guidance on Christian dating after bereavement is available on this site. We do not treat this as a data point — it is part of your story.",
              },
              {
                q: "How do you protect members from scams?",
                a: "Romance fraud affects all age groups but is a particular concern for older users. We verify identity, detect fraud patterns in messaging, and provide clear in-product warnings about common scam approaches. Our safety page covers this in detail.",
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
          <h2 className="font-serif text-plum mb-5">Join Mature Christian Dating — free</h2>
          <LinkButton href="/register" size="lg" variant="primary">Start your profile</LinkButton>
          <p className="mt-4 text-[13px] text-stone">Takes around 10–12 minutes. We&apos;ll save your progress at every step.</p>
        </div>
      </section>
    </>
  );
}
