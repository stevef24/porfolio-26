"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { arrowDraw } from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

interface McpArchitectureMapProps {
  className?: string;
}

const NODES = [
  { id: "claude", label: "Claude Code", description: "AI coding assistant" },
  { id: "mcp", label: "MCP Server", description: "Protocol bridge" },
  {
    id: "tool",
    label: "External Tool",
    description: "Filesystem, Git, DB, etc.",
  },
];
const NODE_COLORS = ["var(--va-cyan)", "var(--va-purple)", "var(--va-yellow)"];

const NODE_W = 140;
const NODE_H = 60;
const GAP = 64;
const SVG_W = NODE_W * 3 + GAP * 2;
const SVG_H = NODE_H + 40; // extra for tooltip

function getNodeX(index: number) {
  return index * (NODE_W + GAP);
}

export function McpArchitectureMap({ className }: McpArchitectureMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const animate = isInView || !!prefersReducedMotion;

  return (
    <VisualWrapper
      className={className}
      label="MCP Architecture Map"
      tone="purple"
    >
      <div ref={ref} className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="mx-auto block w-full max-w-[600px]"
          style={{ minWidth: 360 }}
          role="img"
          aria-label="Architecture flow: Claude Code connects to MCP Server, which connects to External Tool"
        >
          {/* Arrows */}
          {[0, 1].map((i) => {
            const startX = getNodeX(i) + NODE_W;
            const endX = getNodeX(i + 1);
            const y = NODE_H / 2;
            const delay = i === 0 ? 0.3 : 0.7;
            const linkColor = i === 0 ? "var(--va-blue)" : "var(--va-purple)";

            return (
              <g key={`arrow-${i}`}>
                {/* Arrow line */}
                <motion.line
                  x1={startX}
                  y1={y}
                  x2={endX - 6}
                  y2={y}
                  stroke={linkColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  variants={arrowDraw}
                  custom={delay}
                  initial={prefersReducedMotion ? "visible" : "hidden"}
                  animate={animate ? "visible" : "hidden"}
                />
                {/* Arrowhead */}
                <motion.polygon
                  points={`${endX - 8},${y - 5} ${endX},${y} ${endX - 8},${y + 5}`}
                  fill={linkColor}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { delay: delay + 0.3, duration: 0.15 },
                    },
                  }}
                  initial={prefersReducedMotion ? "visible" : "hidden"}
                  animate={animate ? "visible" : "hidden"}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((node, i) => {
            const x = getNodeX(i);
            const delay = i * 0.4;
            const isHovered = hoveredNode === node.id;
            const nodeColor = NODE_COLORS[i];

            return (
              <g key={node.id}>
                {/* Node rect */}
                <motion.rect
                  x={x}
                  y={0}
                  width={NODE_W}
                  height={NODE_H}
                  rx={6}
                  fill={`color-mix(in oklch, ${nodeColor} 9%, var(--sf-bg-surface))`}
                  stroke={`color-mix(in oklch, ${nodeColor} 28%, var(--sf-border-default))`}
                  strokeWidth={1.5}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay,
                        duration: 0.2,
                        ease: "easeOut",
                      },
                    },
                  }}
                  initial={prefersReducedMotion ? "visible" : "hidden"}
                  animate={animate ? "visible" : "hidden"}
                  style={{
                    transformOrigin: `${x + NODE_W / 2}px ${NODE_H / 2}px`,
                    cursor: "default",
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />

                {/* Node label */}
                <motion.text
                  x={x + NODE_W / 2}
                  y={NODE_H / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--sf-text-primary)"
                  fontSize={12}
                  fontWeight={500}
                  fontFamily="var(--font-geist-sans), system-ui, sans-serif"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { delay: delay + 0.1, duration: 0.15 },
                    },
                  }}
                  initial={prefersReducedMotion ? "visible" : "hidden"}
                  animate={animate ? "visible" : "hidden"}
                  style={{ pointerEvents: "none" }}
                >
                  {node.label}
                </motion.text>

                {/* Tooltip */}
                {isHovered && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <rect
                      x={x + NODE_W / 2 - 60}
                      y={NODE_H + 6}
                      width={120}
                      height={24}
                      rx={4}
                      fill="var(--sf-bg-muted)"
                      stroke="var(--sf-border-subtle)"
                      strokeWidth={1}
                    />
                    <text
                      x={x + NODE_W / 2}
                      y={NODE_H + 21}
                      textAnchor="middle"
                      fill="var(--sf-text-secondary)"
                      fontSize={10}
                      fontFamily="var(--font-geist-sans), system-ui, sans-serif"
                    >
                      {node.description}
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </VisualWrapper>
  );
}
