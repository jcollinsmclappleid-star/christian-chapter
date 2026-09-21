import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christianchapter.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/safety", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/pricing", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/success-stories", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/christian-dating", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/christian-dating/over-40", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/christian-dating/over-50", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/christian-dating/over-60", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/christian-dating/after-divorce", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/christian-dating/after-bereavement", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/christian-dating/remarriage", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/guides/safety/romance-fraud", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/guides/christian-relationships/dating-across-denominations", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/cookies", priority: 0.4, changeFrequency: "yearly" as const },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
