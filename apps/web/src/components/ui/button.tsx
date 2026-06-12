import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "gradient-gold text-black shadow-glow hover:opacity-90 hover:scale-[1.02]",
        secondary: "bg-secondary text-foreground hover:bg-secondary/90",
        outline: "border border-primary/30 bg-transparent hover:bg-primary/10 text-foreground",
        ghost: "hover:bg-primary/10 text-foreground",
        glass: "glass text-foreground hover:bg-white/10",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#25D366]/90",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

import { StitchMagnetic } from "@/components/stitch/stitch-magnetic";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const button = (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );

    if (variant === "default" || variant === "whatsapp") {
      return <StitchMagnetic>{button}</StitchMagnetic>;
    }

    return button;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
