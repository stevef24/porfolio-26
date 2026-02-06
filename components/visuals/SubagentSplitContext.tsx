"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";
import {
  panelSlide,
  staggerFast,
  staggerItem,
  summaryTransfer,
  springGentle,
} from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

interface SubagentSplitContextProps {
  className?: string;
}

const NOTES = [
  "Searching for relevant files...",
  "Reading 12 source files",
  "Analyzing patterns found",
];

export function SubagentSplitContext({ className }: SubagentSplitContextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [showNotes, setShowNotes] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [transferred, setTransferred] = useState(false);

  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current || prefersReducedMotion) return;
    hasStarted.current = true;

    // Show notes after panels animate in
    const t1 = setTimeout(() => setShowNotes(true), 700);
    // Show summary card in subagent
    const t2 = setTimeout(() => setShowSummary(true), 1400);
    // Transfer summary to main session
    const t3 = setTimeout(() => setTransferred(true), 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isInView, prefersReducedMotion]);

  const animate = isInView || !!prefersReducedMotion;

  return (
    <VisualWrapper
      className={className}
      label="Subagent Split Context"
      tone="purple"
    >
      <div
        ref={ref}
        className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
      >
        {/* Main Session Panel */}
        <motion.div
          variants={panelSlide}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          animate={animate ? "visible" : "hidden"}
          data-va-panel
          className={cn(
            "flex min-h-[160px] flex-1 flex-col rounded-md border p-4",
            "border-[var(--sf-border-subtle)] bg-[var(--sf-bg-surface)]",
          )}
        >
          <span className="text-swiss-label mb-3 text-[var(--sf-text-tertiary)]">
            Main Session
          </span>

          <div className="flex flex-1 flex-col justify-center">
            <AnimatePresence>
              {(transferred || prefersReducedMotion) && (
                <motion.div
                  layoutId="summary-card"
                  transition={summaryTransfer}
                  data-va-panel
                  className={cn(
                    "rounded border-l-2 px-3 py-2.5",
                    "border-l-[var(--va-purple)]",
                    "bg-[var(--sf-bg-surface)]",
                    "shadow-sm",
                  )}
                >
                  <p className="text-[11px] font-medium text-[var(--sf-text-primary)]">
                    Summary
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--sf-text-secondary)]">
                    Found 3 patterns across 12 files
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Arrow between panels */}
        <div className="hidden sm:flex items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-[var(--sf-text-tertiary)]"
          >
            <line
              x1="4"
              y1="12"
              x2="18"
              y2="12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <polyline
              points="14,8 18,12 14,16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Subagent Panel */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 16 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                ...springGentle,
                delay: 0.15,
              },
            },
          }}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          animate={animate ? "visible" : "hidden"}
          data-va-panel
          className={cn(
            "flex min-h-[160px] flex-1 flex-col rounded-md border p-4",
            "border-[var(--sf-border-subtle)] bg-[var(--sf-bg-surface)]",
          )}
        >
          <span className="text-swiss-label mb-3 text-[var(--sf-text-tertiary)]">
            Subagent
          </span>

          {/* Notes */}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            animate={showNotes || prefersReducedMotion ? "visible" : "hidden"}
            className="flex flex-col gap-1.5"
          >
            {NOTES.map((note, i) => (
              <motion.p
                key={i}
                variants={staggerItem}
                className="text-[11px] text-[var(--sf-text-tertiary)]"
              >
                {note}
              </motion.p>
            ))}
          </motion.div>

          {/* Summary card before transfer */}
          <div className="mt-3">
            <AnimatePresence>
              {showSummary && !transferred && !prefersReducedMotion && (
                <motion.div
                  layoutId="summary-card"
                  transition={summaryTransfer}
                  data-va-panel
                  className={cn(
                    "rounded border-l-2 px-3 py-2.5",
                    "border-l-[var(--va-purple)]",
                    "bg-[var(--sf-bg-surface)]",
                    "shadow-sm",
                  )}
                >
                  <p className="text-[11px] font-medium text-[var(--sf-text-primary)]">
                    Summary
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--sf-text-secondary)]">
                    Found 3 patterns across 12 files
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </VisualWrapper>
  );
}
