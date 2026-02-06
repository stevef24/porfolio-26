"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  slideUpSubtle,
  checkmarkIn,
} from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

const CATEGORIES = [
  { label: "Commands", icon: ">", color: "var(--va-cyan)" },
  { label: "Context", icon: "{}", color: "var(--va-blue)" },
  { label: "Tools", icon: "T", color: "var(--va-purple)" },
  { label: "MCP", icon: "M", color: "var(--va-pink)" },
  { label: "Permissions", icon: "P", color: "var(--va-yellow)" },
];

function CheckmarkSVG({ index, animate }: { index: number; animate: boolean }) {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      custom={index}
      variants={checkmarkIn}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
    >
      <motion.path
        d="M4 9.5L7.5 13L14 5"
        stroke="var(--va-cyan)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={animate ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{
          delay: index * 0.15 + 0.3,
          duration: 0.4,
          ease: "easeOut",
        }}
      />
    </motion.svg>
  );
}

interface ChangelogScanChecklistProps {
  className?: string;
}

export function ChangelogScanChecklist({
  className,
}: ChangelogScanChecklistProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <VisualWrapper label="Changelog Scan" className={className} tone="cyan">
      <div ref={ref} className="py-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-2 max-w-[420px] mx-auto"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              variants={slideUpSubtle}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate={isInView ? "visible" : "hidden"}
              data-va-panel
              className={cn(
                "h-[48px] rounded-md",
                "border border-[var(--sf-border-subtle)]",
                "bg-[var(--sf-bg-surface)]",
                "flex items-center px-3 gap-2",
              )}
            >
              {/* Icon */}
              <span
                data-va-chip
                className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-mono shrink-0"
                style={{
                  color: cat.color,
                  backgroundColor: `color-mix(in oklch, ${cat.color} 16%, var(--sf-bg-surface))`,
                }}
              >
                {cat.icon}
              </span>

              {/* Label */}
              <span
                className="text-[12px] font-mono uppercase tracking-wider flex-1"
                style={{ color: "var(--sf-text-primary)" }}
              >
                {cat.label}
              </span>

              {/* Checkmark */}
              {prefersReducedMotion ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M4 9.5L7.5 13L14 5"
                    stroke="var(--va-cyan)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <CheckmarkSVG index={i} animate={isInView} />
              )}
            </motion.div>
          ))}

          {/* Empty 6th cell */}
          <div className="h-[48px]" />
        </motion.div>
      </div>
    </VisualWrapper>
  );
}
