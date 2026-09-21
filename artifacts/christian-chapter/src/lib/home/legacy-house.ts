/** Old Chapter House query values. All product rooms now land on How it works. */
export const LEGACY_HOUSE_MODES = [
  "table",
  "library",
  "path",
  "garden",
  "courtyard",
  "membership",
] as const;

export function legacyHouseTarget(search: string): string | null {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const house = params.get("house");
  const hasHouseParam = params.has("house") || params.has("houseTier") || params.has("view");
  if (!hasHouseParam) return null;
  if (house && (LEGACY_HOUSE_MODES as readonly string[]).includes(house)) return "#how-it-works";
  return "";
}
