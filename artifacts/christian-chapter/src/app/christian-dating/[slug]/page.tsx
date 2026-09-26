import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SearchArticle } from "@/components/seo/search-article";
import { buildMetadata } from "@/lib/metadata";
import { acquisitionIntent, acquisitionPages } from "@/lib/seo/acquisition";
import { articleForPath, searchArticles } from "@/lib/seo/catalog";
import { DatingFunnel } from "@/components/seo/dating-funnel";

const RESERVED = new Set([
  "over-40",
  "over-50",
  "over-60",
  "after-divorce",
  "after-bereavement",
  "remarriage",
]);

export function generateStaticParams() {
  const articleSlugs = searchArticles
    .map((article) => article.path)
    .filter((path) => path.startsWith("/christian-dating/"))
    .map((path) => path.slice("/christian-dating/".length))
    .filter((slug) => slug.length > 0 && !slug.includes("/") && !RESERVED.has(slug));
  const intentSlugs = acquisitionPages
    .map((item) => item.path)
    .filter((path) => path.startsWith("/christian-dating/"))
    .map((path) => path.slice("/christian-dating/".length))
    .filter((slug) => slug.length > 0 && !slug.includes("/"));
  return [...new Set([...articleSlugs, ...intentSlugs])].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const intent = acquisitionIntent(slug);
  if (intent) return buildMetadata({ title: intent.title, description: intent.description, path: intent.path });
  const article = articleForPath(`/christian-dating/${slug}`);
  if (!article) return {};
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: article.path,
  });
}

export default async function ChristianDatingArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const intent = acquisitionIntent(slug);
  if (intent) return <DatingFunnel h1={intent.h1} lede={intent.lede} crumbs={intent.crumbs} related={intent.related} />;
  const article = articleForPath(`/christian-dating/${slug}`);
  if (!article) notFound();
  return <SearchArticle article={article} />;
}
