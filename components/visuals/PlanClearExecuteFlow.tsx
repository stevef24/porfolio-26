"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { sequentialHighlight, arrowDraw } from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";
import { HugeiconsIcon } from "@hugeicons/react";
import { RotateLeft01Icon } from "@hugeicons/core-free-icons";

const TILES = [
  { label: "Plan", id: "plan" },
  { label: "Clear", id: "clear" },
  { label: "Execute", id: "execute" },
];
const TILE_COLORS = ["var(--va-cyan)", "var(--va-blue)", "var(--va-purple)"];

interface PlanClearExecuteFlowProps {
  className?: string;
}

export function PlanClearExecuteFlow({ className }: PlanClearExecuteFlowProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeStep, setActiveStep] = useState<number>(
    prefersReducedMotion ? 2 : -1,
  );
  const [arrowPhase, setArrowPhase] = useState<number>(
    prefersReducedMotion ? 2 : -1,
  );
  const [showGlow, setShowGlow] = useState(!!prefersReducedMotion);
  const [hasPlayed, setHasPlayed] = useState(!!prefersReducedMotion);

  const runSequence = useCallback(() => {
    if (prefersReducedMotion) return;

    setActiveStep(-1);
    setArrowPhase(-1);
    setShowGlow(false);
    setHasPlayed(true);

    // Step 0: Plan highlights
    setTimeout(() => setActiveStep(0), 400);
    // Arrow 0 draws
    setTimeout(() => setArrowPhase(0), 800);
    // Step 1: Clear highlights
    setTimeout(() => setActiveStep(1), 1400);
    // Arrow 1 draws
    setTimeout(() => setArrowPhase(1), 1800);
    // Step 2: Execute highlights
    setTimeout(() => setActiveStep(2), 2400);
    // Glow on execute
    setTimeout(() => setShowGlow(true), 2800);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (isInView && !hasPlayed) {
      const timer = setTimeout(runSequence, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasPlayed, runSequence]);

  const handleReplay = () => {
    setHasPlayed(false);
    setTimeout(() => {
      runSequence();
    }, 50);
  };

  // Tile dimensions for layout calculations
  const tileW = 160;
  const tileH = 56;
  const gap = 48;
  const totalW = tileW * 3 + gap * 2;

  return (
    <VisualWrapper
      label="Plan - Clear - Execute"
      className={className}
      tone="purple"
    >
      <div ref={ref} className="relative flex flex-col items-center gap-6 py-4">
        {hasPlayed && !prefersReducedMotion && (
          <button
            onClick={handleReplay}
            aria-label="Replay animation"
            title="Replay"
            className={cn(
              "absolute right-3 top-3",
              "flex items-center justify-center w-7 h-7",
              "rounded border",
              "border-[var(--sf-border-subtle)]",
              "hover:border-[var(--va-blue)]",
              "transition-colors duration-150",
              "cursor-pointer",
            )}
            style={{
              color: "var(--sf-text-tertiary)",
              backgroundColor: "var(--sf-bg-subtle)",
            }}
          >
            <HugeiconsIcon icon={RotateLeft01Icon} size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
        {/* Flow container */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: totalW, height: tileH + 20 }}
        >
          {/* SVG arrows */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={totalW}
            height={tileH + 20}
            viewBox={`0 0 ${totalW} ${tileH + 20}`}
            fill="none"
          >
            {/* Arrow 1: Plan -> Clear */}
            <motion.path
              d={`M ${tileW + 4} ${(tileH + 20) / 2} L ${tileW + gap - 4} ${(tileH + 20) / 2}`}
              stroke="var(--va-blue)"
              strokeWidth={2}
              strokeLinecap="round"
              custom={0}
              variants={arrowDraw}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate={arrowPhase >= 0 ? "visible" : "hidden"}
            />
            {/* Arrowhead 1 */}
            <motion.path
              d={`M ${tileW + gap - 12} ${(tileH + 20) / 2 - 4} L ${tileW + gap - 4} ${(tileH + 20) / 2} L ${tileW + gap - 12} ${(tileH + 20) / 2 + 4}`}
              stroke="var(--va-blue)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              custom={0.3}
              variants={arrowDraw}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate={arrowPhase >= 0 ? "visible" : "hidden"}
            />

            {/* Arrow 2: Clear -> Execute */}
            <motion.path
              d={`M ${tileW * 2 + gap + 4} ${(tileH + 20) / 2} L ${tileW * 2 + gap * 2 - 4} ${(tileH + 20) / 2}`}
              stroke="var(--va-purple)"
              strokeWidth={2}
              strokeLinecap="round"
              custom={0}
              variants={arrowDraw}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate={arrowPhase >= 1 ? "visible" : "hidden"}
            />
            {/* Arrowhead 2 */}
            <motion.path
              d={`M ${tileW * 2 + gap * 2 - 12} ${(tileH + 20) / 2 - 4} L ${tileW * 2 + gap * 2 - 4} ${(tileH + 20) / 2} L ${tileW * 2 + gap * 2 - 12} ${(tileH + 20) / 2 + 4}`}
              stroke="var(--va-purple)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              custom={0.3}
              variants={arrowDraw}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate={arrowPhase >= 1 ? "visible" : "hidden"}
            />
          </svg>

          {/* Tiles */}
          {TILES.map((tile, i) => {
            const isActive = activeStep >= i;
            const isCurrentActive = activeStep === i;
            const isExecuteGlow = i === 2 && showGlow;

            return (
              <motion.div
                key={tile.id}
                variants={sequentialHighlight}
                initial={prefersReducedMotion ? "active" : "inactive"}
                animate={isActive ? "active" : "inactive"}
                data-va-panel
                className={cn(
                  "absolute rounded-md",
                  "flex items-center justify-center",
                  "text-[12px] font-mono uppercase tracking-wider",
                  "border transition-colors duration-200",
                )}
                style={{
                  width: tileW,
                  height: tileH,
                  left: i * (tileW + gap),
                  top: 10,
                  backgroundColor:
                    isCurrentActive || (prefersReducedMotion && i === 2)
                      ? TILE_COLORS[i]
                      : `color-mix(in oklch, ${TILE_COLORS[i]} 10%, var(--sf-bg-subtle))`,
                  borderColor: isActive
                    ? TILE_COLORS[i]
                    : "var(--sf-border-subtle)",
                  color:
                    isCurrentActive || (prefersReducedMotion && i === 2)
                      ? "oklch(1 0 0)"
                      : "var(--sf-text-secondary)",
                  boxShadow: isExecuteGlow
                    ? "0 0 20px color-mix(in oklch, var(--va-yellow) 42%, transparent)"
                    : "none",
                }}
              >
                {tile.label}
              </motion.div>
            );
          })}
        </div>

        {/* Caption */}
        <p
          className="text-[11px] font-mono uppercase tracking-wider"
          style={{ color: "var(--sf-text-tertiary)" }}
        >
          Sequential workflow
        </p>
      </div>
    </VisualWrapper>
  );
}
