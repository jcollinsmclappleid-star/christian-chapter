import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christianchapter.co.uk";
const siteName = "Mature Christian Dating";
const defaultDescription =
  "Christian dating for your next chapter. Meet genuine Christian singles aged 40–70 who share your faith, values and hopes for what comes next. A UK founding cohort.";

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
  noindex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  noindex?: boolean;
}): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      type: "website",
      locale: "en_GB",
    },
    twitter: {
      card: "summary",
      title: `${title} | ${siteName}`,
      description,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export { siteUrl, siteName, defaultDescription };
