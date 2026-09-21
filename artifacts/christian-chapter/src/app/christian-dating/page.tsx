import { LinkButton } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Christian dating UK — meet genuine Christian singles",
  description:
    "Mature Christian Dating is a UK dating service for genuine Christian singles aged 40–70. Considered introductions based on faith, life stage and intention — not swiping or endless browsing.",
  path: "/christian-dating",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christianchapter.co.uk";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mature Christian Dating",
  url: siteUrl,
  description:
    "UK founding cohort for Christian dating for adults aged 40 and over. Applications and review exist; member introductions are not live.",
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
    q: "What makes Mature Christian Dating different from other Christian dating services?",
    a: "The product is designed around considered introductions rather than a browseable marketplace: faith, life stage, intentions and practical distance. That matching is not live yet. Today you can complete a founding application for a UK cohort of adults aged 40 and over.",
  },
  {
    q: "Do I have to be a regular churchgoer to join?",
    a: "No. Mature Christian Dating is for people whose faith is meaningful to them and who want a partner who shares that faith. The founding application asks how you practise. Those answers are not shown to other members today.",
  },
  {
    q: "What age range is Mature Christian Dating for?",
    a: "The founding cohort is for adults aged 40 and over. There is no maximum age. The application, questions and copy are written for this life stage.",
  },
  {
    q: "Is it free to join?",
    a: "Yes. During the founding phase, joining and submitting an application is free. Paid Member or Plus plans are not on sale. We will tell founding applicants before anything changes.",
  },
  {
    q: "How do you handle inactive members?",
    a: "When introductions launch, the product is designed to remove long-inactive profiles after reminder notices. That behaviour is not operating yet because introductions are not live.",
  },
  {
    q: "Is my faith data kept private?",
    a: "Religious-belief answers are collected only after a separate explicit consent, stored with a version, and can be withdrawn from your account. They are not published on a live member directory, because that directory does not exist yet.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
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
            Mature Christian Dating is a UK dating service for genuine Christian singles. We introduce people based on faith, life stage, intentions and the practicalities of real life — not an algorithm score.
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
            <h2 className="font-serif text-plum mb-5">Who Mature Christian Dating is for</h2>
            <div className="space-y-4 text-[16px] text-plum-muted leading-7">
              <p>
                Mature Christian Dating is designed for Christians in the UK who are serious about finding a meaningful relationship — and who want faith compatibility to be part of it.
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
            <h2 className="font-serif text-plum mb-5">How introductions are designed to work</h2>
            <div className="space-y-4 text-[16px] text-plum-muted leading-7">
              <p>
                You complete a founding application covering your faith, your life now, and your hopes for what comes next. You can set Essentials — preferences that would be firm requirements when matching exists.
              </p>
              <p>
                The product is designed to send a small set of introductions at a time, each with plain-language reasons. That cadence is not operating today. Submitting an application does not mean you will be shown people to meet.
              </p>
              <p>
                Mutual interest, private conversation and calling are later product work. They are not available in the founding cohort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activity and safety policy */}
      <section className="section bg-ivory">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-plum mb-5">Designed so introductions stay with people who are actually available</h2>
          <div className="space-y-4 text-[16px] text-plum-muted leading-7 max-w-[620px]">
            <p>
              A common frustration with dating services is reaching out and hearing nothing — not because the person isn&apos;t interested, but because they stopped using the service months ago.
            </p>
            <p>
              When introductions launch, the product is designed to remove profiles after 46 days of inactivity, with reminder notices first. That behaviour is not operating yet because introductions are not live.
            </p>
            <p>
              Phone and selfie checks are planned before messaging. They are not required for a founding application today.
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
              { href: "/christian-dating/remarriage", label: "Christian remarriage", desc: "Whether you would marry again, and how that is recorded on a founding application." },
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
            Join Mature Christian Dating — free
          </LinkButton>
        </div>
      </section>
    </>
  );
}
