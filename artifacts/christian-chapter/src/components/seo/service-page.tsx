import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { servicePageForPath } from "@/lib/seo/service-pages";
import { OPENING_OFFER_ENDS_LABEL, siteConfig } from "@/lib/site-config";

export function servicePageMetadata(path: string) {
  const page = servicePageForPath(path);
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    image: page.image.src,
    imageAlt: page.image.alt,
  });
}

export function ServicePage({ path }: { path: string }) {
  const page = servicePageForPath(path);
  if (!page) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.h1,
        item: `${siteConfig.siteUrl}${page.path}`,
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: `${siteConfig.siteUrl}${page.path}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.brandName,
      url: siteConfig.siteUrl,
    },
    about: {
      "@type": "Service",
      name: page.eyebrow,
      areaServed: "United Kingdom",
      audience: {
        "@type": "PeopleAudience",
        suggestedMinAge: 40,
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>
        <section className="bg-paper">
          <div className="mx-auto grid min-h-[610px] max-w-6xl md:grid-cols-[1.02fr_0.98fr]">
            <div className="order-2 flex flex-col justify-center px-5 py-9 md:order-1 md:px-10 md:py-14 lg:px-14">
              <nav className="mb-5 text-[13px] text-stone" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                  <li>
                    <a href="/" className="underline decoration-border-medium underline-offset-4">
                      Home
                    </a>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-plum" aria-current="page">
                    {page.eyebrow}
                  </li>
                </ol>
              </nav>
              <p className="text-[12px] font-semibold uppercase text-life">{page.eyebrow}</p>
              <h1 className="mt-3 max-w-[15ch] font-serif text-[2.35rem] font-medium leading-[1.05] text-plum md:text-[3.25rem]">
                {page.h1}
              </h1>
              <p className="mt-5 max-w-[38rem] text-[17px] leading-7 text-plum-muted">{page.intro}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/register"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-life px-7 text-[16px] font-semibold text-white hover:bg-life-hover"
                >
                  Create your free profile
                  <ChevronRight className="ml-1.5 h-5 w-5" aria-hidden="true" />
                </a>
                <a href="/how-it-works" className="inline-flex min-h-12 items-center justify-center px-3 text-[15px] font-semibold text-plum underline decoration-border-medium underline-offset-4">
                  See how it works
                </a>
              </div>
              <p className="mt-4 text-[13px] leading-5 text-stone">
                Free until {OPENING_OFFER_ENDS_LABEL}. No card is taken.
              </p>
            </div>
            <div className="relative order-1 h-[42svh] min-h-[300px] md:order-2 md:h-auto">
              <Image
                src={page.image.src}
                alt={page.image.alt}
                fill
                priority
                className={`object-cover ${page.image.position ?? "object-center"}`}
                sizes="(min-width: 768px) 49vw, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-ivory-dark" aria-label="Service details">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 px-5 py-5 md:grid-cols-4 md:px-8">
            {[
              ["Who it is for", "UK adults 40+"],
              ["Maximum age", "None"],
              ["Founding cost", "Free"],
              ["Payment card", "Not taken"],
            ].map(([term, value]) => (
              <div key={term} className="border-border px-3 py-3 even:border-l md:border-l md:first:border-l-0 md:px-6">
                <dt className="text-[12px] text-stone">{term}</dt>
                <dd className="mt-1 font-serif text-[1.3rem] leading-tight text-plum">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="bg-ivory">
          <div className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
            <div className="grid gap-9 md:grid-cols-[0.82fr_1.18fr] md:gap-16">
              <div>
                <p className="text-[12px] font-semibold uppercase text-life">What makes it different</p>
                <h2 className="mt-3 font-serif text-[2rem] font-medium leading-tight text-plum md:text-[2.5rem]">
                  {page.focus.heading}
                </h2>
                <p className="mt-5 text-[17px] leading-7 text-plum-muted">{page.focus.body}</p>
              </div>
              <ul className="border-t border-border">
                {page.benefits.map((benefit) => (
                  <li key={benefit.title} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-border py-6">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-evergreen text-white">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-sans text-[18px] font-semibold leading-6 text-plum">{benefit.title}</h3>
                      <p className="mt-2 text-[16px] leading-7 text-plum-muted">{benefit.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-life text-white">
          <div className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
            <div className="max-w-2xl">
              <p className="text-[12px] font-semibold uppercase text-foam">The process</p>
              <h2 className="mt-3 font-serif text-[2rem] font-medium leading-tight text-white md:text-[2.5rem]">
                {page.processHeading}
              </h2>
              <p className="mt-4 text-[17px] leading-7 text-foam">{page.processIntro}</p>
            </div>
            <ol className="mt-10 grid border-t border-white/20 md:grid-cols-3 md:border-l">
              {page.steps.map((step, index) => (
                <li key={step.title} className="border-b border-white/20 py-7 md:border-b-0 md:border-r md:px-7 first:md:pl-7">
                  <span className="text-[13px] font-semibold text-foam">0{index + 1}</span>
                  <h3 className="mt-3 font-sans text-[19px] font-semibold leading-6 text-white">{step.title}</h3>
                  <p className="mt-3 text-[16px] leading-7 text-foam">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 md:grid-cols-[0.78fr_1.22fr] md:px-8 md:py-20">
            <aside className="self-start rounded-lg border border-border bg-ivory-dark p-6 md:p-8">
              <p className="text-[12px] font-semibold uppercase text-life">Good to know</p>
              <h2 className="mt-3 font-serif text-[1.7rem] font-medium leading-tight text-plum">{page.note.title}</h2>
              <p className="mt-4 text-[16px] leading-7 text-plum-muted">{page.note.body}</p>
              <a href="/pricing" className="mt-5 inline-flex text-[14px] font-semibold text-plum underline decoration-border-medium underline-offset-4">
                Read the full pricing details
              </a>
            </aside>
            <div>
              <p className="text-[12px] font-semibold uppercase text-life">Questions</p>
              <h2 className="mt-3 font-serif text-[2rem] font-medium text-plum">Before you create a profile</h2>
              <div className="mt-7 border-t border-border">
                {page.faqs.map((item) => (
                  <details key={item.q} className="group border-b border-border py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-[17px] font-semibold leading-6 text-plum">
                      {item.q}
                      <span className="text-life transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p className="mt-3 pr-8 text-[16px] leading-7 text-plum-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-ivory-dark">
          <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div>
                <p className="text-[12px] font-semibold uppercase text-life">Your next step</p>
                <h2 className="mt-3 max-w-[18ch] font-serif text-[2rem] font-medium leading-tight text-plum md:text-[2.5rem]">
                  Start with a profile that sounds like you.
                </h2>
                <p className="mt-3 text-[16px] leading-6 text-plum-muted">Free to create. No payment card required.</p>
              </div>
              <a
                href="/register"
                className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-full bg-life px-7 text-[16px] font-semibold text-white hover:bg-life-hover"
              >
                Join free
                <ChevronRight className="ml-1.5 h-5 w-5" aria-hidden="true" />
              </a>
            </div>
            <nav className="mt-10 border-t border-border pt-6" aria-label="Related services">
              <p className="text-[13px] font-semibold text-plum">Related services</p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                {page.related.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-[14px] text-plum-muted underline decoration-border-medium underline-offset-4 hover:text-plum">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
    </>
  );
}
