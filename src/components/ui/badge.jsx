import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 border border-transparent font-medium",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success:
          "bg-[var(--color-success-accent)] text-white",
        warning:
          "bg-[var(--color-warning-accent)] text-zinc-950",
        info: "bg-[var(--color-info-accent)] text-white",
        outline: "border-border bg-transparent text-secondary-foreground",
      },
      appearance: {
        default: "",
        light: "",
        outline: "",
        ghost: "border-transparent bg-transparent px-0",
      },
      size: {
        md: "h-6 min-w-6 rounded-md px-[0.45rem] text-xs",
        sm: "h-5 min-w-5 rounded-sm px-[0.325rem] text-[0.6875rem] leading-[0.75rem]",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        appearance: "light",
        className:
          "bg-[var(--color-primary-soft)] text-[var(--color-primary-accent)]",
      },
      {
        variant: "success",
        appearance: "light",
        className:
          "bg-[var(--color-success-soft)] text-[var(--color-success-accent)]",
      },
      {
        variant: "warning",
        appearance: "light",
        className:
          "bg-[var(--color-warning-soft)] text-[var(--color-warning-accent)]",
      },
      {
        variant: "info",
        appearance: "light",
        className:
          "bg-[var(--color-info-soft)] text-[var(--color-info-accent)]",
      },
    ],
    defaultVariants: {
      variant: "primary",
      appearance: "default",
      size: "md",
    },
  },
);

function Badge({ className, variant, size, appearance, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      className={cn(badgeVariants({ variant, size, appearance }), className)}
      {...props}
    />
  );
}

function BadgeDot({ className, ...props }) {
  return (
    <span
      className={cn("size-1.5 rounded-full bg-current opacity-75", className)}
      {...props}
    />
  );
}

export { Badge, BadgeDot, badgeVariants };
