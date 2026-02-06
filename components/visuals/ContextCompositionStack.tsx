"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";
import { staggerContainer, springGentle } from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

const CARDS = [
  { label: "Conversation", description: "User messages and assistant replies" },
  { label: "Files", description: "Code files read into context" },
  { label: "Tool Output", description: "Results from tool executions" },
  { label: "CLAUDE.md", description: "Project instructions and memory" },
  { label: "Skills", description: "Slash-command expansions" },
];
const CARD_COLORS = [
  "var(--va-cyan)",
  "var(--va-blue)",
  "var(--va-purple)",
  "var(--va-pink)",
  "var(--va-yellow)",
];

/** Staggered slide-from-left using springGentle preset */
const cardSlideIn = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      ...springGentle,
    },
  }),
};

interface ContextCompositionStackProps {
  className?: string;
}

export function ContextCompositionStack({
  className,
}: ContextCompositionStackProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <VisualWrapper
      label="Context Composition"
      className={className}
      tone="cyan"
    >
      <div ref={ref} className="py-4">
        {/* Title */}
        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
          className="text-[13px] font-mono uppercase tracking-wider mb-5"
          style={{ color: "var(--sf-text-tertiary)" }}
        >
          Context
        </motion.p>

        {/* Card stack */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative ml-4"
          style={{
            height: `${48 + (CARDS.length - 1) * 8 + (CARDS.length - 1) * 48}px`,
          }}
        >
          {CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              custom={i}
              variants={cardSlideIn}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate={isInView ? "visible" : "hidden"}
              data-va-panel
              className={cn(
                "absolute left-0 w-[320px] h-[48px] rounded-md",
                "border border-[var(--sf-border-subtle)]",
                "flex items-center px-4 gap-3",
                "cursor-default select-none",
                "transition-shadow duration-150",
              )}
              style={{
                top: i * (48 + 8),
                backgroundColor: `color-mix(in oklch, ${CARD_COLORS[i]} 8%, var(--sf-bg-surface))`,
                borderLeftWidth: hoveredIndex === i ? 3 : 1,
                borderLeftColor:
                  hoveredIndex === i
                    ? CARD_COLORS[i]
                    : "var(--sf-border-subtle)",
                zIndex: CARDS.length - i,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Label */}
              <span
                className="text-[12px] font-mono uppercase tracking-wider"
                style={{ color: "var(--sf-text-primary)" }}
              >
                {card.label}
              </span>

              {/* Hover description */}
              <AnimatePresence>
                {hoveredIndex === i && !prefersReducedMotion && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[11px] ml-auto"
                    style={{ color: "var(--sf-text-tertiary)" }}
                  >
                    {card.description}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </VisualWrapper>
  );
}
