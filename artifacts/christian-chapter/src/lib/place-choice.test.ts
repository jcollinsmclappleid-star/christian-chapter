import assert from "node:assert/strict";
import test from "node:test";
import { areaForPlace, placeLine, searchPlaces } from "./place-choice.ts";
import { placeBySlug } from "./seo/places.ts";

test("a town uses the nearest listed city", () => {
  const harrogate = placeBySlug("harrogate");
  assert.ok(harrogate);
  const area = areaForPlace(harrogate);
  assert.equal(area.city.slug, "leeds");
  assert.equal(area.town?.slug, "harrogate");
  assert.equal(area.regionName, "Yorkshire and the Humber");
  assert.equal(areaForPlace(placeBySlug("guildford")!).city.slug, "reading");
  assert.equal(areaForPlace(placeBySlug("scarborough")!).city.slug, "york");
  assert.equal(areaForPlace(placeBySlug("kensington")!).city.slug, "london");
  assert.equal(areaForPlace(placeBySlug("weston-super-mare")!).city.slug, "bristol");
  assert.equal(areaForPlace(placeBySlug("ashford")!).city.slug, "canterbury");
});

test("a city is its own area", () => {
  const leeds = placeBySlug("leeds");
  assert.ok(leeds);
  const area = areaForPlace(leeds);
  assert.equal(area.city.slug, "leeds");
  assert.equal(area.town, null);
});

test("naming a town is optional in the profile line", () => {
  assert.match(placeLine("harrogate", false, 40), /^Leeds · 40 miles$/);
  assert.match(placeLine("harrogate", true, 40), /Harrogate, in the Leeds area · 40 miles/);
});

test("search prefers cities", () => {
  const hits = searchPlaces("man");
  assert.equal(hits[0]?.slug, "manchester");
});
