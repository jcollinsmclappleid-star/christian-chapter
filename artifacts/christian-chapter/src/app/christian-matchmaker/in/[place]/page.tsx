import { notFound } from "next/navigation";
import { AcquisitionScreen, acquisitionMetadata } from "@/components/seo/acquisition-screen";
import { isTopPlace, PLACES } from "@/lib/seo/places";

export const dynamicParams = false;

export function generateStaticParams() {
  return PLACES.filter((place) => isTopPlace(place.slug)).map((place) => ({ place: place.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ place: string }> }) {
  const { place } = await params;
  return acquisitionMetadata(`/christian-matchmaker/in/${place}`);
}

export default async function CityMatchmakerPage({ params }: { params: Promise<{ place: string }> }) {
  const { place } = await params;
  if (!isTopPlace(place)) notFound();
  return <AcquisitionScreen path={`/christian-matchmaker/in/${place}`} />;
}
