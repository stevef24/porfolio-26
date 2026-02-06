"use client";

import { cn } from "@/lib/utils";
import { MotionConfig, useReducedMotion } from "motion/react";
import { springSmooth } from "@/lib/motion-variants";
import type { CSSProperties } from "react";

const TONE_MAP = {
  cyan: "var(--va-cyan)",
  blue: "var(--va-blue)",
  purple: "var(--va-purple)",
  pink: "var(--va-pink)",
  yellow: "var(--va-yellow)",
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
          "relative overflow-hidden rounded-2xl",
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
            background:
              "linear-gradient(90deg, var(--va-cyan), var(--va-blue), var(--va-purple), var(--va-pink), var(--va-yellow))",
            opacity: 0.8,
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
