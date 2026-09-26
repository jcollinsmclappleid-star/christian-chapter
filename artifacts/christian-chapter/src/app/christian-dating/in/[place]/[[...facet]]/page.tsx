import { notFound } from "next/navigation";
import { DatingFunnel } from "@/components/seo/dating-funnel";
import { placeFacetPage } from "@/lib/seo/acquisition";
import { isTopPlace, PLACES } from "@/lib/seo/places";
import { buildMetadata } from "@/lib/metadata";

export const dynamicParams = false;

const FACETS = ["over-50", "catholic", "after-divorce"];

export function generateStaticParams() {
  const params: { place: string; facet?: string[] }[] = [];
  for (const place of PLACES) {
    params.push({ place: place.slug });
    if (!isTopPlace(place.slug)) continue;
    for (const facet of FACETS) params.push({ place: place.slug, facet: [facet] });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ place: string; facet?: string[] }>;
}) {
  const { place, facet } = await params;
  const page = placeFacetPage(place, facet?.[0]);
  if (!page) return {};
  return buildMetadata({ title: page.title, description: page.description, path: page.path });
}

export default async function PlaceFunnelPage({
  params,
}: {
  params: Promise<{ place: string; facet?: string[] }>;
}) {
  const { place, facet } = await params;
  if (facet && facet.length > 1) notFound();
  const page = placeFacetPage(place, facet?.[0]);
  if (!page) notFound();
  return <DatingFunnel h1={page.h1} lede={page.lede} crumbs={page.crumbs} related={page.related} />;
}
