import { FunnelPage } from "@/components/seo/funnel-page";
import { buildMetadata } from "@/lib/metadata";
import { funnelBySlug, funnelSlugs } from "@/lib/seo/funnels";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return funnelSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = funnelBySlug(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
  });
}

export default async function ChristianDatingFunnelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = funnelBySlug(slug);
  if (!page) notFound();
  return <FunnelPage page={page} />;
}
