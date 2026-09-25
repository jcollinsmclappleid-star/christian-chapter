import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FUNNEL_FAQS, PUBLIC_CLAIMS, SHOWCASE } from "./claims.ts";
import { FUNNELS, commentaryText, funnelByPath, wordCount } from "./funnels.ts";

const FORBIDDEN = [
  /40\s*[–-]\s*70/,
  /£/,
  /\d+\s*%/,
  /\bmiles?\b/i,
  /\bguarantee/i,
  /background check/i,
  /live chat/i,
  /matching is open/i,
  /verified members/i,
  /we (will|never) introduce/i,
  /\bautomatically\b/i,
  /\bthousands\b/i,
  /\bhundreds\b/i,
  /!/,
  /\bswipe/i,
  /\bdelve\b/i,
  /\bunlock\b/i,
  /\bjourney\b/i,
  /member count/i,
  /AggregateRating/i,
];

describe("search funnels", () => {
  it("keeps a high-intent set with unique metadata", () => {
    assert.equal(FUNNELS.length, 12);
    const titles = FUNNELS.map((page) => page.title);
    const descriptions = FUNNELS.map((page) => page.description);
    const h1s = FUNNELS.map((page) => page.h1);
    const paths = FUNNELS.map((page) => page.path);
    for (const values of [titles, descriptions, h1s, paths]) {
      assert.equal(new Set(values).size, values.length);
    }
  });

  it("keeps commentary long enough to index and short of an article", () => {
    for (const page of FUNNELS) {
      const words = wordCount(commentaryText(page));
      assert.ok(words >= 70 && words <= 180, `${page.path} has ${words} words`);
      assert.ok(page.description.length >= 110 && page.description.length <= 170, page.path);
    }
  });

  it("keeps search copy free of invented product facts", () => {
    for (const page of FUNNELS) {
      const copy = [page.title, page.description, page.h1, page.eyebrow, page.lede, ...page.commentary].join("\n");
      for (const pattern of FORBIDDEN) {
        assert.equal(pattern.test(copy), false, `${page.path} matched ${pattern}`);
      }
      for (const path of page.related) {
        assert.ok(funnelByPath(path), path);
        assert.notEqual(path, page.path);
      }
    }
  });

  it("renders product facts only from the claim lock", () => {
    assert.match(PUBLIC_CLAIMS.matching, /not live/);
    assert.match(PUBLIC_CLAIMS.age, /no maximum age/);
    assert.match(PUBLIC_CLAIMS.founding, /free during the founding phase/);
    assert.equal(PUBLIC_CLAIMS.ctaHref, "/register");
    const rendered = [...SHOWCASE.map((room) => room.body), ...FUNNEL_FAQS.map((item) => item.a)].join(" ");
    assert.match(rendered, /Matching is not live/);
    assert.doesNotMatch(rendered, /40\s*[–-]\s*70/);
    assert.doesNotMatch(rendered, /£|verified members|background check|live chat/i);
  });
});
