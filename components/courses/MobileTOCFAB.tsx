"use client";

import { motion, useReducedMotion } from "motion/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { springBouncy } from "@/lib/motion-variants";

interface MobileTOCFABProps {
  onClick: () => void;
  className?: string;
}

/**
 * Floating action button for mobile TOC access.
 * Shows on screens < xl where FarRightTOC is hidden.
 * Positioned above floating navbar (bottom-20).
 */
export function MobileTOCFAB({ onClick, className }: MobileTOCFABProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        // Fixed position - bottom right, above floating navbar
        "fixed bottom-20 right-4 z-40",
        // Only show on screens < xl (where FarRightTOC is hidden)
        "xl:hidden",
        // Button styling - Swiss minimalism
        "flex items-center justify-center",
        "w-12 h-12 rounded-full",
        "bg-background border border-border",
        "shadow-lg shadow-foreground/5",
        // Hover state
        "hover:bg-muted hover:border-foreground/20",
        "transition-colors duration-150",
        // Focus state
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        // Cursor
        "cursor-pointer",
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : springBouncy}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      aria-label="Open table of contents"
    >
      <HugeiconsIcon
        icon={Menu01Icon}
        size={20}
        strokeWidth={1.5}
        className="text-foreground"
      />
    </motion.button>
  );
}

export default MobileTOCFAB;
