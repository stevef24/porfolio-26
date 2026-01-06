"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

interface FadeTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  id?: string;
}

const BlurFadeText = ({
  text,
  className,
  delay = 0,
  id,
}: FadeTextProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: shouldReduceMotion ? 0 : delay,
        duration: shouldReduceMotion ? 0.01 : 0.2,
        ease: "easeOut",
      }}
      className={cn("block", className)}
    >
      {text}
    </motion.div>
  );
};

export default BlurFadeText;
