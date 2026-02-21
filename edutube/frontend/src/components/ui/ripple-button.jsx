"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Ripple Button – click ripple effect (Magic UI).
 * Use for primary actions on login/signup and elsewhere.
 */
export const RippleButton = React.forwardRef(
  (
    {
      className,
      children,
      rippleColor = "rgba(255,255,255,0.6)",
      duration = "600ms",
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState([]);

    const handleClick = (event) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      const newRipple = { x, y, size, key: Date.now() };
      setRipples((prev) => [...prev, newRipple]);
      onClick?.(event);
    };

    useEffect(() => {
      if (ripples.length === 0) return;
      const last = ripples[ripples.length - 1];
      const ms = parseInt(duration, 10) || 600;
      const timeout = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.key !== last.key));
      }, ms);
      return () => clearTimeout(timeout);
    }, [ripples, duration]);

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 px-4 py-2 text-center",
          "bg-primary text-primary-foreground border-primary/30 hover:bg-primary/90 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <span className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
          {ripples.map((ripple) => (
            <span
              key={ripple.key}
              className="absolute rounded-full animate-rippling origin-center"
              style={{
                width: ripple.size,
                height: ripple.size,
                left: ripple.x,
                top: ripple.y,
                backgroundColor: rippleColor,
              }}
            />
          ))}
        </span>
      </button>
    );
  }
);

RippleButton.displayName = "RippleButton";
