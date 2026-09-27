import { NEAREST_CITY_SLUG } from "./place-nearest.ts";
import { PLACES, placeBySlug, regionBySlug, regionPrimary, type Place } from "./seo/places.ts";

/** The city travel is measured from. A town uses the nearest listed city, not a road distance. */
export function areaForPlace(place: Place): { city: Place; town: Place | null; regionName: string } {
  const regionName = regionBySlug(place.region)?.name ?? "";
  if (place.kind === "city") return { city: place, town: null, regionName };
  const nearest = placeBySlug(NEAREST_CITY_SLUG[place.slug] ?? "");
  const city = nearest?.kind === "city" ? nearest : regionPrimary(place);
  if (!city) return { city: place, town: null, regionName };
  return { city, town: place, regionName };
}

export function searchPlaces(query: string, limit = 8): Place[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];
  return PLACES.filter((place) => place.name.toLowerCase().includes(needle))
    .sort((a, b) => Number(b.kind === "city") - Number(a.kind === "city") || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function areaLabel(selectedPlaceSlug: string, nameTown: boolean): string {
  const place = placeBySlug(selectedPlaceSlug);
  if (!place) return "";
  const area = areaForPlace(place);
  const town = nameTown && area.town ? area.town.name : "";
  return town ? `${town}, in the ${area.city.name} area` : area.city.name;
}

export function placeLine(selectedPlaceSlug: string, nameTown: boolean, miles: number): string {
  const where = areaLabel(selectedPlaceSlug, nameTown);
  if (!where) return "";
  return `${where} · ${miles} miles`;
}
