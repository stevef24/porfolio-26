"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState, useEffect } from "react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  blur?: string;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
}

const BlurFade = ({
  children,
  className,
  duration = 0.4,
  delay = 0,
  blur = "6px",
  yOffset = 6,
  inView = false,
  inViewMargin = "-50px",
}: BlurFadeProps) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const inViewResult = useInView(ref, {
    once: true,
    margin: inViewMargin as `${number}px ${number}px ${number}px ${number}px`,
  });
  const isInView = !inView || inViewResult;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div ref={ref} className={className} style={{ opacity: 0 }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, filter: `blur(${blur})`, y: yOffset }
      }
      animate={
        isInView
          ? shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, filter: "blur(0px)", y: 0 }
          : shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, filter: `blur(${blur})`, y: yOffset }
      }
      transition={{
        delay: shouldReduceMotion ? 0 : delay,
        duration: shouldReduceMotion ? 0.01 : duration,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default BlurFade;
