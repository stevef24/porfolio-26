"use client";

import { cn } from "@/lib/utils";
import { MotionConfig, useReducedMotion } from "motion/react";
import { springSmooth } from "@/lib/motion-variants";
import type { CSSProperties } from "react";

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
}

export function VisualWrapper({
  children,
  className,
  label,
  tone = "blue",
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
          "p-8 md:p-10",
          className,
        )}
        style={{ "--va-accent": TONE_MAP[tone] } as CSSProperties}
        role="img"
        aria-label={label}
      >
        <div
          aria-hidden
          className="va-shell__bg pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden
          className="va-shell__grid pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: "var(--sf-border-default)",
            opacity: 0.5,
          }}
        />
        <div className="relative z-10">{children}</div>
        {label && (
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
