import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { servicePages } from "./service-pages.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function sentencesFor(page: (typeof servicePages)[number]): string[] {
  const copy = [
    page.intro,
    page.focus.body,
    ...page.benefits.map((item) => item.body),
    page.processIntro,
    ...page.steps.map((item) => item.body),
    page.note.body,
    ...page.faqs.map((item) => item.a),
  ].join(" ");

  return copy
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim().toLowerCase())
    .filter((sentence) => sentence.split(/\s+/).length >= 6);
}

describe("service SEO pages", () => {
  it("assigns a distinct query, title, description and heading to every service", () => {
    assert.equal(servicePages.length, 7);
    for (const field of ["path", "primaryQuery", "title", "description", "h1", "intro"] as const) {
      assert.equal(new Set(servicePages.map((page) => page[field])).size, servicePages.length, field);
    }
  });

  it("keeps at least 80% of substantive sentences unique to each page", () => {
    const counts = new Map<string, number>();
    for (const page of servicePages) {
      for (const sentence of new Set(sentencesFor(page))) {
        counts.set(sentence, (counts.get(sentence) ?? 0) + 1);
      }
    }

    for (const page of servicePages) {
      const sentences = sentencesFor(page);
      const unique = sentences.filter((sentence) => counts.get(sentence) === 1);
      assert.ok(unique.length / sentences.length >= 0.8, `${page.path} is not sufficiently unique`);
    }
  });

  it("renders every root route with the service page and conversion path", () => {
    const component = readFileSync(path.join(root, "components/seo/service-page.tsx"), "utf8");
    assert.match(component, /href="\/register"/);
    assert.match(component, /FAQPage/);
    assert.match(component, /BreadcrumbList/);

    for (const page of servicePages) {
      const route = readFileSync(path.join(root, page.sourceFile), "utf8");
      assert.match(route, /ServicePage/);
      assert.match(route, new RegExp(page.path.replaceAll("/", "\\/")));
    }
  });
});
