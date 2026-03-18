"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion-variants";

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
    return <div className={cn("h-[1px] w-8 bg-primary", className)} />;
  }

  return (
    <motion.div
      className={cn("h-[1px] w-8 bg-primary", className)}
      style={{ transformOrigin: "0% 50%" }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ ...springSnappy, delay }}
    />
  );
}

export default AccentLine;
