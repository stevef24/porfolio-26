"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type TextTag = "div" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface FadeTextProps {
  text: string;
  as?: TextTag;
  className?: string;
  duration?: number;
  delay?: number;
  id?: string;
}

export default function BlurFadeText({
  text,
  as = "div",
  className,
  duration = 0.2,
  delay = 0,
  id,
}: FadeTextProps): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: shouldReduceMotion ? 0 : delay,
        duration: shouldReduceMotion ? 0.01 : duration,
        ease: "easeOut",
      }}
      className={cn("block", className)}
    >
      {text}
    </MotionTag>
  );
}
