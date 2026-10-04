export function isDeletionDue(
  scheduledDeleteAt: Date | string | null,
  now: Date,
): boolean {
  if (!scheduledDeleteAt) return true;
  return new Date(scheduledDeleteAt).getTime() <= now.getTime();
}
