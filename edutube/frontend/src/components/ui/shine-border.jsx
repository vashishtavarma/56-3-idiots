"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Shine Border – animated border effect (Magic UI).
 * Wrap your card in a relative rounded div; ShineBorder goes first, then card with margin so border shows.
 */
export function ShineBorder({
  borderWidth = 3,
  duration = 14,
  shineColor = "#6366f1",
  className,
  style,
  ...props
}) {
  const colors = Array.isArray(shineColor) ? shineColor : [shineColor];
  const mid = colors.length > 1 ? colors[colors.length - 1] : colors[0];
  const backgroundImage = `linear-gradient(105deg, transparent 25%, ${colors[0]} 40%, ${mid} 60%, transparent 75%)`;

  return (
    <div
      style={{
        "--duration": `${duration}s`,
        "--shine-border-width": `${borderWidth}px`,
        backgroundImage,
        backgroundSize: "200% 200%",
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "var(--shine-border-width)",
        ...style,
      }}
      className={cn(
        "pointer-events-none absolute inset-0 size-full rounded-[inherit]",
        "animate-shine",
        className
      )}
      {...props}
    />
  );
}
