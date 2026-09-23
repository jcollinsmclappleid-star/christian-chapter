import type { MetadataRoute } from "next";
import { mayIndex, seoBriefs } from "@/lib/seo/briefs";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return seoBriefs.filter(mayIndex).map((page) => ({
    url: `${siteConfig.siteUrl}${page.path}`,
    lastModified: `${page.lastModified}T00:00:00.000Z`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
