"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { timelineProgress, nodeGlow } from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

interface HookTimelineProps {
  className?: string;
}

const NODES = [
  { id: "pre", label: "PreToolUse", delay: 0 },
  { id: "tool", label: "Tool", delay: 0.3 },
  { id: "post", label: "PostToolUse", delay: 0.6 },
  { id: "stop", label: "Stop", delay: 0.9 },
];
const NODE_COLORS = [
  "var(--va-cyan)",
  "var(--va-blue)",
  "var(--va-purple)",
  "var(--va-pink)",
];

const NODE_RADIUS = 6;

export function HookTimeline({ className }: HookTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const animate = isInView || !!prefersReducedMotion;

  return (
    <VisualWrapper
      className={className}
      label="Hook Lifecycle Timeline"
      tone="cyan"
    >
      <div ref={ref} className="flex flex-col gap-3 px-2 py-4">
        {/* Timeline SVG */}
        <div className="relative w-full" style={{ height: 40 }}>
          <svg
            viewBox="0 0 400 40"
            className="block h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Timeline showing hook lifecycle: PreToolUse, Tool, PostToolUse, Stop"
          >
            <defs>
              <linearGradient
                id="hook-gradient"
                x1="20"
                y1="16"
                x2="380"
                y2="16"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--va-cyan)" />
                <stop offset="35%" stopColor="var(--va-blue)" />
                <stop offset="70%" stopColor="var(--va-purple)" />
                <stop offset="100%" stopColor="var(--va-pink)" />
              </linearGradient>
            </defs>

            {/* Track */}
            <line
              x1={20}
              y1={16}
              x2={380}
              y2={16}
              stroke="var(--sf-bg-muted)"
              strokeWidth={2}
              strokeLinecap="round"
            />

            {/* Progress highlight */}
            <motion.line
              x1={20}
              y1={16}
              x2={380}
              y2={16}
              stroke="url(#hook-gradient)"
              strokeWidth={2}
              strokeLinecap="round"
              variants={timelineProgress}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate={animate ? "visible" : "hidden"}
              style={{ originX: "20px", transformOrigin: "20px 16px" }}
            />

            {/* Nodes */}
            {NODES.map((node, i) => {
              const cx = 20 + (i / (NODES.length - 1)) * 360;
              const nodeColor = NODE_COLORS[i];

              return (
                <g key={node.id}>
                  {/* Glow effect */}
                  <motion.circle
                    cx={cx}
                    cy={16}
                    r={NODE_RADIUS + 4}
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth={1.5}
                    opacity={0}
                    variants={{
                      dim: { opacity: 0, scale: 1 },
                      glow: (delay: number) => ({
                        opacity: [0, 0.4, 0.2],
                        scale: [1, 1.4, 1.2],
                        transition: {
                          delay,
                          duration: 0.5,
                          ease: "easeOut",
                        },
                      }),
                    }}
                    custom={node.delay}
                    initial="dim"
                    animate={animate ? "glow" : "dim"}
                    style={{ transformOrigin: `${cx}px 16px` }}
                  />

                  {/* Node circle */}
                  <motion.circle
                    cx={cx}
                    cy={16}
                    r={NODE_RADIUS}
                    variants={nodeGlow}
                    custom={node.delay}
                    initial={prefersReducedMotion ? "glow" : "dim"}
                    animate={animate ? "glow" : "dim"}
                    fill={nodeColor}
                    stroke="var(--sf-bg-surface)"
                    strokeWidth={2}
                    style={{ transformOrigin: `${cx}px 16px` }}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Labels */}
        <div className="flex justify-between px-0">
          {NODES.map((node) => (
            <span
              key={node.id}
              className={cn(
                "text-swiss-caption text-center",
                "text-[var(--sf-text-secondary)]",
                "w-[80px] text-[10px] sm:text-[11px]",
              )}
            >
              {node.label}
            </span>
          ))}
        </div>
      </div>
    </VisualWrapper>
  );
}
