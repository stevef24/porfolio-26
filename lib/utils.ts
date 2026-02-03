import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

interface LenisInstance {
  scrollTo: (target: Element, options?: { duration?: number }) => void;
}

function getWindowLenis(): LenisInstance | null {
  if (typeof window === "undefined") return null;
  const lenis = (window as Window & { lenis?: LenisInstance }).lenis;
  return lenis ?? null;
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Scroll to an element with a given selector smoothly.
 * Supports Lenis if available on window.
 */
export function scrollToElement(selector: string): void {
  const element = document.querySelector(selector);
  if (!element) return;

  const lenis = getWindowLenis();
  if (lenis) {
    lenis.scrollTo(element, { duration: 1.5 });
    return;
  }

  element.scrollIntoView({ behavior: "smooth" });
}

/**
 * Get the Lenis instance if it exists.
 */
export function getLenis(): LenisInstance | null {
  return getWindowLenis();
}
