"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface GradualBlurProps {
  /** Height of the blur area */
  height?: string;
  /** Additional className */
  className?: string;
  /** Threshold (0-1) when to start fading out - percentage of page scrolled */
  fadeThreshold?: number;
}

/**
 * GradualBlur - Elegant frosty blur effect fixed at viewport bottom
 * Smooth gradient fade that disappears when reaching the end
 * Minimal and luxurious aesthetic
 */
export function GradualBlur({
  height = "180px",
  className,
  fadeThreshold = 0.75,
}: GradualBlurProps): JSX.Element {
  const [opacity, setOpacity] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setOpacity(0);
        return;
      }

      const scrollProgress = window.scrollY / scrollHeight;

      // Fade out starting at threshold, fully hidden at bottom
      if (scrollProgress >= fadeThreshold) {
        // fadeProgress: 0 at threshold, 1 at bottom
        const fadeProgress = (scrollProgress - fadeThreshold) / (1 - fadeThreshold);
        // Clamp and apply easeOutQuad: fades quickly then slows
        const clamped = Math.min(1, Math.max(0, fadeProgress));
        const eased = 1 - (1 - clamped) * (1 - clamped);
        setOpacity(1 - eased);
      } else {
        setOpacity(1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fadeThreshold]);

  return (
    <motion.div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 pointer-events-none",
        className
      )}
      style={{ height }}
      initial={{ opacity: 1 }}
      animate={{ opacity }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.4, ease: "easeOut" }
      }
    >
      {/* Primary gradient - smooth fade to background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to top,
            var(--background) 0%,
            color-mix(in srgb, var(--background) 95%, transparent) 15%,
            color-mix(in srgb, var(--background) 70%, transparent) 35%,
            color-mix(in srgb, var(--background) 40%, transparent) 55%,
            color-mix(in srgb, var(--background) 15%, transparent) 75%,
            transparent 100%
          )`,
        }}
      />
    </motion.div>
  );
}

export default GradualBlur;
