export type SeoArticle = {
  path: string;
  h1: string;
  title: string;
  description: string;
  crumbs: readonly { href: string; label: string }[];
  lede: string;
  sections: readonly { heading: string; paragraphs: readonly string[] }[];
  related: readonly { href: string; label: string }[];
  faqs: readonly { q: string; a: string }[];
};

export function articleText(article: SeoArticle): string {
  return [
    article.h1,
    article.lede,
    ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...article.faqs.flatMap((faq) => [faq.q, faq.a]),
  ].join(" ");
}

export function articleSentences(article: SeoArticle): string[] {
  return articleText(article)
    .split(/(?<=[.])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40);
}
