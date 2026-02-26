"use client";

import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { sequentialHighlight, arrowDraw } from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

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
  const totalH = tileH + 20;

  // Responsive scaling — shrink the fixed layout to fit narrow containers
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setScale(Math.min(1, el.clientWidth / totalW));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [totalW]);

  return (
    <VisualWrapper
      label="Plan - Clear - Execute"
      className={className}
      tone="purple"
      onReplay={handleReplay}
      showReplay={hasPlayed && !prefersReducedMotion}
    >
      <div ref={ref} className="relative flex flex-col items-center gap-6 py-4">
        {/* Measure container, then scale inner content to fit */}
        <div
          ref={containerRef}
          className="w-full"
          style={{ height: totalH * scale }}
        >
          <div
            className="relative mx-auto"
            style={{
              width: totalW,
              height: totalH,
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            {/* SVG arrows */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={totalW}
              height={totalH}
              viewBox={`0 0 ${totalW} ${totalH}`}
              fill="none"
            >
              {/* Arrow 1: Plan -> Clear */}
              <motion.path
                d={`M ${tileW + 4} ${totalH / 2} L ${tileW + gap - 4} ${totalH / 2}`}
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
                d={`M ${tileW + gap - 12} ${totalH / 2 - 4} L ${tileW + gap - 4} ${totalH / 2} L ${tileW + gap - 12} ${totalH / 2 + 4}`}
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
                d={`M ${tileW * 2 + gap + 4} ${totalH / 2} L ${tileW * 2 + gap * 2 - 4} ${totalH / 2}`}
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
                d={`M ${tileW * 2 + gap * 2 - 12} ${totalH / 2 - 4} L ${tileW * 2 + gap * 2 - 4} ${totalH / 2} L ${tileW * 2 + gap * 2 - 12} ${totalH / 2 + 4}`}
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
                    "transition-colors duration-200",
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
