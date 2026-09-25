import { FOUNDING_MEMBER_COPY, siteConfig } from "@/lib/site-config";
import Image from "next/image";

const promise = [
  { title: "Your person", body: "Not a crowd. A small number of people, each one a possible yes." },
  { title: "A love that can last", body: "Marriage if it is right. Company that is serious. You say which." },
  { title: "Faith, already understood", body: "It belongs in the introduction, so you are not starting from scratch." },
];

const photos = [
  { src: "/images/home/joy-courtyard.jpg", alt: "A couple laughing together, glad to be beside each other", line: "Someone who chooses you" },
  { src: "/images/home/joy-kitchen.jpg", alt: "A couple laughing together over a meal they made", line: "A life you share" },
  { src: "/images/home/joy-park.jpg", alt: "A couple laughing together, easy in each other's company", line: "The match you hoped for" },
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
  crumbs: FunnelLink[];
  related: FunnelLink[];
  faqs?: FunnelFaq[];
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

      <section className="relative min-h-[70svh] overflow-hidden bg-life">
        <Image
          src="/images/home/joy-rooftop.jpg"
          alt="A couple in their fifties laughing together on a sunny rooftop"
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        <div className="hero-shade absolute inset-0" />
        <div className="relative z-10 flex min-h-[70svh] items-end">
          <div className="mx-auto w-full max-w-6xl md:px-8">
            <div className="px-5 pb-3 md:max-w-[28rem]">
              <nav className="mb-4 text-[12px] text-white/80" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2">
                  {crumbs.map((crumb, index) => (
                    <li key={crumb.href} className="flex items-center gap-2">
                      {index > 0 ? <span>/</span> : null}
                      {index === crumbs.length - 1 ? (
                        <span>{crumb.label}</span>
                      ) : (
                        <a href={crumb.href} className="underline underline-offset-4">{crumb.label}</a>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
              <h1 className="font-sans text-[2.15rem] font-bold leading-[1.02] tracking-[-0.03em] text-white md:text-[2.6rem]">
                {h1}
              </h1>
            </div>
            <div className="w-full rounded-t-[28px] bg-paper px-5 pb-6 pt-5 shadow-card md:mb-10 md:max-w-[28rem] md:rounded-[28px] md:px-6">
              <p className="text-[16px] leading-6 text-plum">{lede}</p>
              <a
                href="/register"
                className="mt-4 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-life px-8 text-[17px] font-semibold text-white"
              >
                Meet Christian Singles
              </a>
              <p className="mt-3 text-center text-[14px] text-plum-muted">These photographs are not members.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-life">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
          <h2 className="font-sans text-[2rem] font-bold leading-tight tracking-[-0.03em] text-paper">
            The same hope as the homepage.
          </h2>
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
            <li key={photo.src} className="relative h-80 overflow-hidden rounded-[28px]">
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 768px) 30vw, 100vw" />
              <p className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-16 text-[1.3rem] font-bold text-white">{photo.line}</p>
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
