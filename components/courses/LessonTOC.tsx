"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion-variants";

export interface TOCItem {
  title: string;
  url: string;
  depth: number;
}

interface LessonTOCProps {
  items: TOCItem[];
  className?: string;
}

/**
 * Right-side table of contents for course lessons.
 * Shows "On this page" header with scrollspy active state.
 * Only renders if 3+ headings exist.
 */
export function LessonTOC({ items, className }: LessonTOCProps): JSX.Element | null {
  const [activeId, setActiveId] = useState<string>("");
  const prefersReducedMotion = useReducedMotion();

  // Filter to H2 and H3 only for cleaner display
  const headings = items.filter((item) => item.depth === 2 || item.depth === 3);

  const updateActiveHeading = useCallback(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map((heading) => {
        const id = heading.url.replace("#", "");
        return document.getElementById(id);
      })
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    // Find heading closest to top 25% of viewport
    const viewportHeight = window.innerHeight;
    const threshold = viewportHeight * 0.25;

    let currentId = headings[0].url.replace("#", "");

    for (let i = 0; i < headingElements.length; i++) {
      const rect = headingElements[i].getBoundingClientRect();
      if (rect.top <= threshold) {
        currentId = headings[i].url.replace("#", "");
      } else {
        break;
      }
    }

    setActiveId(currentId);
  }, [headings]);

  useEffect(() => {
    if (headings.length === 0) return;

    // Initial check
    updateActiveHeading();

    // Listen to scroll
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveHeading);
  }, [headings, updateActiveHeading]);

  // Don't render if fewer than 3 headings
  if (headings.length < 3) return null;

  return (
    <nav
      className={cn(
        // Remove sticky since parent handles positioning
        "max-h-[calc(100vh-6rem)]",
        "overflow-y-auto",
        "rounded-lg border border-border/60 bg-background/80 p-3 backdrop-blur-sm",
        className
      )}
    >
      <h4 className="mb-2 text-xs uppercase tracking-[0.12em] text-foreground/45">
        On this page
      </h4>
      {/* Left border container for active indicator */}
      <div className="relative">
        <ul className="space-y-0.5">
          {headings.map((heading) => {
            const id = heading.url.replace("#", "");
            const isActive = activeId === id;

            return (
              <li key={heading.url} className="relative">
                {/* Active indicator bar - 3px primary accent on left */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1 bottom-1 w-[2px] bg-foreground/80 rounded-full transition-all duration-200"
                    aria-hidden="true"
                  />
                )}
                <motion.a
                  href={heading.url}
                  className={cn(
                    "block py-1.5 pl-3 pr-2 transition-colors duration-150 cursor-pointer rounded-md text-sm leading-5",
                    "hover:text-foreground",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                    heading.depth === 3 && "pl-5",
                    isActive
                      ? "bg-foreground/[0.07] text-foreground font-medium"
                      : "text-foreground/60 hover:bg-foreground/[0.04]"
                  )}
                  whileHover={prefersReducedMotion ? undefined : { x: 2 }}
                  transition={springSnappy}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(id);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                      // Update URL without jumping
                      window.history.pushState(null, "", heading.url);
                    }
                  }}
                >
                  {heading.title}
                </motion.a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default LessonTOC;
