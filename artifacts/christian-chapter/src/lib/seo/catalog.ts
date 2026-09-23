import type { SeoArticle } from "./article.ts";
import { guideArticles } from "./articles/guides.ts";
import { northernRegionArticles } from "./articles/regions-north.ts";
import { southernRegionArticles } from "./articles/regions-south.ts";
import { traditionArticles } from "./articles/traditions.ts";

export const searchArticles: readonly SeoArticle[] = [
  ...traditionArticles,
  ...southernRegionArticles,
  ...northernRegionArticles,
  ...guideArticles,
];

const byPath = new Map(searchArticles.map((article) => [article.path, article]));

export function articleForPath(path: string): SeoArticle | undefined {
  return byPath.get(path);
}

export function articlesUnder(prefix: string): SeoArticle[] {
  return searchArticles.filter((article) => article.path.startsWith(prefix));
}

const SOURCE_BY_EXPORT = [
  [traditionArticles, "lib/seo/articles/traditions.ts"],
  [southernRegionArticles, "lib/seo/articles/regions-south.ts"],
  [northernRegionArticles, "lib/seo/articles/regions-north.ts"],
  [guideArticles, "lib/seo/articles/guides.ts"],
] as const;

export function articleSourceFile(path: string): string | null {
  for (const [group, file] of SOURCE_BY_EXPORT) {
    if (group.some((article) => article.path === path)) return file;
  }
  return null;
}
