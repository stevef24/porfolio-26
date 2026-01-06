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
}: GradualBlurProps) {
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

      // Smooth fade starting at threshold
      if (scrollProgress >= fadeThreshold) {
        const fadeProgress = (scrollProgress - fadeThreshold) / (1 - fadeThreshold);
        // Use easeOutQuad for smoother fade
        const easedFade = 1 - (1 - (1 - fadeProgress)) * (1 - (1 - fadeProgress));
        setOpacity(Math.max(0, 1 - easedFade));
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
            hsl(var(--background)) 0%,
            hsl(var(--background) / 0.95) 15%,
            hsl(var(--background) / 0.7) 35%,
            hsl(var(--background) / 0.4) 55%,
            hsl(var(--background) / 0.15) 75%,
            hsl(var(--background) / 0) 100%
          )`,
        }}
      />

      {/* Subtle frosted glass layer */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
          maskImage: "linear-gradient(to top, black 0%, black 30%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 30%, transparent 80%)",
        }}
      />

      {/* Extra soft blur at very bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "40%",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
        }}
      />
    </motion.div>
  );
}

export default GradualBlur;
