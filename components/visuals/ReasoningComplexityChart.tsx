"use client";

/**
 * ReasoningComplexityChart
 *
 * Visualises model_reasoning_effort per agent role as a
 * segmented strength-bar chart, grouped by tier.
 *
 * Tiers:
 *  DECIDE  → xhigh  (4/4 segments, full weight)
 *  CREATE  → high / medium
 *  EXECUTE → low    (1/4 segments, faint)
 *
 * Animates in on scroll — rows stagger, bars fill left→right.
 */

import { useRef, useMemo } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualWrapper } from "./VisualWrapper";

// ─── Data ──────────────────────────────────────────────────────────────────

const LEVELS = { xhigh: 4, high: 3, medium: 2, low: 1 } as const;
type Level = keyof typeof LEVELS;

const GROUPS: Array<{
  tier: string;
  description: string;
  rows: Array<{ role: string; level: Level; note: string }>;
}> = [
  {
    tier: "DECIDE",
    description: "Planning mistakes cascade",
    rows: [
      { role: "orchestrator",     level: "xhigh", note: "xhigh" },
      { role: "reviewer",         level: "xhigh", note: "xhigh" },
      { role: "security_auditor", level: "xhigh", note: "xhigh" },
    ],
  },
  {
    tier: "CREATE",
    description: "Scoped analysis, edge cases",
    rows: [
      { role: "qa_test_author",   level: "high",   note: "high"   },
      { role: "implementer",      level: "medium",  note: "medium" },
      { role: "release_manager",  level: "medium",  note: "medium" },
    ],
  },
  {
    tier: "EXECUTE",
    description: "Deterministic, no reasoning needed",
    rows: [
      { role: "explorer",  level: "low", note: "low" },
      { role: "ci_runner", level: "low", note: "low" },
    ],
  },
];

const TOTAL_SEGMENTS = 4;

// ─── Colours ──────────────────────────────────────────────────────────────

/** Bar fill opacity per segment index based on total active segments */
function segmentOpacity(segIndex: number, active: number): number {
  if (segIndex >= active) return 0; // empty
  // Full segments diminish slightly toward right for a gradient feel
  const base = active === 4 ? 0.85 : active === 3 ? 0.7 : active === 2 ? 0.55 : 0.38;
  const taper = segIndex === active - 1 ? 0.08 : 0; // last segment slightly lighter
  return base - taper;
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SegmentBar({
  level,
  rowDelay,
  reduced,
}: {
  level: Level;
  rowDelay: number;
  reduced: boolean;
}) {
  const active = LEVELS[level];

  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
        const filled = i < active;
        const opacity = segmentOpacity(i, active);
        const delay = reduced ? 0 : rowDelay + i * 0.07;

        return (
          <motion.div
            key={i}
            className="h-[6px] w-8 rounded-[2px]"
            style={{ originX: 0, backgroundColor: "var(--va-fg)" } as React.CSSProperties}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={
              filled
                ? { opacity, scaleX: 1 }
                : { opacity: 0.07, scaleX: 1 }
            }
            transition={
              reduced
                ? { duration: 0 }
                : {
                    opacity: { delay, duration: 0.25, ease: "easeOut" },
                    scaleX: { delay, type: "spring", visualDuration: 0.38, bounce: 0.05 },
                  }
            }
          />
        );
      })}
    </div>
  );
}

function RoleRow({
  role,
  level,
  note,
  rowDelay,
  reduced,
}: {
  role: string;
  level: Level;
  note: string;
  rowDelay: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="flex items-center gap-2 md:gap-4"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { delay: rowDelay, type: "spring", visualDuration: 0.32, bounce: 0.05 }
      }
    >
      {/* Role name */}
      <span
        className="w-24 md:w-36 shrink-0 font-mono text-[10px] md:text-[11px] tracking-wide"
        style={{ color: "var(--sf-text-secondary)" }}
      >
        {role}
      </span>

      {/* Bar */}
      <SegmentBar level={level} rowDelay={rowDelay} reduced={reduced} />

      {/* Label */}
      <span
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: "var(--sf-text-tertiary)" }}
      >
        {note}
      </span>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────

export function ReasoningComplexityChart({
  className,
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const reduced = !!useReducedMotion();

  // Pre-compute global row index for stagger delay
  const rowsWithDelay = useMemo(() => {
    let globalIndex = 0;
    return GROUPS.map((group) => ({
      ...group,
      rows: group.rows.map((row) => {
        const delay = reduced ? 0 : 0.06 + globalIndex * 0.12;
        globalIndex++;
        return { ...row, delay };
      }),
    }));
  }, [reduced]);

  return (
    <VisualWrapper
      label="model_reasoning_effort by role — spend tokens where they matter"
      className={className}
      tone="neutral"
    >
      <div ref={ref} className="flex flex-col gap-6 py-2">
        {isInView &&
          rowsWithDelay.map((group, gi) => (
            <div key={group.tier} className="flex flex-col gap-2">
              {/* Tier header */}
              <motion.div
                className="flex items-center gap-3 mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { delay: gi * 0.15, duration: 0.3, ease: "easeOut" }
                }
              >
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase tracking-[0.12em] px-1.5 py-0.5 rounded",
                  )}
                  style={{
                    color: "var(--sf-text-tertiary)",
                    backgroundColor: "var(--sf-bg-subtle)",
                  }}
                >
                  {group.tier}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: "var(--sf-text-tertiary)" }}
                >
                  {group.description}
                </span>
              </motion.div>

              {/* Rows */}
              <div className="flex flex-col gap-2.5 pl-2">
                {group.rows.map((row) => (
                  <RoleRow
                    key={row.role}
                    role={row.role}
                    level={row.level}
                    note={row.note}
                    rowDelay={row.delay}
                    reduced={reduced}
                  />
                ))}
              </div>

              {/* Divider between groups */}
              {gi < rowsWithDelay.length - 1 && (
                <motion.div
                  className="mt-3 h-px w-full"
                  style={{ backgroundColor: "var(--sf-border-subtle)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { delay: gi * 0.15 + 0.3, duration: 0.4 }
                  }
                />
              )}
            </div>
          ))}
      </div>
    </VisualWrapper>
  );
}
