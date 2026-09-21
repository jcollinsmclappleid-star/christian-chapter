/** Map pre-FND-01 waitlist statuses onto founding_applications statuses. */

export function normalizeApplicationStatusFilter(status: string): string {
  if (status === "pending") return "submitted";
  if (status === "active") return "accepted";
  return status;
}

export const ADMIN_STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Submitted" },
  { key: "in_review", label: "In review" },
  { key: "accepted", label: "Accepted" },
  { key: "waitlisted", label: "Waitlisted" },
  { key: "flagged", label: "Flagged" },
  { key: "declined", label: "Declined" },
  { key: "closure_requested", label: "Closure" },
] as const;
