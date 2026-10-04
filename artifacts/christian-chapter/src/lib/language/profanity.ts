/**
 * Blocks clear profanity and slurs in names and profile text.
 * A list cannot catch every insult. It does stop the obvious cases, including
 * letters split by spaces or symbols.
 */

export const PROFANITY_MESSAGE =
  "Please take the offensive language out of your name or profile.";

const EXACT = new Set([
  "ass",
  "arse",
  "asshole",
  "arsehole",
  "bastard",
  "bitch",
  "bollocks",
  "bugger",
  "cock",
  "cunt",
  "dickhead",
  "fuck",
  "fucker",
  "fucking",
  "motherfucker",
  "piss",
  "prick",
  "shit",
  "shite",
  "slut",
  "twat",
  "wank",
  "wanker",
  "whore",
  "faggot",
  "nigger",
  "retard",
  "spastic",
]);

/** Long enough that they rarely sit inside an ordinary word. */
const EMBEDDED = ["fuck", "shit", "bitch", "cunt", "whore", "slut", "wank", "twat", "bollock", "nigger", "faggot"];

function squashToken(token: string): string {
  return token
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/3/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/0/g, "o")
    .replace(/[5$]/g, "s")
    .replace(/[^a-z]/g, "")
    .replace(/(.)\1{2,}/g, "$1");
}

function tokens(value: string): string[] {
  const parts = value.toLowerCase().split(/[^a-z0-9@$!|]+/).filter(Boolean);
  const words: string[] = [];
  let letters = "";
  for (const part of parts) {
    if (part.length === 1 && /[a-z]/.test(part)) {
      letters += part;
      continue;
    }
    if (letters) {
      words.push(letters);
      letters = "";
    }
    words.push(part);
  }
  if (letters) words.push(letters);
  return words.map(squashToken).filter((word) => word.length > 1);
}

function tokenBlocked(token: string): boolean {
  if (EXACT.has(token)) return true;
  return EMBEDDED.some(
    (word) => token.includes(word) && token.length > word.length && token.length <= word.length + 5,
  );
}

export function containsProfanity(value: string): boolean {
  return tokens(value).some(tokenBlocked);
}

export function anyProfanity(parts: unknown[]): boolean {
  return flatten(parts).some(containsProfanity);
}

function flatten(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (value && typeof value === "object") return Object.values(value).flatMap(flatten);
  return [];
}
