import { DatingFunnel } from "@/components/seo/dating-funnel";
import { acquisitionByPath } from "@/lib/seo/acquisition";
import { buildMetadata } from "@/lib/metadata";

const page = acquisitionByPath("/christian-dating-uk");

export const metadata = buildMetadata({
  title: page?.title ?? "Christian dating UK",
  description: page?.description,
  path: "/christian-dating-uk",
});

export default function ChristianDatingUkPage() {
  if (!page) return null;
  return <DatingFunnel h1={page.h1} lede={page.lede} crumbs={page.crumbs} related={page.related} />;
}
