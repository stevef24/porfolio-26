"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";
import { layerStack, fadeIn } from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

const LAYERS = [
  {
    label: "CLI",
    description: "Terminal interface, prompt loop, output formatting",
  },
  {
    label: "Tools",
    description: "File ops, Bash, Grep, Glob, Edit, Write",
  },
  {
    label: "MCP",
    description: "Model Context Protocol servers and transports",
  },
  {
    label: "Model",
    description: "Claude API calls, streaming, token management",
  },
];
const LAYER_COLORS = [
  "var(--va-cyan)",
  "var(--va-blue)",
  "var(--va-purple)",
  "var(--va-yellow)",
];

interface ClaudeCodeStackProps {
  className?: string;
}

export function ClaudeCodeStack({ className }: ClaudeCodeStackProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <VisualWrapper
      label="System Architecture"
      className={className}
      tone="yellow"
    >
      <div ref={ref} className="flex flex-col items-center py-4">
        {/* Sandbox wrapper */}
        <motion.div
          variants={fadeIn}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          animate={isInView ? "visible" : "hidden"}
          data-va-panel
          className={cn(
            "relative w-full max-w-[420px] rounded-lg",
            "border-2 border-dashed border-[var(--sf-border-default)]",
            "p-5 pt-8",
          )}
        >
          {/* Sandbox label */}
          <span
            className="absolute top-2 left-4 text-[10px] font-mono uppercase tracking-wider"
            style={{ color: "var(--sf-text-tertiary)" }}
          >
            Sandbox
          </span>

          {/* Layer stack */}
          <div className="flex flex-col-reverse gap-2">
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.label}
                custom={i}
                variants={layerStack}
                initial={prefersReducedMotion ? "visible" : "hidden"}
                animate={isInView ? "visible" : "hidden"}
                data-va-panel
                className={cn(
                  "relative w-full h-[48px] rounded-md",
                  "border border-[var(--sf-border-subtle)]",
                  "flex items-center justify-center",
                  "cursor-default select-none",
                  "transition-colors duration-150",
                )}
                style={{
                  backgroundColor: `color-mix(in oklch, ${LAYER_COLORS[i]} 10%, var(--sf-bg-surface))`,
                  borderLeftWidth: hoveredIndex === i ? 3 : 1,
                  borderLeftColor:
                    hoveredIndex === i
                      ? LAYER_COLORS[i]
                      : "var(--sf-border-subtle)",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  className="text-[12px] font-mono uppercase tracking-wider"
                  style={{ color: "var(--sf-text-primary)" }}
                >
                  {layer.label}
                </span>

                {/* Hover description */}
                <AnimatePresence>
                  {hoveredIndex === i && !prefersReducedMotion && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 text-[11px] px-2 py-1 whitespace-nowrap z-10"
                      style={{ color: "var(--sf-text-tertiary)" }}
                    >
                      {layer.description}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </VisualWrapper>
  );
}
