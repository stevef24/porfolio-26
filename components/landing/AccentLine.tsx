"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface AccentLineProps {
  className?: string;
  delay?: number;
}

export function AccentLine({
  className,
  delay = 0.1,
}: AccentLineProps): JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn("h-[1px] w-12 bg-primary", className)} />;
  }

  return (
    <motion.div
      className={cn("h-[1px] w-12 bg-primary", className)}
      initial={{ scaleX: 0, originX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    />
  );
}

export default AccentLine;
