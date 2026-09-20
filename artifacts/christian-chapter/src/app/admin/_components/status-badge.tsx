const styles: Record<string, string> = {
  pending:  "bg-brass-light text-brass border border-brass/30",
  active:   "bg-evergreen-light text-evergreen border border-evergreen/30",
  flagged:  "bg-oxblood-light text-oxblood border border-oxblood/25",
  declined: "bg-ivory-darker text-stone border border-border",
};

const labels: Record<string, string> = {
  pending:  "Pending",
  active:   "Active",
  flagged:  "Flagged",
  declined: "Declined",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.08em] ${
        styles[status] ?? styles.pending
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}
