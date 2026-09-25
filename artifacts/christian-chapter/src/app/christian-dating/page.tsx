import { DatingFunnel } from "@/components/seo/dating-funnel";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Christian dating in the UK",
  description:
    "Mature Christian Dating is for UK adults aged 40 and over. There is no maximum age. Matching goes live on 14 February 2027. Create a profile to begin.",
  path: "/christian-dating",
});

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.brandName,
  url: siteConfig.siteUrl,
  description:
    "UK founding cohort for Christian dating for adults aged 40 and over. Matching goes live on 14 February 2027.",
  areaServed: "GB",
};

export default function ChristianDatingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <DatingFunnel
        h1="Christian dating in the UK"
        lede="People searching for Christian dating in the UK usually want faith to matter, and they want the other person to want that too. The homepage shows the product. A profile is how you begin."
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/christian-dating", label: "Christian dating" },
        ]}
        related={[
          { href: "/christian-dating/over-40", label: "Christian dating over 40" },
          { href: "/christian-dating/catholic", label: "Catholic dating" },
          { href: "/christian-dating/greater-london", label: "Christian dating in London" },
          { href: "/christian-dating/widowed", label: "Christian dating for widowed singles" },
        ]}
      />
    </>
  );
}
