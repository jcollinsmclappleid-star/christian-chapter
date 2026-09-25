import { LinkButton } from "@/components/ui/button";
import { FUNNEL_FAQS, PUBLIC_CLAIMS, SHOWCASE } from "@/lib/seo/claims";
import { type Funnel, funnelByPath } from "@/lib/seo/funnels";
import { siteConfig } from "@/lib/site-config";

const POSTER = "/images/chapter-house/chapter-house-desktop.svg";

export function FunnelPage({ page }: { page: Funnel }) {
  const related = page.related.map((path) => funnelByPath(path)).filter((item): item is Funnel => Boolean(item));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Christian dating", path: "/christian-dating" },
    ...(page.slug ? [{ name: page.h1, path: page.path }] : []),
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.siteUrl}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FUNNEL_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-10 lg:grid-cols-2 lg:py-14">
          <div>
            <nav className="mb-5 text-[12px] text-stone font-sans" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                {crumbs.map((crumb, index) => (
                  <li key={crumb.path} className="flex items-center gap-2">
                    {index > 0 ? <span className="text-mist">/</span> : null}
                    {index === crumbs.length - 1 ? (
                      <span className="text-plum">{index === 0 ? crumb.name : page.slug ? "This page" : "Christian dating"}</span>
                    ) : (
                      <a href={crumb.path} className="hover:text-plum">
                        {crumb.name}
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <p className="mb-4 font-sans text-[11px] uppercase tracking-[0.28em] text-oxblood">{page.eyebrow}</p>
            <h1 className="mb-5 max-w-[16ch] font-serif leading-[1.05] text-plum">{page.h1}</h1>
            <p className="mb-6 max-w-[34rem] text-[18px] leading-7 text-plum-muted">{page.lede}</p>
            <div className="mb-5 flex flex-wrap items-center gap-4">
              <LinkButton href={PUBLIC_CLAIMS.ctaHref} size="lg" variant="primary">
                {PUBLIC_CLAIMS.cta}
              </LinkButton>
              <a href="/" className="text-[15px] text-plum-muted underline underline-offset-4 hover:text-plum">
                See the homepage
              </a>
            </div>
            <p className="text-[14px] text-stone">{PUBLIC_CLAIMS.usp}</p>
          </div>

          <figure className="relative overflow-hidden rounded-xl border border-border bg-ivory-dark">
            <img
              src={POSTER}
              alt="Illustration from the Mature Christian Dating homepage"
              width={2400}
              height={1600}
              className="aspect-[3/2] w-full object-cover"
            />
            <figcaption className="absolute inset-x-3 bottom-3 rounded-md bg-ivory/92 px-3 py-2 text-[13px] leading-5 text-plum-muted">
              {PUBLIC_CLAIMS.demonstration}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-ivory-dark px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.28em] text-oxblood">The same product as the homepage</p>
          <h2 className="mb-8 font-serif text-plum">What you are joining</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE.map((room) => (
              <article key={room.title} className="rounded-lg border border-border bg-ivory p-5">
                <h3 className="mb-2 font-serif text-[1.45rem] text-plum">{room.title}</h3>
                <p className="text-[15px] leading-6 text-plum-muted">{room.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-4 text-[17px] leading-7 text-plum-muted">
            {page.commentary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="text-[15px] text-stone">
              {PUBLIC_CLAIMS.faith} {PUBLIC_CLAIMS.age}
            </p>
          </div>
          <aside className="rounded-xl border border-border bg-oxblood-light p-6">
            <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.22em] text-oxblood">Make a profile</p>
            <p className="mb-5 font-serif text-[1.7rem] leading-tight text-plum">
              The next step is your own chapter, not another article.
            </p>
            <LinkButton href={PUBLIC_CLAIMS.ctaHref} size="lg" variant="primary">
              {PUBLIC_CLAIMS.cta}
            </LinkButton>
            <p className="mt-4 text-[14px] leading-6 text-plum-muted">{PUBLIC_CLAIMS.matching}</p>
          </aside>
        </div>
      </section>

      <section className="border-t border-border bg-ivory px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 font-serif text-[1.8rem] text-plum">Also searched</h2>
          <ul className="flex flex-wrap gap-3">
            {related.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className="inline-flex min-h-11 items-center rounded-full border border-border bg-ivory-dark px-4 text-[14px] text-plum hover:border-oxblood"
                >
                  {item.h1}
                </a>
              </li>
            ))}
          </ul>
          <dl className="mt-8 grid gap-4 md:grid-cols-3">
            {FUNNEL_FAQS.map((item) => (
              <div key={item.q}>
                <dt className="font-serif text-[1.15rem] text-plum">{item.q}</dt>
                <dd className="mt-1 text-[14px] leading-6 text-plum-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

    </>
  );
}
