import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { articleSentences, articleText } from "./article.ts";
import { searchArticles } from "./catalog.ts";
import { FORBIDDEN_CLAIM_PHRASES } from "./briefs.ts";
import { firstWords, forbiddenHits, normalizeSentence, voiceHits, wordCount } from "./qc.ts";

const LANDING = new Set(
  searchArticles
    .filter((article) => article.path.startsWith("/christian-dating/"))
    .map((article) => article.path),
);

const BANDS: Record<string, [number, number]> = {
  "/guides": [650, 850],
  "/guides/writing-your-profile": [1250, 1550],
  "/guides/a-first-meeting": [1250, 1550],
  "/guides/first-dates-after-40": [1250, 1550],
};

describe("search intent articles", () => {
  it("keeps each article inside its word band and free of banned voice", () => {
    for (const article of searchArticles) {
      const text = articleText(article);
      const count = wordCount([article.lede, ...article.sections.flatMap((section) => section.paragraphs), ...article.faqs.map((faq) => faq.a)].join(" "));
      const [min, max] = BANDS[article.path] ?? [950, 1150];
      assert.ok(count >= min && count <= max, `${article.path} has ${count} words`);
      assert.deepEqual(voiceHits(text), [], article.path);
      assert.deepEqual(forbiddenHits(text, FORBIDDEN_CLAIM_PHRASES), [], article.path);
    }
  });

  it("does not repeat an opening or a full sentence", () => {
    const openings = searchArticles.map((article) => ({ path: article.path, opening: firstWords(article.lede) }));
    const seenOpen = new Map<string, string>();
    for (const item of openings) {
      const prior = seenOpen.get(item.opening);
      assert.equal(prior, undefined, `${item.path} repeats the opening of ${prior}`);
      seenOpen.set(item.opening, item.path);
    }

    const owners = new Map<string, string>();
    const duplicates: string[] = [];
    for (const article of searchArticles) {
      for (const sentence of articleSentences(article)) {
        const key = normalizeSentence(sentence);
        const prior = owners.get(key);
        if (prior) duplicates.push(`${article.path} repeats ${prior}: ${sentence.slice(0, 90)}`);
        else owners.set(key, article.path);
      }
    }
    assert.deepEqual(duplicates, []);
  });

  it("keeps two fifths of landing sentences unique to that page", () => {
    for (const article of searchArticles) {
      if (!LANDING.has(article.path)) continue;
      const mine = articleSentences(article).map(normalizeSentence);
      const others = new Set(
        searchArticles
          .filter((item) => item.path !== article.path)
          .flatMap((item) => articleSentences(item).map(normalizeSentence)),
      );
      const unique = mine.filter((sentence) => !others.has(sentence));
      const share = unique.length / mine.length;
      assert.ok(share >= 0.4, `${article.path} unique share ${share.toFixed(2)}`);
    }
  });
});
