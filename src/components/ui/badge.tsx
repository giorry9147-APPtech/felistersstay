import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "ocean",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: "ocean" | "coral" | "sand" | "white" }) {
  const tones = {
    ocean: "bg-[var(--color-ocean-100)] text-[var(--color-ocean-800)] ring-[var(--color-ocean-200)]",
    coral: "bg-[var(--color-coral-100)] text-[var(--color-coral-700)] ring-[var(--color-coral-200)]",
    sand: "bg-[var(--color-sand-100)] text-[var(--color-sand-800)] ring-[var(--color-sand-200)]",
    white: "bg-white/80 text-[var(--color-deep-900)] ring-white/60 backdrop-blur",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
