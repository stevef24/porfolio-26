"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { RoughNotation } from "react-rough-notation";
import type { types } from "react-rough-notation";

interface AnnotateProps {
  type?: types;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  multiline?: boolean;
  padding?: number | [number, number] | [number, number, number, number];
  children: React.ReactNode;
}

export function Annotate({
  type = "underline",
  color = "var(--va-blue)",
  strokeWidth = 2,
  animationDuration = 800,
  multiline = false,
  padding = 5,
  children,
}: AnnotateProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <span ref={ref} style={{ display: "inline" }}>
      <RoughNotation
        type={type}
        show={prefersReducedMotion ? true : isInView}
        color={color}
        strokeWidth={strokeWidth}
        animationDuration={prefersReducedMotion ? 0 : animationDuration}
        multiline={multiline}
        padding={padding}
        animate={!prefersReducedMotion}
      >
        {children}
      </RoughNotation>
    </span>
  );
}
