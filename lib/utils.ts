import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Scroll to an element with a given selector smoothly.
 * Supports Lenis if available on window.
 */
export function scrollToElement(selector: string) {
  const element = document.querySelector(selector);
  if (!element) return;

  // Check for Lenis instance on window (common pattern)
  // @ts-ignore
  if (window.lenis) {
    // @ts-ignore
    window.lenis.scrollTo(element, { duration: 1.5 });
  } else {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Get the Lenis instance if it exists.
 */
export function getLenis() {
  // @ts-ignore
  return typeof window !== 'undefined' ? window.lenis : null;
}
