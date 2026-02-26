"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedBlockquoteProps {
	children: ReactNode;
	className?: string;
}

/**
 * AnimatedBlockquote - Minimal blockquote with thin left border
 * Swiss-inspired, no background, clean typography
 */
export function AnimatedBlockquote({
	children,
	className,
}: AnimatedBlockquoteProps): JSX.Element {
	const ref = useRef<HTMLQuoteElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-80px" });
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.blockquote
			ref={ref}
			className={cn(
				"relative my-10 py-4 pl-5 pr-0",
				"border-l border-foreground/15",
				className
			)}
			initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
			animate={isInView ? { opacity: 1, y: 0 } : {}}
			transition={{
				duration: 0.4,
				ease: [0.25, 0.46, 0.45, 0.94],
			}}
		>
			<div className="text-[15px] leading-relaxed text-foreground/70">
				{children}
			</div>
		</motion.blockquote>
	);
}
