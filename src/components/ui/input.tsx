import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-[var(--color-sand-200)] bg-white/70 px-4 text-sm text-[var(--color-deep-900)] placeholder:text-[var(--color-sand-700)]/60 transition-colors focus:border-[var(--color-ocean-500)] focus:bg-white focus:outline-none",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-2xl border border-[var(--color-sand-200)] bg-white/70 px-4 py-3 text-sm text-[var(--color-deep-900)] placeholder:text-[var(--color-sand-700)]/60 transition-colors focus:border-[var(--color-ocean-500)] focus:bg-white focus:outline-none",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
