"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualWrapper } from "./VisualWrapper";

interface SignalNoiseDialProps {
  className?: string;
}

// Dial geometry
const CX = 200;
const CY = 180;
const RADIUS = 140;
const STROKE_W = 12;
const NEEDLE_LEN = 110;

// Convert percentage (0-100) to angle in degrees (-90 = Signal, +90 = Noise)
function pctToAngle(pct: number): number {
  return -90 + (pct / 100) * 180;
}

// Arc path for the semi-circle track
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

const TARGET_PCT = 72;
const WARNING_THRESHOLD = 60;

export function SignalNoiseDial({ className }: SignalNoiseDialProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [currentPct, setCurrentPct] = useState(prefersReducedMotion ? 65 : 0);
  const [animating, setAnimating] = useState(false);
  const [showWarning, setShowWarning] = useState(!!prefersReducedMotion);

  const runAnimation = useCallback(() => {
    if (prefersReducedMotion) return;
    setAnimating(true);
    setCurrentPct(0);
    setShowWarning(false);

    const duration = 2000;
    const startTime = Date.now();

    const frame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const pct = Math.round(eased * TARGET_PCT);
      setCurrentPct(pct);

      if (pct >= WARNING_THRESHOLD && !showWarning) {
        setShowWarning(true);
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setAnimating(false);
      }
    };

    requestAnimationFrame(frame);
  }, [prefersReducedMotion, showWarning]);

  useEffect(() => {
    if (isInView && !animating && currentPct === 0 && !prefersReducedMotion) {
      const timer = setTimeout(runAnimation, 400);
      return () => clearTimeout(timer);
    }
  }, [isInView, animating, currentPct, runAnimation, prefersReducedMotion]);

  // Compute needle endpoint
  const needleAngle = pctToAngle(currentPct);
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleX = CX + NEEDLE_LEN * Math.cos(needleRad);
  const needleY = CY + NEEDLE_LEN * Math.sin(needleRad);

  // Track arcs
  const trackPath = describeArc(CX, CY, RADIUS, -180, 0);
  const needleColor =
    currentPct >= WARNING_THRESHOLD ? "var(--va-pink)" : "var(--va-cyan)";

  return (
    <VisualWrapper label="Signal vs Noise" className={className} tone="pink">
      <div ref={ref} className="flex flex-col items-center gap-4 py-4">
        {/* SVG Dial */}
        <svg
          width="100%"
          viewBox="0 0 400 220"
          className="max-w-[400px]"
          role="img"
          aria-label={`Signal to noise dial at ${currentPct}%`}
        >
          <defs>
            {/* Signal -> Noise gradient (2 accent max) */}
            <linearGradient
              id="dial-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="var(--va-cyan)" />
              <stop offset="55%" stopColor="var(--va-yellow)" />
              <stop offset="100%" stopColor="var(--va-pink)" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d={trackPath}
            fill="none"
            stroke="var(--sf-bg-muted)"
            strokeWidth={STROKE_W}
            strokeLinecap="round"
          />

          {/* Colored fill track */}
          {currentPct > 0 && (
            <path
              d={describeArc(
                CX,
                CY,
                RADIUS,
                -180,
                -180 + (currentPct / 100) * 180,
              )}
              fill="none"
              stroke="url(#dial-gradient)"
              strokeWidth={STROKE_W}
              strokeLinecap="round"
            />
          )}

          {/* Needle */}
          <line
            x1={CX}
            y1={CY}
            x2={needleX}
            y2={needleY}
            stroke="var(--sf-text-primary)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {/* Needle tip dot */}
          <circle cx={needleX} cy={needleY} r={4} fill={needleColor} />
          {/* Center pivot */}
          <circle cx={CX} cy={CY} r={6} fill="var(--sf-text-primary)" />

          {/* Signal label (left) */}
          <text
            x={CX - RADIUS - 8}
            y={CY + 20}
            textAnchor="end"
            className="text-[11px] font-mono uppercase"
            fill="var(--va-cyan)"
          >
            Signal
          </text>

          {/* Noise label (right) */}
          <text
            x={CX + RADIUS + 8}
            y={CY + 20}
            textAnchor="start"
            className="text-[11px] font-mono uppercase"
            fill="var(--va-pink)"
          >
            Noise
          </text>
        </svg>

        {/* Counter */}
        <div
          data-va-panel
          className="flex flex-col items-center gap-1 rounded-md px-4 py-2"
        >
          <span
            className="text-[28px] font-mono tabular-nums"
            style={{ color: "var(--sf-text-primary)" }}
          >
            {currentPct}%
          </span>
          <span
            className="text-[11px] font-mono uppercase tracking-wider"
            style={{ color: "var(--sf-text-tertiary)" }}
          >
            Noise ratio
          </span>
        </div>

        {/* Warning */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
          animate={showWarning ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          data-va-panel
          className={cn(
            "px-3 py-1.5 rounded-md",
            "text-[11px] font-mono uppercase tracking-wider",
            "border border-[var(--va-pink)]",
          )}
          style={{
            color: "var(--va-pink)",
            backgroundColor:
              "color-mix(in oklch, var(--va-pink) 10%, transparent)",
          }}
        >
          Quality drops past {WARNING_THRESHOLD}%
        </motion.div>
      </div>
    </VisualWrapper>
  );
}
