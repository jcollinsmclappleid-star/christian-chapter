import { FunnelPage } from "@/components/seo/funnel-page";
import { buildMetadata } from "@/lib/metadata";
import { funnelByPath } from "@/lib/seo/funnels";
import { siteConfig } from "@/lib/site-config";

const hub = funnelByPath("/christian-dating");
if (!hub) throw new Error("Missing Christian dating hub");

export const metadata = buildMetadata({
  title: hub.title,
  description: hub.description,
  path: hub.path,
});

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.brandName,
  url: siteConfig.siteUrl,
  description:
    "UK founding cohort for Christian dating for adults aged 40 and over. Applications exist; member introductions are not live.",
  areaServed: "GB",
};

export default function ChristianDatingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <FunnelPage page={hub!} />
    </>
  );
}
