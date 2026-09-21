export type ProfilePrompt = { prompt: string; answer: string };

export const DEFAULT_PROMPTS: ProfilePrompt[] = [
  { prompt: "What has this chapter of life taught you?", answer: "" },
  { prompt: "A moment that shaped who you are today", answer: "" },
  { prompt: "What does a good ordinary day look like for you?", answer: "" },
];

export function parsePrompts(raw: unknown): ProfilePrompt[] {
  const incoming = Array.isArray(raw) ? raw : [];
  const mapped = incoming
    .filter((row): row is ProfilePrompt =>
      Boolean(row && typeof row === "object" && "prompt" in row),
    )
    .map((row) => ({
      prompt: String(row.prompt ?? ""),
      answer: String(row.answer ?? ""),
    }))
    .filter((row) => row.prompt);

  if (mapped.length >= 3) return mapped.slice(0, 6);
  const used = new Set(mapped.map((row) => row.prompt));
  return [...mapped, ...DEFAULT_PROMPTS.filter((row) => !used.has(row.prompt))].slice(0, 3);
}

export function answeredPrompts(prompts: ProfilePrompt[]): ProfilePrompt[] {
  return prompts.filter((row) => row.answer.trim().length > 0);
}
