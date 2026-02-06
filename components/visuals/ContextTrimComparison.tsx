"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { fadeIn, cardEmphasis } from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

const BEFORE_LINES = [
  "Retrieved 847 lines from auth.ts including all imports, type defs, helpers...",
  "Full git log output with 200+ commits and merge metadata appended...",
  "Complete package.json with all 64 devDependencies listed inline...",
  "Raw test output including passing suites, timing data, coverage tables...",
];

const AFTER_LINES = [
  "auth.ts:42-68 -- validateToken() and refreshSession() functions",
  "Last 3 commits: fix token refresh, add rate limit, update deps",
];

interface MeterBarProps {
  percent: number;
  color: string;
  animate: boolean;
  reducedMotion: boolean | null;
}

function MeterBar({ percent, color, animate, reducedMotion }: MeterBarProps) {
  return (
    <div className="mt-3">
      <div
        data-va-chip
        className="h-[6px] w-full rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--sf-bg-muted)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            transformOrigin: "left",
          }}
          initial={reducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
          animate={animate ? { scaleX: 1 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.3,
          }}
        >
          <div style={{ width: `${percent}%`, height: "100%" }} />
        </motion.div>
      </div>
      <span
        className="text-[10px] font-mono mt-1 block"
        style={{ color: "var(--sf-text-tertiary)" }}
      >
        {percent}% of budget
      </span>
    </div>
  );
}

interface ContextTrimComparisonProps {
  className?: string;
}

export function ContextTrimComparison({
  className,
}: ContextTrimComparisonProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [afterBright, setAfterBright] = useState(false);

  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      const timer = setTimeout(() => setAfterBright(true), 1000);
      return () => clearTimeout(timer);
    }
    if (prefersReducedMotion) setAfterBright(true);
  }, [isInView, prefersReducedMotion]);

  return (
    <VisualWrapper label="Context Trimming" className={className} tone="pink">
      <div ref={ref} className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[860px] mx-auto">
          {/* Before card */}
          <motion.div
            variants={fadeIn}
            initial={prefersReducedMotion ? "visible" : "hidden"}
            animate={isInView ? "visible" : "hidden"}
            data-va-panel
            className={cn(
              "rounded-md p-4",
              "border border-[var(--sf-border-subtle)]",
              "bg-[var(--sf-bg-surface)]",
            )}
          >
            <span
              className="text-swiss-label"
              style={{ color: "var(--sf-text-tertiary)" }}
            >
              Before
            </span>
            <div className="mt-3 space-y-2">
              {BEFORE_LINES.map((line, i) => (
                <p
                  key={i}
                  className="text-[11px] leading-relaxed font-mono"
                  style={{ color: "var(--sf-text-secondary)" }}
                >
                  {line}
                </p>
              ))}
            </div>
            <MeterBar
              percent={80}
              color="var(--va-pink)"
              animate={isInView}
              reducedMotion={prefersReducedMotion}
            />
          </motion.div>

          {/* After card */}
          <motion.div
            variants={cardEmphasis}
            initial={prefersReducedMotion ? "bright" : "dim"}
            animate={afterBright ? "bright" : "dim"}
            data-va-panel
            className={cn(
              "rounded-md p-4",
              "border border-[var(--sf-border-subtle)]",
              "bg-[var(--sf-bg-surface)]",
            )}
            style={{
              borderTopWidth: afterBright ? 2 : 1,
              borderTopColor: afterBright
                ? "var(--va-cyan)"
                : "var(--sf-border-subtle)",
            }}
          >
            <span
              className="text-swiss-label"
              style={{ color: "var(--sf-text-tertiary)" }}
            >
              After
            </span>
            <div className="mt-3 space-y-2">
              {AFTER_LINES.map((line, i) => (
                <p
                  key={i}
                  className="text-[11px] leading-relaxed font-mono"
                  style={{ color: "var(--sf-text-secondary)" }}
                >
                  {line}
                </p>
              ))}
            </div>
            <MeterBar
              percent={30}
              color="var(--va-cyan)"
              animate={isInView}
              reducedMotion={prefersReducedMotion}
            />
          </motion.div>
        </div>
      </div>
    </VisualWrapper>
  );
}
