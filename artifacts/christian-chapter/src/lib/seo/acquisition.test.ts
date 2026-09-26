import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { acquisitionPages } from "./acquisition.ts";
import { HUB_PLACE_SLUGS, PLACES, REGIONS, TOP_PLACE_SLUGS, isTopPlace, placesInRegion } from "./places.ts";
import { FORBIDDEN_CLAIM_PHRASES, seoBriefs } from "./briefs.ts";
import { forbiddenHits, voiceHits } from "./qc.ts";
import { MINIMUM_AGE, TRAVEL_MILES_COPY, TRAVEL_MILES_MAX, TRAVEL_MILES_MIN } from "../site-config.ts";

const ALLOWED_NUMBERS = new Set([String(MINIMUM_AGE), "45", "50", "55", "60", "65", "70", String(TRAVEL_MILES_MIN), String(TRAVEL_MILES_MAX)]);

describe("acquisition funnels", () => {
  it("publishes a city and a town in every nation and region", () => {
    for (const region of REGIONS) {
      const places = placesInRegion(region.slug);
      assert.ok(places.some((place) => place.kind === "city"), region.slug);
      assert.ok(places.some((place) => place.kind === "town"), region.slug);
    }
    assert.ok(PLACES.filter((place) => place.kind === "town").length >= 80);
    assert.equal(new Set(PLACES.map((place) => place.slug)).size, PLACES.length);
  });

  it("keeps funnel copy short, unique, and free of invented facts", () => {
    assert.equal(TRAVEL_MILES_COPY, "You choose how far you will travel, from 10 to 200 miles.");
    const seen = new Map<string, string>();
    for (const field of ["h1", "title", "description", "lede"] as const) {
      seen.clear();
      for (const page of acquisitionPages) {
        const prior = seen.get(page[field]);
        assert.equal(prior, undefined, `${page.path} ${field} repeats ${prior}`);
        seen.set(page[field], page.path);
      }
    }
    for (const page of acquisitionPages) {
      const words = page.lede.trim().split(/\s+/).length;
      assert.ok(words >= 12 && words <= 80, `${page.path} lede has ${words} words`);
      assert.deepEqual(voiceHits(page.lede), [], page.path);
      assert.deepEqual(forbiddenHits(`${page.h1} ${page.lede} ${page.description}`, FORBIDDEN_CLAIM_PHRASES), [], page.path);
      assert.doesNotMatch(page.lede, /\d+\s*miles|members in|verified|background check|live chat|matching is open now/i, page.path);
      const numbers = `${page.h1} ${page.lede} ${page.description}`.match(/\d+/g) ?? [];
      for (const number of numbers) {
        assert.ok(ALLOWED_NUMBERS.has(number), `${page.path} has number ${number}`);
      }
    }
  });

  it("limits age, Catholic, divorce, and free city pages to the largest places", () => {
    for (const slug of TOP_PLACE_SLUGS) {
      assert.ok(acquisitionPages.some((page) => page.path === `/christian-dating/in/${slug}`));
      assert.ok(acquisitionPages.some((page) => page.path === `/christian-dating/in/${slug}/over-50`));
      assert.ok(acquisitionPages.some((page) => page.path === `/free-christian-dating/in/${slug}`));
    }
    for (const slug of HUB_PLACE_SLUGS) {
      assert.ok(acquisitionPages.some((page) => page.path === `/christian-dating/in/${slug}/over-40`));
      assert.ok(acquisitionPages.some((page) => page.path === `/christian-dating/in/${slug}/over-60`));
      assert.ok(acquisitionPages.some((page) => page.path === `/christian-dating/in/${slug}/anglican`));
      assert.ok(acquisitionPages.some((page) => page.path === `/christian-dating/in/${slug}/widowed`));
    }
    for (const extra of ["baptist", "methodist", "pentecostal", "evangelical", "remarriage", "after-bereavement"]) {
      assert.ok(acquisitionPages.some((page) => page.path === `/christian-dating/in/london/${extra}`));
      assert.equal(acquisitionPages.some((page) => page.path === `/christian-dating/in/birmingham/${extra}`), false, extra);
    }
    for (const place of PLACES) {
      if (isTopPlace(place.slug)) continue;
      assert.equal(acquisitionPages.some((page) => page.path === `/christian-dating/in/${place.slug}/over-50`), false, place.slug);
      assert.equal(acquisitionPages.some((page) => page.path === `/christian-dating/in/${place.slug}/over-40`), false, place.slug);
    }
    assert.ok(placesInRegion("greater-london").length >= 50);
    assert.ok(acquisitionPages.some((page) => page.path === "/free-christian-dating"));
    assert.ok(acquisitionPages.some((page) => page.path === "/christian-dating/in/harrogate"));
    assert.ok(acquisitionPages.some((page) => page.path === "/christian-dating/in/tunbridge-wells"));
    assert.ok(acquisitionPages.some((page) => page.path === "/christian-dating/in/islington"));
    assert.ok(acquisitionPages.some((page) => page.path === "/christian-dating/in/salford"));
    const metadataSource = readFileSync(new URL("../metadata.ts", import.meta.url), "utf8");
    assert.doesNotMatch(metadataSource, /40[–-]70/);
    const hub = seoBriefs.find((item) => item.path === "/christian-dating");
    assert.doesNotMatch(hub?.description ?? "", /40[–-]70/);
    for (const page of acquisitionPages) {
      assert.doesNotMatch(`${page.h1} ${page.lede} ${page.description}`, /40[–-]70/, page.path);
    }
  });
});
