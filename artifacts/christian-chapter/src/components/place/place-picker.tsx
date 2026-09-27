"use client";

import { useMemo, useState } from "react";
import { areaForPlace, searchPlaces } from "@/lib/place-choice";
import { placeBySlug } from "@/lib/seo/places";
import { TRAVEL_MILES_MAX, TRAVEL_MILES_MIN } from "@/lib/site-config";

export function PlacePicker({
  selectedPlaceSlug,
  nameTown,
  miles,
  onChange,
}: {
  selectedPlaceSlug: string;
  nameTown: boolean;
  miles: number;
  onChange: (next: {
    selectedPlaceSlug: string;
    nameTown: boolean;
    travelRadiusMiles: number;
    ukRegion: string;
    homeCitySlug: string;
    homeTownSlug: string;
  }) => void;
}) {
  const [query, setQuery] = useState("");
  const [localSlug, setLocalSlug] = useState(selectedPlaceSlug);
  const [localTown, setLocalTown] = useState(nameTown);
  const slug = selectedPlaceSlug || localSlug;
  const townNamed = selectedPlaceSlug ? nameTown : localTown;
  const selected = placeBySlug(slug);
  const area = selected ? areaForPlace(selected) : null;
  const hits = useMemo(() => searchPlaces(query), [query]);

  function choose(slug: string, townNamed: boolean, nextMiles: number) {
    const place = placeBySlug(slug);
    if (!place) return;
    const next = areaForPlace(place);
    const named = Boolean(townNamed && next.town);
    setLocalSlug(slug);
    setLocalTown(named);
    onChange({
      selectedPlaceSlug: slug,
      nameTown: named,
      travelRadiusMiles: nextMiles,
      ukRegion: next.regionName,
      homeCitySlug: next.city.slug,
      homeTownSlug: named && next.town ? next.town.slug : "",
    });
    setQuery("");
  }

  return (
    <div>
      <label className="mb-2 block font-sans text-[15px] font-semibold" htmlFor="place-search">
        City or town
      </label>
      <input
        id="place-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Start typing a city or town"
        autoComplete="off"
        className="min-h-[52px] w-full rounded-2xl border border-ivory-darker bg-paper px-4 text-[16px]"
      />
      {hits.length > 0 && (
        <ul className="mt-2 overflow-hidden rounded-2xl border border-ivory-darker bg-paper">
          {hits.map((place) => (
            <li key={place.slug}>
              <button
                type="button"
                className="flex min-h-11 w-full items-center justify-between px-4 text-left text-[15px] hover:bg-life-light"
                onClick={() => choose(place.slug, townNamed, miles)}
              >
                <span>{place.name}</span>
                <span className="text-[12px] uppercase tracking-[0.12em] text-stone">{place.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {area && (
        <div className="mt-4 rounded-2xl bg-life-light px-4 py-3 text-[15px] leading-6 text-plum">
          <p>
            Your area is <span className="font-semibold">{area.city.name}</span>. Miles are measured from there.
          </p>
          {area.town && (
            <label className="mt-3 flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-life"
                checked={townNamed}
                onChange={(event) => choose(slug, event.target.checked, miles)}
              />
              <span>Name {area.town.name} on my profile. Otherwise only {area.city.name} is shown.</span>
            </label>
          )}
        </div>
      )}
      <label className="mt-5 block font-sans text-[15px] font-semibold" htmlFor="travel-miles">
        How far you will travel · {miles} miles
      </label>
      <input
        id="travel-miles"
        type="range"
        min={TRAVEL_MILES_MIN}
        max={TRAVEL_MILES_MAX}
        step={5}
        value={miles}
        onChange={(event) => choose(slug, townNamed, Number(event.target.value))}
        disabled={!selected}
        className="mt-3 w-full accent-life disabled:opacity-40"
      />
      <p className="mt-2 text-[13px] text-stone">
        From {TRAVEL_MILES_MIN} to {TRAVEL_MILES_MAX} miles.
      </p>
    </div>
  );
}
