import { DatingFunnel } from "@/components/seo/dating-funnel";
import type { SeoArticle } from "@/lib/seo/article";
import { placesInRegion, placePath } from "@/lib/seo/places";
import { TRAVEL_MILES_COPY } from "@/lib/site-config";

/** Region essays were written before the travel range was public. The visible sentence is the product. */
export function publishMiles(text: string): string {
  return text.replace(/[^.?!]*does not publish a distance[^.?!]*[.?!]/gi, ` ${TRAVEL_MILES_COPY}`);
}

export function SearchArticle({ article }: { article: SeoArticle }) {
  const regionSlug = article.path.startsWith("/christian-dating/")
    ? article.path.slice("/christian-dating/".length)
    : "";
  const places = placesInRegion(regionSlug);
  const related = places.length
    ? [
        ...article.related,
        ...places.map((place) => ({ href: placePath(place), label: `Christian dating in ${place.name}` })),
      ]
    : article.related;
  return (
    <DatingFunnel
      h1={article.h1}
      lede={publishMiles(article.lede)}
      crumbs={article.crumbs}
      related={related}
      faqs={article.faqs.map((faq) => ({ ...faq, a: publishMiles(faq.a) }))}
    />
  );
}
