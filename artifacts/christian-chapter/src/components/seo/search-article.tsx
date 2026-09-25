import { DatingFunnel } from "@/components/seo/dating-funnel";
import type { SeoArticle } from "@/lib/seo/article";

export function SearchArticle({ article }: { article: SeoArticle }) {
  return (
    <DatingFunnel
      h1={article.h1}
      lede={article.lede}
      crumbs={article.crumbs}
      related={article.related}
      faqs={article.faqs}
    />
  );
}
