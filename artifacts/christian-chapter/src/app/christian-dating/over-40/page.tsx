import { DatingFunnel } from "@/components/seo/dating-funnel";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating over 40",
  description:
    "Christian dating over 40 with Mature Christian Dating. A UK founding profile for adults aged 40 and over. Matching goes live on 14 February 2027.",
  path: "/christian-dating/over-40",
});

export default function ChristianDatingOver40Page() {
  return (
    <DatingFunnel
      h1="Christian dating over 40"
      lede="Your forties often hold work, children, and a faith that has already been tested. A profile is where that life can be said, before any introduction is made."
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/christian-dating", label: "Christian dating" },
        { href: "/christian-dating/over-40", label: "Over 40" },
      ]}
      related={[
        { href: "/christian-dating/over-50", label: "Christian dating over 50" },
        { href: "/christian-dating/after-divorce", label: "Christian dating after divorce" },
        { href: "/christian-dating", label: "Christian dating in the UK" },
      ]}
    />
  );
}
