"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedBlockquoteProps {
	children: ReactNode;
	className?: string;
}

/**
 * AnimatedBlockquote - Elegant pull quote with subtle primary accent
 * Clean lines, minimal decoration, refined entrance
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
				"relative my-10 py-6 pl-6 pr-4",
				"border-l-2 border-[var(--sf-border-default)]",
				"bg-[var(--sf-bg-subtle)]",
				"rounded-r-[10px]",
				className
			)}
			initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
			animate={isInView ? { opacity: 1, x: 0 } : {}}
			transition={{
				duration: 0.5,
				ease: [0.25, 0.46, 0.45, 0.94],
			}}
		>
			{/* Quote text */}
			<div className="text-swiss-body-lg italic">
				{children}
			</div>

			{/* Subtle decorative quote mark */}
			<motion.span
				className="absolute -top-2 left-3 text-5xl text-primary/15 font-display leading-none pointer-events-none select-none"
				initial={{ opacity: 0 }}
				animate={isInView ? { opacity: 1 } : {}}
				transition={{
					duration: 0.4,
					delay: shouldReduceMotion ? 0 : 0.2,
				}}
				aria-hidden="true"
			>
				&ldquo;
			</motion.span>
		</motion.blockquote>
	);
}
