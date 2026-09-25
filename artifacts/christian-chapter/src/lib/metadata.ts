import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christianchapter.co.uk";
const siteName = "Mature Christian Dating";
const defaultDescription =
  "Mature Christian Dating. A UK founding cohort for Christian singles aged 40 and over. There is no maximum age.";

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
