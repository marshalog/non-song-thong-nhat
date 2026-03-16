import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_0_0_rgba(251,113,133,0.4)] hover:shadow-[0_0_25px_2px_rgba(251,113,133,0.7)] hover:-translate-y-[1px]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_0_0_rgba(248,113,113,0.4)] hover:shadow-[0_0_25px_2px_rgba(248,113,113,0.8)] hover:-translate-y-[1px]",
        outline:
          "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground shadow-[0_0_0_0_rgba(254,240,138,0.2)] hover:shadow-[0_0_20px_1px_rgba(254,240,138,0.6)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_0_0_0_rgba(190,242,100,0.25)] hover:shadow-[0_0_22px_1px_rgba(190,242,100,0.7)] hover:-translate-y-[1px]",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground hover:shadow-[0_0_18px_1px_rgba(254,240,138,0.5)]",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
