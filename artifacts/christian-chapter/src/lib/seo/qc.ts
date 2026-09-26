import type { SeoBrief, WordBand } from "./briefs";

/**
 * Writer's second pass. Walk every item before a brief may leave noindex.
 * Length bands are a completeness check, not a padding target.
 * Google Search Central has no preferred word count. Writing to a number is a warning sign.
 * Thin means little unique value, or pages generated to catch query variants.
 * A page fails if it reaches the number by repeating another URL, the founding paragraph, or the age explanation.
 *
 * 1. H1, title, and meta description are unique among registry entries.
 * 2. The first 80 words do not repeat the first 80 words of another registry page.
 * 3. Every number, date, price, and product capability traces to site-config or the brief's allowed facts. No other statistics.
 * 4. No member counts, testimonials presented as real, an invented distance for a place, "verified", "background check", live chat, or "matching is open now". A member-chosen range of 10 to 200 miles is allowed.
 * 5. No sentence copied from Match, Christian Connection, Christian Mingle, Catholic Match, or eharmony.
 * 6. Word count sits inside the band, and the page still answers the primary query if the shared founding and age paragraphs are removed.
 * 7. Life-stage, tradition, and region pages meet the two-fifths unique-sentence rule.
 * 8. Voice is warm, reassuring, a little fun, and mature. Remove exclamation marks, "journey", "delve", "unlock", "swipe", and any claim the product does not do.
 * 9. Every editorial internal link resolves to a published indexable URL.
 * 10. A second pass, by a person or a fresh agent with the brief and site-config only, signs the record. Until that field is set, the page stays noindex.
 */

export const QC_CHECKLIST = [
  { id: 1, text: "H1, title, and meta description are unique among registry entries." },
  { id: 2, text: "The first 80 words do not repeat the first 80 words of another registry page." },
  { id: 3, text: "Every number, date, price, and product capability traces to site-config or the brief's allowed facts." },
  { id: 4, text: "No member counts, invented testimonials, invented place distances, verified badges, background checks, live chat, or a claim that matching is open now. The member-chosen range of 10 to 200 miles is allowed." },
  { id: 5, text: "No sentence copied from Match, Christian Connection, Christian Mingle, Catholic Match, or eharmony." },
  { id: 6, text: "Word count sits inside the band, and the page still answers the primary query without the shared founding and age paragraphs." },
  { id: 7, text: "Life-stage, tradition, and region pages have at least two fifths of sentences true only of that page." },
  { id: 8, text: "Voice is warm, reassuring, a little fun, and mature, without exclamation marks, journey, delve, unlock, or swipe." },
  { id: 9, text: "Every editorial internal link resolves to a published indexable URL." },
  { id: 10, text: "A second pass signs the record. Until that field is set, the page stays noindex." },
] as const;

export const VOICE_BANS = ["!", "journey", "delve", "unlock", "swipe"] as const;

export function firstWords(text: string, count = 80): string {
  return text.trim().split(/\s+/).filter(Boolean).slice(0, count).join(" ").toLowerCase();
}

export function wordCount(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function wordBandFailure(count: number, band: WordBand): string | null {
  if (band.kind === "product") return null;
  if (count > 1800) return `${count} words is past 1800`;
  if (count < band.min || count > band.max) return `${count} words is outside ${band.min}–${band.max}`;
  return null;
}

export function normalizeSentence(sentence: string): string {
  return sentence.replace(/\s+/g, " ").trim().toLowerCase();
}

export function uniqueSentenceShare(pageSentences: string[], otherSentences: string[]): number {
  if (!pageSentences.length) return 0;
  const other = new Set(otherSentences.map(normalizeSentence));
  const unique = pageSentences.filter((sentence) => !other.has(normalizeSentence(sentence)));
  return unique.length / pageSentences.length;
}

export function meetsUniqueSentenceRule(share: number, kind: WordBand["kind"]): boolean {
  if (kind !== "landing") return true;
  return share >= 2 / 5;
}

export function openingRepeats(pages: { path: string; opening: string }[]): string[] {
  const seen = new Map<string, string>();
  const failures: string[] = [];
  for (const page of pages) {
    const key = firstWords(page.opening);
    if (!key) continue;
    const prior = seen.get(key);
    if (prior) failures.push(`${page.path} repeats the opening of ${prior}`);
    else seen.set(key, page.path);
  }
  return failures;
}

export function duplicateMetadata(records: SeoBrief[]): string[] {
  const failures: string[] = [];
  const fields = ["h1", "title", "description"] as const;
  for (const field of fields) {
    const seen = new Map<string, string>();
    for (const record of records) {
      const value = record[field].trim();
      const prior = seen.get(value);
      if (prior) failures.push(`${record.path} ${field} repeats ${prior}`);
      else seen.set(value, record.path);
    }
  }
  return failures;
}

export function forbiddenHits(source: string, phrases: readonly string[]): string[] {
  const haystack = source.toLowerCase();
  return phrases.filter((phrase) => haystack.includes(phrase.toLowerCase()));
}

export function voiceHits(text: string): string[] {
  const lower = text.toLowerCase();
  return VOICE_BANS.filter((ban) => (ban === "!" ? text.includes("!") : lower.includes(ban)));
}

export function editorialLinkProblems(records: SeoBrief[]): string[] {
  const indexable = new Set(records.filter((record) => record.status === "published" && record.index === "index").map((record) => record.path));
  const problems: string[] = [];
  for (const record of records) {
    for (const link of record.internalLinks) {
      if (!indexable.has(link)) problems.push(`${record.path} links to ${link}`);
    }
  }
  return problems;
}
