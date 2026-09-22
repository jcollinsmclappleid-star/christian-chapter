import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type LabelHTMLAttributes } from "react";

// ── Label ──────────────────────────────────────────────────────────

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-[15px] font-medium text-plum mb-2",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-oxblood ml-1" aria-hidden>*</span>}
    </label>
  );
}

// ── Input ──────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 min-h-[52px]",
          "bg-paper border rounded-md",
          "text-[16px] text-plum placeholder:text-stone",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-oxblood focus:border-transparent",
          error
            ? "border-oxblood ring-1 ring-oxblood"
            : "border-border-medium hover:border-plum/30",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// ── Textarea ───────────────────────────────────────────────────────

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full px-4 py-3",
          "bg-paper border rounded-md",
          "text-[16px] text-plum placeholder:text-stone",
          "resize-y min-h-[120px]",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-oxblood focus:border-transparent",
          error
            ? "border-oxblood ring-1 ring-oxblood"
            : "border-border-medium hover:border-plum/30",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// ── Select ─────────────────────────────────────────────────────────

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { error?: string }>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-3 min-h-[52px]",
          "bg-paper border rounded-md",
          "text-[16px] text-plum",
          "appearance-none cursor-pointer",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-oxblood focus:border-transparent",
          error
            ? "border-oxblood ring-1 ring-oxblood"
            : "border-border-medium hover:border-plum/30",
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231E1220' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
          paddingRight: "44px",
        }}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

// ── Field (wraps label + input + error) ───────────────────────────

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {hint && <p className="text-[13px] text-stone mb-2">{hint}</p>}
      {children}
      {error && (
        <p className="text-[13px] text-oxblood mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
