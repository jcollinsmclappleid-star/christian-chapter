import { addDays } from "./clock.ts";
import { SAVE_DAYS } from "./types.ts";

export type InterestKind = "talk" | "save" | "decline";
export type InterestStatus = "open" | "closed" | "expired";
export type MatchStatus = "open" | "closed";

export type InterestRow = {
  fromUserId: string;
  toUserId: string;
  kind: InterestKind;
  status: InterestStatus;
  createdAt: Date;
  expiresAt: Date | null;
};

export function orderedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export function applyInterestAction(input: {
  existing: InterestRow | null;
  actorId: string;
  otherId: string;
  action: InterestKind;
  now: Date;
}): {
  kind: InterestKind;
  status: InterestStatus;
  expiresAt: Date | null;
  closedForSender: boolean;
} {
  if (input.action === "save") {
    return {
      kind: "save",
      status: "open",
      expiresAt: addDays(input.now, SAVE_DAYS),
      closedForSender: false,
    };
  }
  if (input.action === "decline") {
    return {
      kind: "decline",
      status: "closed",
      expiresAt: null,
      closedForSender: true,
    };
  }
  return {
    kind: "talk",
    status: "open",
    expiresAt: null,
    closedForSender: false,
  };
}

export function reciprocalCreatesMatch(
  outgoing: { kind: string; status: string } | null,
  incoming: { kind: string; status: string } | null,
): boolean {
  return outgoing?.kind === "talk" && outgoing.status === "open" && incoming?.kind === "talk" && incoming.status === "open";
}

export function saveExpired(row: { kind: string; status: string; expiresAt: Date | null }, now: Date): boolean {
  return row.kind === "save" && row.status === "open" && Boolean(row.expiresAt && row.expiresAt <= now);
}

export function publicInterestState(input: {
  mine: { kind: string; status: string } | null;
  theirs: { kind: string; status: string } | null;
  matchStatus: MatchStatus | null;
}): "new_interest" | "pending" | "matched" | "closed" | "saved" | "none" {
  if (input.matchStatus === "open") return "matched";
  if (input.matchStatus === "closed") return "closed";
  if (input.mine?.kind === "decline" || input.theirs?.kind === "decline") return "closed";
  if (input.mine?.kind === "save" && input.mine.status === "open") return "saved";
  if (input.theirs?.kind === "talk" && input.theirs.status === "open" && input.mine?.kind !== "talk") return "new_interest";
  if (input.mine?.kind === "talk" && input.mine.status === "open") return "pending";
  return "none";
}

export const CLOSURE_TEMPLATES = [
  {
    id: "blessing",
    label: "A short blessing",
    text: "Thank you for the conversation. I wish you every blessing for whatever comes next.",
  },
  {
    id: "kind_close",
    label: "A kind close",
    text: "I’ve enjoyed meeting you here. I’m going to close this conversation, with gratitude.",
  },
  {
    id: "not_the_season",
    label: "Not the right season",
    text: "This isn’t the right season for me. I wish you well, truly.",
  },
] as const;
