import { DatingFunnel } from "@/components/seo/dating-funnel";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating over 60",
  description:
    "Christian dating over 60 with Mature Christian Dating. There is no maximum age. Matching goes live on 14 February 2027.",
  path: "/christian-dating/over-60",
});

export default function ChristianDatingOver60Page() {
  return (
    <DatingFunnel
      h1="Christian dating over 60"
      lede="Life after 60 can be full, and still leave room for a person who shares your faith. There is no upper age. Start with the profile."
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/christian-dating", label: "Christian dating" },
        { href: "/christian-dating/over-60", label: "Over 60" },
      ]}
      related={[
        { href: "/christian-dating/over-50", label: "Christian dating over 50" },
        { href: "/christian-dating/widowed", label: "Christian dating for widowed singles" },
        { href: "/christian-dating", label: "Christian dating in the UK" },
      ]}
    />
  );
}
