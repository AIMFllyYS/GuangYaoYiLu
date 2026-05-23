import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-[transform,opacity,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md hover:brightness-105",
        destructive: "bg-destructive text-destructive-foreground shadow-md hover:brightness-105",
        outline: "border border-border bg-card/80 text-foreground hover:bg-muted/60",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted/60 text-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-11 min-h-[44px] px-4 py-2",
        sm: "h-9 min-h-[36px] rounded-md px-3 text-xs",
        lg: "h-12 min-h-[44px] rounded-lg px-6",
        icon: "size-11 min-h-[44px] min-w-[44px]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
