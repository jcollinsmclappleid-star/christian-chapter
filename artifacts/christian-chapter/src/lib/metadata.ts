import type { Metadata } from "next";
import { siteConfig } from "./site-config";

const siteUrl = siteConfig.siteUrl;
const siteName = "Mature Christian Dating";
const defaultDescription =
  "Christian dating for UK adults aged 40 and over. There is no maximum age. Meet Christian singles who share your faith and want a lasting relationship.";

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
