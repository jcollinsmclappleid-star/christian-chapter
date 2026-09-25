import { DatingFunnel } from "@/components/seo/dating-funnel";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating after divorce",
  description:
    "Christian dating after divorce with Mature Christian Dating. A profile can hold family life and faith. Matching goes live on 14 February 2027.",
  path: "/christian-dating/after-divorce",
});

export default function ChristianDatingAfterDivorcePage() {
  return (
    <DatingFunnel
      h1="Christian dating after divorce"
      lede="A marriage can end and faith can remain. This page does not rule on church teaching. Your profile is where you say what is true for you."
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/christian-dating", label: "Christian dating" },
        { href: "/christian-dating/after-divorce", label: "After divorce" },
      ]}
      related={[
        { href: "/christian-dating/remarriage", label: "Christian remarriage" },
        { href: "/christian-dating/over-40", label: "Christian dating over 40" },
        { href: "/christian-dating/after-bereavement", label: "Christian dating after bereavement" },
      ]}
    />
  );
}
