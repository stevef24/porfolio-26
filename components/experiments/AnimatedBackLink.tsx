"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const MotionLink = motion.create(Link);

export function AnimatedBackLink() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionLink
      href="/experiments"
      className="inline-flex items-center gap-1.5 text-swiss-caption text-foreground/50 hover:text-foreground transition-colors mb-10 no-underline"
      whileHover={prefersReducedMotion ? {} : { x: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      &larr; Experiments
    </MotionLink>
  );
}
