import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MEMBER_PRICE_LABEL, OPENING_OFFER_ENDS_LABEL } from "../site-config.ts";
import {
  ALLOWED_FACT_KEYS,
  mayIndex,
  promotionBlockers,
  seoBriefs,
} from "./briefs.ts";
import {
  QC_CHECKLIST,
  duplicateMetadata,
  editorialLinkProblems,
  forbiddenHits,
  meetsUniqueSentenceRule,
  openingRepeats,
  uniqueSentenceShare,
  voiceHits,
  wordBandFailure,
  wordCount,
} from "./qc.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel: string) {
  return readFileSync(path.join(root, rel), "utf8");
}

const PUBLISHED_PATHS = [
  "/",
  "/how-it-works",
  "/safety",
  "/pricing",
  "/christian-dating",
  "/christian-dating/over-40",
  "/christian-dating/over-50",
  "/christian-dating/over-60",
  "/christian-dating/after-divorce",
  "/christian-dating/after-bereavement",
  "/christian-dating/remarriage",
  "/guides/safety/romance-fraud",
  "/guides/christian-relationships/dating-across-denominations",
  "/success-stories",
  "/privacy",
  "/terms",
  "/cookies",
];

describe("seo registry", () => {
  it("walks the ten QC checks", () => {
    assert.deepEqual(QC_CHECKLIST.map((item) => item.id), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.equal(wordBandFailure(700, seoBriefs.find((item) => item.path === "/safety")!.wordBand), null);
    assert.ok(wordBandFailure(500, seoBriefs.find((item) => item.path === "/safety")!.wordBand));
    assert.equal(wordCount("one two three"), 3);
    assert.equal(meetsUniqueSentenceRule(0.4, "landing"), true);
    assert.equal(meetsUniqueSentenceRule(0.39, "landing"), false);
    assert.equal(uniqueSentenceShare(["Only this page.", "Shared."], ["Shared."]), 0.5);
    assert.deepEqual(openingRepeats([
      { path: "/a", opening: "same opening words" },
      { path: "/b", opening: "same opening words" },
    ]).length, 1);
    assert.deepEqual(voiceHits("A warm line."), []);
    assert.ok(voiceHits("Start the journey!").length >= 2);
  });

  it("lists every published path and keeps briefs empty", () => {
    const published = seoBriefs.filter((item) => item.status === "published");
    assert.deepEqual(published.map((item) => item.path).sort(), [...PUBLISHED_PATHS].sort());
    for (const pathName of PUBLISHED_PATHS) {
      assert.ok(seoBriefs.some((item) => item.path === pathName), pathName);
    }
    for (const item of seoBriefs.filter((entry) => entry.status === "brief")) {
      assert.equal(item.body, "");
      assert.equal(item.index, "noindex");
      assert.equal(item.secondPassSignedAt, null);
      assert.equal(mayIndex(item), false);
      assert.ok(promotionBlockers(item).length > 0);
    }
    assert.equal(duplicateMetadata(seoBriefs).join("\n"), "");
    assert.equal(editorialLinkProblems(seoBriefs).join("\n"), "");
    for (const item of seoBriefs) {
      for (const fact of item.allowedFacts) {
        assert.ok(ALLOWED_FACT_KEYS.includes(fact), fact);
      }
    }
    const pricing = seoBriefs.find((item) => item.path === "/pricing");
    assert.match(pricing?.h1 ?? "", new RegExp(OPENING_OFFER_ENDS_LABEL));
    assert.match(pricing?.description ?? "", new RegExp(MEMBER_PRICE_LABEL.replace("£", "£")));
  });

  it("keeps unpublished paths out of the sitemap and forbidden claims out of published pages", () => {
    const sitemap = read("app/sitemap.ts");
    assert.doesNotMatch(sitemap, /new Date\(\)/);
    assert.match(sitemap, /mayIndex/);
    for (const item of seoBriefs.filter((entry) => entry.status === "brief")) {
      assert.equal(sitemap.includes(item.path), false, item.path);
    }
    for (const item of seoBriefs.filter((entry) => entry.status === "published")) {
      assert.ok(item.sourceFile, item.path);
      const source = read(item.sourceFile!);
      const hits = forbiddenHits(source, item.forbiddenClaims);
      assert.deepEqual(hits, [], `${item.path}: ${hits.join(", ")}`);
    }
    const robots = read("app/robots.ts");
    for (const rule of ["/register/", "/admin/", "/api/", "/account", "/profile", "/sign-in", "/verify"]) {
      assert.match(robots, new RegExp(rule.replace("/", "\\/")));
    }
  });
});
