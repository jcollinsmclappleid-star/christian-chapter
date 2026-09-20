import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "trust" | "brass" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-oxblood-light text-oxblood border-oxblood/20",
  trust: "bg-evergreen-light text-evergreen border-evergreen/20",
  brass: "bg-brass-light text-brass border-brass/30",
  muted: "bg-ivory-dark text-plum-muted border-border",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-2.5 py-1 rounded-full",
        "text-[12px] font-medium tracking-wide",
        "border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
