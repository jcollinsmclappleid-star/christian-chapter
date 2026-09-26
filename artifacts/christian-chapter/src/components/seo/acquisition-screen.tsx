import { notFound } from "next/navigation";
import { DatingFunnel } from "@/components/seo/dating-funnel";
import { acquisitionByPath } from "@/lib/seo/acquisition";
import { buildMetadata } from "@/lib/metadata";

export function acquisitionMetadata(path: string) {
  const record = acquisitionByPath(path);
  if (!record) return {};
  return buildMetadata({ title: record.title, description: record.description, path: record.path });
}

export function AcquisitionScreen({ path }: { path: string }) {
  const record = acquisitionByPath(path);
  if (!record) notFound();
  return <DatingFunnel h1={record.h1} lede={record.lede} crumbs={record.crumbs} related={record.related} />;
}
