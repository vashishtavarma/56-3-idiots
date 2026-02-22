"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Rainbow Button – animated rainbow gradient border/glow (Magic UI).
 * Use for Cancel and Delete actions.
 */
const rainbowButtonVariants = cva(
  cn(
    "relative cursor-pointer transition-all z-10",
    "inline-flex items-center justify-center gap-2 shrink-0",
    "rounded-lg outline-none border border-transparent",
    "text-sm font-medium whitespace-nowrap",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "rainbow-btn-glow"
  ),
  {
    variants: {
      variant: {
        default: "rainbow-btn [background-clip:padding-box,border-box] [background-origin:border-box]",
        outline: "rainbow-btn-outline border-input border-b-transparent [background-clip:padding-box,border-box] [background-origin:border-box]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const RainbowButton = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-slot="button"
        className={cn(rainbowButtonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

RainbowButton.displayName = "RainbowButton";

export { RainbowButton, rainbowButtonVariants };
