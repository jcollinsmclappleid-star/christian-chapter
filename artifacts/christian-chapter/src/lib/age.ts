/** Civil-date age in Europe/London. DOB is ISO YYYY-MM-DD. */

export type CivilDate = { year: number; month: number; day: number };

export function parseIsoDate(iso: string): CivilDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

export function civilDateInTimeZone(
  now: Date,
  timeZone = "Europe/London",
): CivilDate {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const num = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  return {
    year: num("year"),
    month: num("month"),
    day: num("day"),
  };
}

export function ageOnDate(dob: CivilDate, on: CivilDate): number {
  let age = on.year - dob.year;
  if (on.month < dob.month || (on.month === dob.month && on.day < dob.day)) {
    age -= 1;
  }
  return age;
}

export function getAge(
  isoDob: string,
  now: Date = new Date(),
  timeZone = "Europe/London",
): number | null {
  const dob = parseIsoDate(isoDob);
  if (!dob) return null;
  return ageOnDate(dob, civilDateInTimeZone(now, timeZone));
}

export function isAtLeastAge(
  isoDob: string,
  minimum: number,
  now: Date = new Date(),
  timeZone = "Europe/London",
): boolean {
  const age = getAge(isoDob, now, timeZone);
  return age !== null && age >= minimum;
}
