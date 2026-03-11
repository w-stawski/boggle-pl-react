import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind CSS classes safely using clsx and tailwind-merge.
 * Prevents class conflicts by ensuring the last class defined takes precedence.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
