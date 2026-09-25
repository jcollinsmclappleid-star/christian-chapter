import { DatingFunnel } from "@/components/seo/dating-funnel";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating and remarriage",
  description:
    "Christian dating for people considering remarriage. Mature Christian Dating does not rule on church teaching. Matching goes live on 14 February 2027.",
  path: "/christian-dating/remarriage",
});

export default function ChristianDatingRemarriagePage() {
  return (
    <DatingFunnel
      h1="Christian dating and remarriage"
      lede="Remarriage is a settled hope for some people and a careful question for others. Say if you are open to remarriage on your profile. Churches teach differently, and this page will not pretend they are the same."
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/christian-dating", label: "Christian dating" },
        { href: "/christian-dating/remarriage", label: "Remarriage" },
      ]}
      related={[
        { href: "/christian-dating/after-divorce", label: "Christian dating after divorce" },
        { href: "/christian-dating/catholic", label: "Catholic dating" },
        { href: "/christian-dating/anglican", label: "Anglican dating" },
      ]}
    />
  );
}
