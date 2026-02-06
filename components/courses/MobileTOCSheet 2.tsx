"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type TOCItem } from "@/components/courses/LessonTOC";
import { cn } from "@/lib/utils";
import { staggerFast, staggerItem } from "@/lib/motion-variants";

interface MobileTOCSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: TOCItem[];
}

/**
 * Bottom sheet containing lesson TOC for mobile devices.
 * Slides up from bottom with backdrop blur.
 * Closes when user taps a heading link.
 */
export function MobileTOCSheet({
  open,
  onOpenChange,
  items,
}: MobileTOCSheetProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  // Filter to H2 and H3 only (same as LessonTOC)
  const headings = items.filter((item) => item.depth === 2 || item.depth === 3);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          // Max height and rounded corners
          "max-h-[70vh] rounded-t-2xl",
          // Safe area padding for mobile
          "pb-safe"
        )}
      >
        <SheetHeader className="border-b border-border pb-3">
          <SheetTitle className="text-swiss-meta">
            On this page
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable content area */}
        <div className="overflow-y-auto py-4 px-2">
          {/* Custom mobile TOC - closes sheet on click */}
          <nav>
            <motion.ul
              className="space-y-1"
              initial="hidden"
              animate={open ? "visible" : "hidden"}
              variants={prefersReducedMotion ? {} : staggerFast}
            >
              {headings.map((heading, index) => {
                const id = heading.url.replace("#", "");

                return (
                  <motion.li
                    key={heading.url}
                    variants={prefersReducedMotion ? {} : staggerItem}
                    custom={index}
                  >
                    <a
                      href={heading.url}
                      className={cn(
                        "block py-2.5 px-3 rounded-lg",
                        "text-sm text-foreground",
                        "hover:bg-muted",
                        "transition-colors duration-150",
                        "cursor-pointer",
                        // Focus state
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        // Indent H3
                        heading.depth === 3 && "pl-6"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        // Close sheet first
                        onOpenChange(false);
                        // Then scroll after sheet animation completes
                        setTimeout(() => {
                          const element = document.getElementById(id);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                            window.history.pushState(null, "", heading.url);
                          }
                        }, 200);
                      }}
                    >
                      {heading.title}
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileTOCSheet;
