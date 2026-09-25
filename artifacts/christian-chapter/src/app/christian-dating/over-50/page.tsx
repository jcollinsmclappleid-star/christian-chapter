import { DatingFunnel } from "@/components/seo/dating-funnel";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating over 50",
  description:
    "Christian dating over 50 with Mature Christian Dating. A UK founding profile for faith and the week you already have. Matching goes live on 14 February 2027.",
  path: "/christian-dating/over-50",
});

export default function ChristianDatingOver50Page() {
  return (
    <DatingFunnel
      h1="Christian dating over 50"
      lede="The fifties are often when you know the shape of a good week, and the kind of company you want in it. Write that on your profile, in your own words."
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/christian-dating", label: "Christian dating" },
        { href: "/christian-dating/over-50", label: "Over 50" },
      ]}
      related={[
        { href: "/christian-dating/over-40", label: "Christian dating over 40" },
        { href: "/christian-dating/over-60", label: "Christian dating over 60" },
        { href: "/christian-dating/remarriage", label: "Christian remarriage" },
      ]}
    />
  );
}
