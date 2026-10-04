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
  image,
  imageAlt,
}: {
  title: string;
  description?: string;
  path?: string;
  noindex?: boolean;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const url = `${siteUrl}${path}`;
  const socialImage = image
    ? [{ url: `${siteUrl}${image}`, alt: imageAlt ?? title }]
    : undefined;

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
      images: socialImage,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${title} | ${siteName}`,
      description,
      images: image ? [`${siteUrl}${image}`] : undefined,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export { siteUrl, siteName, defaultDescription };
