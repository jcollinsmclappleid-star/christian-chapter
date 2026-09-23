/** Pure checks for an administrator connecting two profiles. */

export const HAND_PICK_POOL = "handpicked";

const CONNECTABLE = new Set(["submitted", "review", "approved"]);

export type HandPickProfile = {
  userId: string;
  status: string;
  hidden: boolean;
  emailVerified: boolean;
  accountClosed: boolean;
};

export function handPickBlockers(
  a: HandPickProfile,
  b: HandPickProfile,
  blocked: boolean,
): string | null {
  if (a.userId === b.userId) return "Choose two different profiles.";
  if (blocked) return "A block or a report already keeps these two apart.";
  for (const person of [a, b]) {
    if (person.accountClosed) return "One of these accounts is closed.";
    if (!person.emailVerified) return "Both people need a confirmed email.";
    if (person.hidden || !CONNECTABLE.has(person.status)) {
      return "Both profiles need to be submitted before they can be connected.";
    }
  }
  return null;
}

export function handPickedStillOpen(input: {
  samePerson: boolean;
  viewerClosed: boolean;
  candidateClosed: boolean;
  viewerHidden: boolean;
  candidateHidden: boolean;
  blocked: boolean;
}): boolean {
  return !(
    input.samePerson ||
    input.viewerClosed ||
    input.candidateClosed ||
    input.viewerHidden ||
    input.candidateHidden ||
    input.blocked
  );
}
