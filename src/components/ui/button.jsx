import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex max-w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-center text-sm font-medium ring-offset-background transition-[color,background-color,box-shadow] disabled:pointer-events-none disabled:opacity-60 max-sm:h-auto max-sm:min-h-9 max-sm:whitespace-normal max-sm:py-2 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-xs shadow-black/5 hover:bg-primary/90",
        mono: "bg-zinc-950 text-white shadow-xs shadow-black/5 hover:bg-zinc-950/90 dark:bg-zinc-200 dark:text-zinc-950 dark:hover:bg-zinc-300",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs shadow-black/5 hover:bg-secondary/90",
        outline:
          "border border-input bg-background text-accent-foreground shadow-xs shadow-black/5 hover:bg-accent",
        ghost:
          "bg-transparent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        lg: "h-11 px-5 text-sm [&_svg:not([class*=size-])]:size-4",
        md: "h-9 px-3 text-[0.8125rem] [&_svg:not([class*=size-])]:size-4",
        sm: "h-7 px-2.5 text-xs [&_svg:not([class*=size-])]:size-3.5",
        icon: "size-9 p-0 [&_svg:not([class*=size-])]:size-4",
      },
      shape: {
        default: "",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, shape }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
