import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ocean-500)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-ocean-600)] text-white hover:bg-[var(--color-ocean-700)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-0.5",
        coral:
          "bg-[var(--color-coral-500)] text-white hover:bg-[var(--color-coral-600)] shadow-[var(--shadow-warm)] hover:-translate-y-0.5",
        outline:
          "border-2 border-[var(--color-deep-900)] text-[var(--color-deep-900)] hover:bg-[var(--color-deep-900)] hover:text-white",
        ghost: "text-[var(--color-deep-900)] hover:bg-[var(--color-sand-100)]",
        glass: "glass text-[var(--color-deep-900)] hover:bg-white/85",
        link: "text-[var(--color-ocean-700)] underline-offset-4 hover:underline rounded-none",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
