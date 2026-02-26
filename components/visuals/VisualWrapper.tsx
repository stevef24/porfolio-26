"use client";

import { cn } from "@/lib/utils";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { springSmooth } from "@/lib/motion-variants";
import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ReloadIcon } from "@hugeicons/core-free-icons";

/**
 * Tone map — keep it minimal. Only blue/red/green carry semantic meaning.
 * Everything else maps to the monochrome base.
 *
 * blue  → informational, active states, flow diagrams
 * green → success, CI pass, confirmed / approved
 * red   → error, warning, rejection, danger
 * neutral / others → monochrome, no semantic load
 */
const TONE_MAP = {
  neutral: "var(--va-fg)",
  blue: "var(--va-blue)",
  green: "var(--va-green)",
  red: "var(--va-red)",
  // Legacy — collapse to muted so old usages don't break
  cyan: "var(--va-fg-muted)",
  purple: "var(--va-fg-muted)",
  pink: "var(--va-fg-muted)",
  yellow: "var(--va-fg-muted)",
} as const;

type VisualTone = keyof typeof TONE_MAP;

interface VisualWrapperProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  tone?: VisualTone;
  showCaption?: boolean;
  onReplay?: () => void;
  showReplay?: boolean;
}

export function VisualWrapper({
  children,
  className,
  label,
  tone = "neutral",
  showCaption = true,
  onReplay,
  showReplay,
}: VisualWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionConfig
      transition={springSmooth}
      reducedMotion={prefersReducedMotion ? "always" : "never"}
    >
      <figure
        className={cn(
          "va-shell not-prose my-12 mx-auto w-full max-w-[960px]",
          "relative overflow-hidden rounded-[12px]",
          "p-5 sm:p-8 md:p-10",
          className,
        )}
        style={{ "--va-accent": TONE_MAP[tone] } as CSSProperties}
        role="img"
        aria-label={label}
      >
        {onReplay && showReplay && (
          <motion.button
            onClick={onReplay}
            aria-label="Replay animation"
            title="Replay"
            className={cn(
              "absolute right-3 top-3 z-20",
              "flex items-center justify-center w-7 h-7",
              "rounded",
              "transition-colors duration-150",
              "cursor-pointer",
            )}
            style={{
              color: "var(--sf-text-tertiary)",
              backgroundColor: "var(--sf-bg-subtle)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <HugeiconsIcon
              icon={ReloadIcon}
              size={14}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </motion.button>
        )}
        <div className="relative z-10">{children}</div>
        {label && showCaption && (
          <figcaption
            className="mt-6 text-center text-[13px] italic"
            style={{ color: "var(--sf-text-tertiary)" }}
          >
            {label}
          </figcaption>
        )}
      </figure>
    </MotionConfig>
  );
}
