import { FOUNDING_MEMBER_COPY, FUNNEL_SERVICE_HEADING, FUNNEL_SERVICE_LINE, HERO_OFFER, siteConfig, TRAVEL_MILES_COPY } from "@/lib/site-config";
import Image from "next/image";

const promise = [
  { title: "Your person", body: "Not a crowd. A small number of people, each one a possible yes." },
  { title: "A love that can last", body: "Marriage if it is right. Company that is serious. You say which." },
  { title: "Faith, in your words", body: "After you sign in, you write what faith means to you. Other members read it on your profile." },
];

const photos = [
  { src: "/images/home/joy-courtyard.jpg", alt: "A couple in their forties, she in a rust top and he in a light blue shirt, walking on a park path", line: "Someone who chooses you", focus: "object-[center_18%]" },
  { src: "/images/home/joy-kitchen.jpg", alt: "A couple in their forties, in a cream cardigan and blue shirt, cooking together", line: "A life you share", focus: "object-[center_18%]" },
  { src: "/images/home/joy-park.jpg", alt: "A couple in their sixties, in a mustard raincoat and olive jacket, walking on a park path", line: "The match you hoped for", focus: "object-[center_18%]" },
];

export type FunnelLink = { href: string; label: string };
export type FunnelFaq = { q: string; a: string };

export function DatingFunnel({
  h1,
  lede,
  crumbs,
  related,
  faqs = [],
}: {
  h1: string;
  lede: string;
  crumbs: readonly FunnelLink[];
  related: readonly FunnelLink[];
  faqs?: readonly FunnelFaq[];
}) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${siteConfig.siteUrl}${crumb.href === "/" ? "" : crumb.href}`,
    })),
  };
  const faq = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faq ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} /> : null}

      <section className="bg-paper md:grid md:min-h-[640px] md:grid-cols-2">
        <div className="relative h-[48svh] min-h-[300px] md:h-auto">
          <Image
            src="/images/home/joy-rooftop.jpg"
            alt="A couple in their fifties, in a sage shirt and charcoal polo, talking on a sunny rooftop"
            fill
            priority
            className="object-cover object-[center_22%]"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-col justify-center px-5 py-6 md:px-10 md:py-12">
          <nav className="mb-3 text-[12px] text-stone" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {index > 0 ? <span className="text-mist">/</span> : null}
                  {index === crumbs.length - 1 ? (
                    <span className="text-plum">{crumb.label}</span>
                  ) : (
                    <a href={crumb.href} className="underline underline-offset-4">{crumb.label}</a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="font-sans text-[1.65rem] font-bold leading-[1.08] tracking-[-0.03em] text-plum md:text-[2.4rem]">
            {h1}
          </h1>
          <a
            href="/register"
            className="mt-4 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-life px-8 text-[17px] font-semibold text-white md:w-auto md:self-start"
          >
            Meet Christian Singles
          </a>
          <p className="mt-3 text-[14px] leading-5 text-plum">{HERO_OFFER}</p>
          <p className="mt-2 text-[14px] leading-5 text-plum">{TRAVEL_MILES_COPY}</p>
          <p className="mt-4 text-[15px] leading-5 text-plum-muted md:text-[16px] md:leading-6">{lede}</p>
        </div>
      </section>

      <section className="bg-life">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
          <h2 className="font-sans text-[2rem] font-bold leading-tight tracking-[-0.03em] text-paper">
            {FUNNEL_SERVICE_HEADING}
          </h2>
          <p className="mt-3 text-[17px] leading-6 text-foam">{FUNNEL_SERVICE_LINE}</p>
          <ul className="mt-6">
            {promise.map((item) => (
              <li key={item.title} className="border-t border-white/15 py-5">
                <h3 className="font-sans text-[1.3rem] font-bold text-paper">{item.title}</h3>
                <p className="mt-1 text-[17px] leading-6 text-foam">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ivory">
        <ul className="mx-auto grid max-w-6xl gap-4 px-5 py-12 md:grid-cols-3 md:px-8">
          {photos.map((photo) => (
            <li key={photo.src} className="overflow-hidden rounded-[28px] bg-ivory-dark">
              <div className="relative h-[28rem]">
                <Image src={photo.src} alt={photo.alt} fill className={`object-cover ${photo.focus}`} sizes="(min-width: 768px) 30vw, 100vw" />
              </div>
              <p className="px-5 py-4 font-sans text-[1.2rem] font-bold text-plum">{photo.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ivory-dark">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
          <p className="text-[17px] leading-7 text-plum">{FOUNDING_MEMBER_COPY}</p>
          <a
            href="/register"
            className="mt-6 inline-flex min-h-14 items-center justify-center rounded-full bg-life px-8 text-[17px] font-semibold text-white"
          >
            Create your free profile
          </a>
          {faqs.length > 0 ? (
            <dl className="mt-10 grid gap-6">
              {faqs.map((item) => (
                <div key={item.q}>
                  <dt className="font-sans text-[1.05rem] font-semibold text-plum">{item.q}</dt>
                  <dd className="mt-1 text-[15px] leading-6 text-plum-muted">{item.a}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {related.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-3">
              {related.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="inline-flex min-h-11 items-center rounded-full border border-border bg-ivory px-4 text-[14px] text-plum">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  );
}
