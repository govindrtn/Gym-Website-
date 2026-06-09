import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const CardContext = React.createContext({ variant: "default" });

function useCardContext() {
  return React.useContext(CardContext);
}

const cardVariants = cva(
  "flex min-w-0 max-w-full flex-col items-stretch rounded-lg text-card-foreground",
  {
    variants: {
      variant: {
        default: "border border-border bg-card shadow-xs shadow-black/5",
        accent: "bg-muted p-1 shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Card({ className, variant = "default", ...props }) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div className={cn(cardVariants({ variant }), className)} {...props} />
    </CardContext.Provider>
  );
}

function CardHeader({ className, ...props }) {
  const { variant } = useCardContext();

  return (
    <div
      className={cn(
        "flex min-h-14 min-w-0 flex-wrap items-center justify-between gap-2.5 px-4 py-3 sm:px-5",
        variant === "default" && "border-b border-border",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  const { variant } = useCardContext();

  return (
    <div
      className={cn(
        "min-w-0 grow p-4 sm:p-5",
        variant === "accent" && "rounded-lg bg-card",
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex min-h-14 min-w-0 flex-wrap items-center gap-2 border-t border-border px-4 py-3 sm:px-5", className)}
      {...props}
    />
  );
}

function CardHeading({ className, ...props }) {
  return <div className={cn("min-w-0 space-y-1", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-base font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p className={cn("break-words text-sm text-muted-foreground", className)} {...props} />
  );
}

function CardToolbar({ className, ...props }) {
  return <div className={cn("flex max-w-full flex-wrap items-center gap-2.5", className)} {...props} />;
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
};
