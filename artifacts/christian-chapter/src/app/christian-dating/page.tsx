import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Christian dating UK — meet genuine Christian singles",
  description:
    "Christian Chapter is a UK dating service for genuine Christian singles aged 40–70. Considered introductions based on faith, life stage and intention — not swiping or endless browsing.",
  path: "/christian-dating",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christianchapter.co.uk";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Christian Chapter",
  url: siteUrl,
  description:
    "UK Christian dating service for singles aged 40–70. Considered introductions based on faith, life stage and intention.",
  areaServed: "GB",
  knowsAbout: ["Christian dating", "Christian singles", "UK dating", "Faith-based relationships"],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Christian dating", item: `${siteUrl}/christian-dating` },
  ],
};

const faqs = [
  {
    q: "What makes Christian Chapter different from other Christian dating services?",
    a: "Christian Chapter uses considered introductions rather than a browseable marketplace. We match based on faith alignment, life stage, intentions, family situation and practical distance — not just denomination. Every introduction comes with plain-language reasons. We remove inactive profiles so you only meet people who are genuinely available.",
  },
  {
    q: "Do I have to be a regular churchgoer to join?",
    a: "No. Christian Chapter is for people whose faith is meaningful to them and who want a partner who shares that faith — regardless of how they express it. Members range from weekly churchgoers to those with a private, daily faith. You set your own faith profile and preferences.",
  },
  {
    q: "What age range is Christian Chapter for?",
    a: "The service is designed for Christians primarily aged 40–70, though anyone 18 or over may join. The introduction system, profile questions and copy are designed with this life stage in mind — not as an afterthought.",
  },
  {
    q: "Is it free to join?",
    a: "Yes. Creating a profile and seeing how introductions work is free. A paid Member or Plus plan is needed to send and receive introductions and have unlimited conversations.",
  },
  {
    q: "How do you handle inactive members?",
    a: "Profiles inactive for 46 or more days are automatically removed from new introductions after reminder notices. This means you spend less time reaching out to people who are no longer engaging.",
  },
  {
    q: "Is my faith data kept private?",
    a: "Yes. Your denomination, church details and faith profile are never shared publicly by default. We process religious belief data under explicit consent, separately captured at registration. You control what is visible to other members.",
  },
];

export default function ChristianDatingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="section bg-ivory pb-14">
        <div className="mx-auto max-w-4xl px-6">
          <nav className="text-[12px] text-stone mb-6 font-sans" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><a href="/" className="hover:text-plum transition-colors">Home</a></li>
              <li className="text-mist">/</li>
              <li className="text-plum">Christian dating</li>
            </ol>
          </nav>
          <h1 className="font-serif text-plum mb-6">
            Christian dating in the UK
          </h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[620px] mb-8">
            Christian Chapter is a UK dating service for genuine Christian singles. We introduce people based on faith, life stage, intentions and the practicalities of real life — not an algorithm score.
          </p>
          <LinkButton href="/register" size="lg" variant="primary">
            Join free
          </LinkButton>
        </div>
      </section>

      {/* Audience statement */}
      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-plum mb-5">Who Christian Chapter is for</h2>
            <div className="space-y-4 text-[16px] text-plum-muted leading-7">
              <p>
                Christian Chapter is designed for Christians in the UK who are serious about finding a meaningful relationship — and who want faith compatibility to be part of it.
              </p>
              <p>
                The service is designed primarily for adults in their 40s, 50s and 60s: people who have clarity about who they are, what they believe, and what they&apos;re looking for in a relationship. That clarity deserves a service built around it.
              </p>
              <p>
                You don&apos;t have to be a regular churchgoer. You do need faith to be genuinely important to you and to the relationship you&apos;re looking for.
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-plum mb-5">How introductions work</h2>
            <div className="space-y-4 text-[16px] text-plum-muted leading-7">
              <p>
                You complete a profile covering your faith, your life now, and your hopes for what comes next. You set Essentials — preferences that are firm requirements — and Preferred factors that shape the quality of introductions.
              </p>
              <p>
                We send three to seven introductions at a time, on a known cadence. Each comes with plain-language reasons: faith alignment, shared intentions, compatible life stage. No percentage, no score.
              </p>
              <p>
                You express interest, save for later, or decline — no reason required. If interest is mutual, you move to a private conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activity and safety policy */}
      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-5">Only active, verified members in your introductions</h2>
          <div className="space-y-4 text-[16px] text-plum-muted leading-7 max-w-[620px]">
            <p>
              A common frustration with dating services is reaching out and hearing nothing — not because the person isn&apos;t interested, but because they stopped using the service months ago.
            </p>
            <p>
              Christian Chapter removes profiles from introductions after 46 days of inactivity. Members receive reminder notices before this happens. This means the people you see are genuinely available and engaged.
            </p>
            <p>
              Verification is required before introductions. Phone and selfie-liveness checks confirm that members are who they say they are.
            </p>
          </div>
        </div>
      </section>

      {/* Age audience links */}
      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-8">Christian dating by life stage</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: "/christian-dating/over-40", label: "Christian dating in your 40s", desc: "Life has changed. New clarity about what — and who — matters." },
              { href: "/christian-dating/over-50", label: "Christian dating in your 50s", desc: "The commercial centre of the platform. Depth, nuance and genuine compatibility." },
              { href: "/christian-dating/over-60", label: "Christian dating in your 60s", desc: "Security, companionship and shared values for the years ahead." },
              { href: "/christian-dating/after-divorce", label: "Christian dating after divorce", desc: "A sensitive, thoughtful guide to meeting someone new." },
              { href: "/christian-dating/after-bereavement", label: "Christian dating after bereavement", desc: "Grief, hope and the possibility of a second chapter." },
            ].map(({ href, label, desc }) => (
              <a
                key={href}
                href={href}
                className="block p-5 rounded-lg border border-border bg-ivory hover:border-oxblood/30 transition-colors group"
              >
                <h3 className="font-sans font-semibold text-[15px] text-plum mb-2 group-hover:text-oxblood transition-colors">
                  {label}
                </h3>
                <p className="text-[14px] text-plum-muted leading-5">{desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-ivory">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-plum mb-10">Frequently asked questions</h2>
          <div className="space-y-7">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-7 last:border-0 last:pb-0">
                <h3 className="font-sans font-semibold text-[16px] text-plum mb-2">{q}</h3>
                <p className="text-[15px] text-plum-muted leading-6">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-ivory-dark border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-plum mb-5">
            Begin with a profile. No credit card needed.
          </h2>
          <LinkButton href="/register" size="lg" variant="primary">
            Join Christian Chapter — free
          </LinkButton>
        </div>
      </section>
    </>
  );
}
