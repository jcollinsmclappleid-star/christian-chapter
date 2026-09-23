import { LinkButton } from "@/components/ui/button";
import { FOUNDING_MEMBER_COPY, siteConfig } from "@/lib/site-config";
import type { SeoArticle } from "@/lib/seo/article";

export function SearchArticle({ article }: { article: SeoArticle }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: article.crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${siteConfig.siteUrl}${crumb.href}`,
    })),
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <section className="section bg-ivory pb-14">
        <div className="mx-auto max-w-4xl px-6">
          <nav className="text-[12px] text-stone mb-6 font-sans" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              {article.crumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && <span className="text-mist">/</span>}
                  {index === article.crumbs.length - 1 ? (
                    <span className="text-plum">{crumb.label}</span>
                  ) : (
                    <a href={crumb.href} className="hover:text-plum">{crumb.label}</a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="font-serif text-plum mb-6">{article.h1}</h1>
          <p className="text-[18px] text-plum-muted leading-7 max-w-[640px] mb-8">{article.lede}</p>
          <LinkButton href="/register" size="lg" variant="primary">
            Join free
          </LinkButton>
        </div>
      </section>
      {article.sections.map((section, index) => (
        <section key={section.heading} className={`section ${index % 2 === 0 ? "bg-ivory-dark" : "bg-ivory"}`}>
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-serif text-plum mb-5">{section.heading}</h2>
            <div className="space-y-4 text-[16px] text-plum-muted leading-7">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ))}
      {article.related.length > 0 && (
        <section className="section bg-ivory">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="font-serif text-plum mb-6">Related reading</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {article.related.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="block rounded-lg border border-border bg-ivory-dark px-5 py-4 text-[15px] text-plum hover:border-life/40">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <section className="section bg-ivory-dark">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-plum mb-8">Questions people ask</h2>
          <div className="space-y-7">
            {article.faqs.map((item) => (
              <div key={item.q} className="border-b border-border pb-7 last:border-0 last:pb-0">
                <h3 className="font-sans font-semibold text-[16px] text-plum mb-2">{item.q}</h3>
                <p className="text-[15px] text-plum-muted leading-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-ivory border-t border-border">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-plum mb-4">The founding offer</h2>
          <p className="text-[16px] text-plum-muted leading-7 mb-6">{FOUNDING_MEMBER_COPY}</p>
          <LinkButton href="/register" size="lg" variant="primary">
            Create your free profile
          </LinkButton>
        </div>
      </section>
    </>
  );
}
