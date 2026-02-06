"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  fadeIn,
  staggerContainer,
  slideUpSubtle,
  typingCursor,
} from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

const TITLE = "Session Summary";
const TYPING_SPEED = 50;

const BULLETS = [
  { marker: "Done", text: "Migrated auth to v2", color: "var(--va-cyan)" },
  { marker: "Blocked", text: "CI timeout on deploy", color: "var(--va-pink)" },
  { marker: "Next", text: "Add rate limiting", color: "var(--va-blue)" },
];

interface SessionMemoryNoteProps {
  className?: string;
}

export function SessionMemoryNote({ className }: SessionMemoryNoteProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [typedTitle, setTypedTitle] = useState(
    prefersReducedMotion ? TITLE : "",
  );
  const [isTyping, setIsTyping] = useState(false);
  const [showBullets, setShowBullets] = useState(!!prefersReducedMotion);

  const startTyping = useCallback(() => {
    if (prefersReducedMotion) return;
    setIsTyping(true);
    let charIndex = 0;

    const interval = setInterval(() => {
      charIndex++;
      setTypedTitle(TITLE.slice(0, charIndex));

      if (charIndex >= TITLE.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => setShowBullets(true), 200);
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (isInView && typedTitle === "" && !prefersReducedMotion) {
      const timer = setTimeout(startTyping, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, typedTitle, prefersReducedMotion, startTyping]);

  return (
    <VisualWrapper label="Session Memory" className={className} tone="blue">
      <div ref={ref} className="flex justify-center py-4">
        <motion.div
          variants={fadeIn}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          animate={isInView ? "visible" : "hidden"}
          data-va-panel
          className={cn(
            "w-full max-w-[400px] rounded-md",
            "border border-[var(--sf-border-subtle)]",
            "bg-[var(--sf-bg-surface)]",
            "p-5",
          )}
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          {/* Title with typing animation */}
          <div className="flex items-center h-[24px] mb-4">
            <span
              className="text-[14px] font-mono font-semibold"
              style={{ color: "var(--sf-text-primary)" }}
            >
              {typedTitle}
            </span>

            {/* Blinking cursor */}
            {isTyping && (
              <motion.span
                variants={typingCursor}
                animate="blink"
                className="inline-block w-[2px] h-[16px] ml-0.5"
                style={{ backgroundColor: "var(--va-blue)" }}
              />
            )}
          </div>

          {/* Bullet list */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={showBullets ? "visible" : "hidden"}
            className="space-y-3"
          >
            {BULLETS.map((bullet) => (
              <motion.div
                key={bullet.marker}
                variants={slideUpSubtle}
                initial={prefersReducedMotion ? "visible" : "hidden"}
                animate={showBullets ? "visible" : "hidden"}
                className="flex items-start gap-2"
              >
                <span
                  className="text-[10px] font-mono uppercase tracking-wider font-semibold mt-0.5 shrink-0"
                  style={{ color: bullet.color }}
                >
                  {bullet.marker}:
                </span>
                <span
                  className="text-[12px] leading-relaxed"
                  style={{ color: "var(--sf-text-secondary)" }}
                >
                  {bullet.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </VisualWrapper>
  );
}
