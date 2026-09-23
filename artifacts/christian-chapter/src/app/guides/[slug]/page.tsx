import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SearchArticle } from "@/components/seo/search-article";
import { buildMetadata } from "@/lib/metadata";
import { articleForPath, searchArticles } from "@/lib/seo/catalog";

export function generateStaticParams() {
  return searchArticles
    .map((article) => article.path)
    .filter((path) => path.startsWith("/guides/") && !path.slice("/guides/".length).includes("/"))
    .map((path) => ({ slug: path.slice("/guides/".length) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articleForPath(`/guides/${slug}`);
  if (!article) return {};
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: article.path,
  });
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleForPath(`/guides/${slug}`);
  if (!article) notFound();
  return <SearchArticle article={article} />;
}
