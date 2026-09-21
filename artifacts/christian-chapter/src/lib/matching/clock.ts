export function resolveNow(input?: string | Date | null): Date {
  if (!input) return new Date();
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid clock value.");
  }
  return date;
}

export function addDays(now: Date, days: number): Date {
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

export function daysBetween(later: Date, earlier: Date): number {
  return (later.getTime() - earlier.getTime()) / (24 * 60 * 60 * 1000);
}
