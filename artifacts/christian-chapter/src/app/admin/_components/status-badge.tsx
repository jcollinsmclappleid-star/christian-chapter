const styles: Record<string, string> = {
  draft: "bg-ivory-darker text-stone border border-border",
  pending: "bg-brass-light text-brass border border-brass/30",
  submitted: "bg-brass-light text-brass border border-brass/30",
  in_review: "bg-brass-light text-brass border border-brass/30",
  accepted: "bg-evergreen-light text-evergreen border border-evergreen/30",
  active: "bg-evergreen-light text-evergreen border border-evergreen/30",
  waitlisted: "bg-ivory-dark text-plum-muted border border-border",
  flagged: "bg-oxblood-light text-oxblood border border-oxblood/25",
  declined: "bg-ivory-darker text-stone border border-border",
  closure_requested: "bg-oxblood-light text-oxblood border border-oxblood/25",
  closed: "bg-ivory-darker text-stone border border-border",
  review: "bg-brass-light text-brass border border-brass/30",
  changes_required: "bg-oxblood-light text-oxblood border border-oxblood/25",
  approved: "bg-evergreen-light text-evergreen border border-evergreen/30",
  paused: "bg-ivory-dark text-plum-muted border border-border",
  hidden: "bg-ivory-darker text-stone border border-border",
};

const labels: Record<string, string> = {
  draft: "Draft",
  pending: "Pending",
  submitted: "Submitted",
  in_review: "In review",
  accepted: "Accepted",
  active: "Active",
  waitlisted: "Waitlisted",
  flagged: "Flagged",
  declined: "Declined",
  closure_requested: "Closure requested",
  closed: "Closed",
  review: "In review",
  changes_required: "Changes required",
  approved: "Approved",
  paused: "Paused",
  hidden: "Hidden",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.08em] ${
        styles[status] ?? styles.submitted
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}
