"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { tokenDrop, overflowSpill } from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

const TOKENS = [
  { label: "Conversation", id: "conversation" },
  { label: "Files", id: "files" },
  { label: "Tool Output", id: "tool-output" },
  { label: "CLAUDE.md", id: "claude-md" },
];

const OVERFLOW_TOKEN = { label: "New Details", id: "overflow" };
const TOKEN_COLORS = [
  "var(--va-cyan)",
  "var(--va-blue)",
  "var(--va-purple)",
  "var(--va-yellow)",
];

interface ContextBudgetBucketProps {
  className?: string;
}

export function ContextBudgetBucket({ className }: ContextBudgetBucketProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [phase, setPhase] = useState<"empty" | "filling" | "full" | "overflow">(
    prefersReducedMotion ? "overflow" : "empty",
  );

  const startAnimation = useCallback(() => {
    if (prefersReducedMotion) return;
    setPhase("filling");
    const fillTime = TOKENS.length * 150 + 400;
    setTimeout(() => setPhase("full"), fillTime);
    setTimeout(() => setPhase("overflow"), fillTime + 600);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (isInView && phase === "empty") {
      const timer = setTimeout(startAnimation, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, phase, startAnimation]);

  const showTokens = phase !== "empty";
  const showOverflow = phase === "overflow";

  return (
    <VisualWrapper label="Context Budget" className={className} tone="blue">
      <div ref={ref} className="flex flex-col items-center gap-6 py-4">
        {/* Bucket */}
        <div className="relative">
          {/* Bucket container */}
          <div
            data-va-panel
            className={cn(
              "relative w-[200px] h-[240px] rounded-lg",
              "border-2 border-[var(--sf-border-default)]",
              "bg-[var(--sf-bg-surface)]",
              "overflow-hidden",
              "flex flex-col justify-end",
            )}
          >
            {/* Limit line */}
            <div
              className="absolute top-[16px] left-2 right-2 h-[1.5px] bg-[var(--va-blue)]"
              style={{ opacity: 0.7 }}
            />
            <span
              className="absolute top-[4px] right-2 text-[9px] font-mono uppercase tracking-wider"
              style={{ color: "var(--va-blue)" }}
            >
              Limit
            </span>

            {/* Token stack */}
            <div className="flex flex-col-reverse gap-1.5 p-3 pb-3">
              {showTokens &&
                TOKENS.map((token, i) => (
                  <motion.div
                    key={token.id}
                    custom={i}
                    variants={tokenDrop}
                    initial={prefersReducedMotion ? "visible" : "hidden"}
                    animate={showTokens ? "visible" : "hidden"}
                    data-va-chip
                    className={cn(
                      "w-[160px] h-[32px] rounded-md",
                      "flex items-center justify-center",
                      "text-[11px] font-mono uppercase tracking-wider",
                      "border border-[var(--sf-border-subtle)]",
                    )}
                    style={{
                      backgroundColor: `color-mix(in oklch, ${TOKEN_COLORS[i]} 12%, var(--sf-bg-surface))`,
                      color: "var(--sf-text-primary)",
                      borderColor: `color-mix(in oklch, ${TOKEN_COLORS[i]} 38%, var(--sf-border-subtle))`,
                    }}
                  >
                    {token.label}
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Bucket label */}
          <p
            className="text-center mt-2 text-[11px] font-mono uppercase tracking-wider"
            style={{ color: "var(--sf-text-tertiary)" }}
          >
            Context Budget
          </p>
        </div>

        {/* Overflow zone */}
        <motion.div
          variants={overflowSpill}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          animate={showOverflow ? "visible" : "hidden"}
          data-va-panel
          className={cn(
            "w-[200px] rounded-md",
            "border border-dashed border-[var(--va-pink)]",
            "p-3 flex flex-col items-center gap-2",
          )}
          style={{
            opacity: showOverflow || prefersReducedMotion ? undefined : 0,
          }}
        >
          {/* Spilled token */}
          <div
            className={cn(
              "w-[160px] h-[32px] rounded-md",
              "flex items-center justify-center",
              "text-[11px] font-mono uppercase tracking-wider",
              "border border-[var(--va-pink)]",
            )}
            style={{
              backgroundColor:
                "color-mix(in oklch, var(--va-pink) 15%, transparent)",
              color: "var(--va-pink)",
            }}
          >
            {OVERFLOW_TOKEN.label}
          </div>
          <span
            className="text-[10px] font-mono uppercase tracking-wider"
            style={{ color: "var(--va-pink)" }}
          >
            Lost Details
          </span>
        </motion.div>
      </div>
    </VisualWrapper>
  );
}
