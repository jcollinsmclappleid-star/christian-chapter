import { DatingFunnel } from "@/components/seo/dating-funnel";
import { acquisitionByPath } from "@/lib/seo/acquisition";
import { buildMetadata } from "@/lib/metadata";

const page = acquisitionByPath("/christian-singles");

export const metadata = buildMetadata({
  title: page?.title ?? "Christian singles",
  description: page?.description,
  path: "/christian-singles",
});

export default function ChristianSinglesPage() {
  if (!page) return null;
  return <DatingFunnel h1={page.h1} lede={page.lede} crumbs={page.crumbs} related={page.related} />;
}
