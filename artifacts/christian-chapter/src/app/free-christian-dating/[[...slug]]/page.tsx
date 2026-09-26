import { notFound } from "next/navigation";
import { DatingFunnel } from "@/components/seo/dating-funnel";
import { freeAcquisition } from "@/lib/seo/acquisition";
import { isTopPlace, PLACES } from "@/lib/seo/places";
import { buildMetadata } from "@/lib/metadata";

export const dynamicParams = false;

const FIXED = ["uk", "over-40", "over-50", "over-60", "catholic", "after-divorce"];

export function generateStaticParams() {
  return [
    { slug: [] as string[] },
    ...FIXED.map((slug) => ({ slug: [slug] })),
    ...PLACES.filter((place) => isTopPlace(place.slug)).map((place) => ({ slug: ["in", place.slug] })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = freeAcquisition(slug);
  if (!page) return {};
  return buildMetadata({ title: page.title, description: page.description, path: page.path });
}

export default async function FreeFunnelPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = freeAcquisition(slug);
  if (!page) notFound();
  return <DatingFunnel h1={page.h1} lede={page.lede} crumbs={page.crumbs} related={page.related} />;
}
