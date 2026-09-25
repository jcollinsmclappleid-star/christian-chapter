import { DatingFunnel } from "@/components/seo/dating-funnel";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Christian dating after bereavement",
  description:
    "Christian dating after bereavement with Mature Christian Dating. Take your own time. Matching goes live on 14 February 2027.",
  path: "/christian-dating/after-bereavement",
});

export default function ChristianDatingAfterBereavementPage() {
  return (
    <DatingFunnel
      h1="Christian dating after bereavement"
      lede="Grief has its own time. When you want company again, a profile can say what you are open to, and what you need to go slowly."
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/christian-dating", label: "Christian dating" },
        { href: "/christian-dating/after-bereavement", label: "After bereavement" },
      ]}
      related={[
        { href: "/christian-dating/widowed", label: "Christian dating for widowed singles" },
        { href: "/christian-dating/remarriage", label: "Christian remarriage" },
        { href: "/christian-dating", label: "Christian dating in the UK" },
      ]}
    />
  );
}
