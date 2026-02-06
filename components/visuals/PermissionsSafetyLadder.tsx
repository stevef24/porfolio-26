"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { fadeIn, ladderHighlight, springGentle } from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

const RUNGS = [
  {
    label: "Accept Edits",
    icon: "E",
    color: "var(--va-pink)",
    description: "Highest trust",
  },
  {
    label: "Allow Commands",
    icon: ">_",
    color: "var(--va-purple)",
    description: "Medium trust",
  },
  {
    label: "Default",
    icon: "S",
    color: "var(--va-cyan)",
    description: "Safest",
  },
];

interface PermissionsSafetyLadderProps {
  className?: string;
}

export function PermissionsSafetyLadder({
  className,
}: PermissionsSafetyLadderProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeRung, setActiveRung] = useState(prefersReducedMotion ? 0 : -1);

  const startSequence = useCallback(() => {
    if (prefersReducedMotion) return;
    // Bottom rung first (index 2 = Default), then up
    setTimeout(() => setActiveRung(2), 0);
    setTimeout(() => setActiveRung(1), 800);
    setTimeout(() => setActiveRung(0), 1600);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (isInView && activeRung === -1) {
      const timer = setTimeout(startSequence, 400);
      return () => clearTimeout(timer);
    }
  }, [isInView, activeRung, startSequence]);

  return (
    <VisualWrapper
      label="Permission Levels"
      className={className}
      tone="yellow"
    >
      <div ref={ref} className="flex justify-center py-6">
        <div
          data-va-panel
          className="relative flex flex-col items-start gap-0 rounded-lg px-5 py-4"
        >
          {/* Vertical connecting line */}
          <motion.div
            variants={fadeIn}
            initial={prefersReducedMotion ? "visible" : "hidden"}
            animate={isInView ? "visible" : "hidden"}
            className="absolute left-[15px] top-[16px] w-[2px]"
            style={{
              backgroundColor: "var(--sf-border-default)",
              height: `${(RUNGS.length - 1) * 72}px`,
            }}
          />

          {/* Rungs (top to bottom: Accept Edits, Allow Commands, Default) */}
          {RUNGS.map((rung, i) => {
            const isActive = activeRung <= i;
            const isHighlighted = activeRung === i;

            return (
              <motion.div
                key={rung.label}
                custom={RUNGS.length - 1 - i}
                variants={ladderHighlight}
                initial={prefersReducedMotion ? "visible" : "hidden"}
                animate={isInView ? "visible" : "hidden"}
                className={cn(
                  "relative flex items-center gap-4",
                  i < RUNGS.length - 1 ? "mb-6" : "",
                )}
                style={{ height: "32px" }}
              >
                {/* Circle icon */}
                <div
                  className={cn(
                    "relative z-10 w-[32px] h-[32px] rounded-full",
                    "flex items-center justify-center",
                    "border-2 text-[11px] font-mono font-semibold",
                    "transition-all duration-300",
                  )}
                  style={{
                    borderColor: isActive
                      ? rung.color
                      : "var(--sf-border-default)",
                    backgroundColor: isHighlighted
                      ? rung.color
                      : "var(--sf-bg-surface)",
                    color: isHighlighted
                      ? "oklch(1 0 0)"
                      : isActive
                        ? rung.color
                        : "var(--sf-text-tertiary)",
                    boxShadow: isHighlighted
                      ? `0 0 12px color-mix(in oklch, ${rung.color} 40%, transparent)`
                      : "none",
                  }}
                >
                  {rung.icon}
                </div>

                {/* Label and description */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-[12px] font-mono uppercase tracking-wider",
                      "transition-colors duration-300",
                    )}
                    style={{
                      color: isActive
                        ? "var(--sf-text-primary)"
                        : "var(--sf-text-tertiary)",
                    }}
                  >
                    {rung.label}
                  </span>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: "var(--sf-text-tertiary)" }}
                  >
                    {rung.description}
                  </span>
                </div>

                {/* Active indicator bar */}
                {isHighlighted && (
                  <motion.div
                    layoutId="ladder-highlight"
                    className="absolute -left-2 w-[4px] h-[32px] rounded-full"
                    style={{ backgroundColor: rung.color }}
                    transition={springGentle}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </VisualWrapper>
  );
}
