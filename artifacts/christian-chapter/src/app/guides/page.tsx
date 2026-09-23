import { SearchArticle } from "@/components/seo/search-article";
import { buildMetadata } from "@/lib/metadata";
import { articleForPath } from "@/lib/seo/catalog";

const guidesIndex = articleForPath("/guides");

export const metadata = buildMetadata({
  title: guidesIndex?.title ?? "Guides — Mature Christian Dating",
  description: guidesIndex?.description,
  path: "/guides",
});

export default function GuidesIndexPage() {
  if (!guidesIndex) return null;
  return <SearchArticle article={guidesIndex} />;
}
