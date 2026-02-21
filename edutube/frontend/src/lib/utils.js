import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names with Tailwind-aware deduplication.
 * Used by shadcn/ui components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
