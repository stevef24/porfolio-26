"use client";

/**
 * ScrollyStep - Individual step card with scroll-based activation
 *
 * Uses Motion's useInView to detect when the step enters the viewport's center.
 * Reports visibility to ScrollyContext for active step tracking.
 */

import { useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useScrollyContext } from "./ScrollyContext";
import { SCROLLY_DEFAULTS } from "@/lib/scrolly/types";
import type { ScrollyCodeStep } from "@/lib/scrolly/types";

interface ScrollyStepProps {
	/** Step index in the steps array */
	index: number;
	/** Step data */
	step: Pick<ScrollyCodeStep, "id" | "title" | "body">;
	/** Additional CSS classes */
	className?: string;
}

/**
 * Step card component with active state detection.
 *
 * When the step enters the viewport's center zone (defined by inViewMargin),
 * it updates the context's activeIndex. The active step displays a left
 * border indicator.
 *
 * @example
 * ```tsx
 * <ScrollyStep index={0} step={steps[0]} />
 * ```
 */
export function ScrollyStep({ index, step, className }: ScrollyStepProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { activeIndex, setActiveIndex } = useScrollyContext();
	const prefersReducedMotion = useReducedMotion();

	const isActive = activeIndex === index;

	// Detect when this step enters the center zone
	const isInView = useInView(ref, {
		margin: SCROLLY_DEFAULTS.inViewMargin,
		// Don't use 'once' - we need continuous detection as user scrolls
	});

	// Update context when this step becomes visible in the center zone
	useEffect(() => {
		if (isInView) {
			setActiveIndex(index);
		}
	}, [isInView, index, setActiveIndex]);

	return (
		<motion.div
			ref={ref}
			id={`scrolly-step-${step.id}`}
			className={cn(
				"relative py-8 pl-6 pr-4",
				"min-h-[40vh]", // Ensure enough height for scroll activation
				"transition-colors duration-200",
				className
			)}
			// Subtle fade for non-active steps
			animate={{
				opacity: prefersReducedMotion ? 1 : isActive ? 1 : 0.5,
			}}
			transition={{ duration: 0.2 }}
		>
			{/* Left border indicator - Code Hike style */}
			<div
				className={cn(
					"absolute left-0 top-0 bottom-0 w-[2px]",
					"transition-colors duration-200",
					isActive ? "bg-foreground" : "bg-border/40"
				)}
				aria-hidden="true"
			/>

			{/* Step content */}
			<div className="space-y-3">
				<h3
					className={cn(
						"text-swiss-subheading",
						"transition-colors duration-200",
						isActive ? "text-foreground" : "text-muted-foreground"
					)}
				>
					{step.title}
				</h3>

				<div
					className={cn(
						"text-swiss-body",
						"transition-colors duration-200",
						isActive ? "text-foreground" : "text-muted-foreground"
					)}
				>
					{step.body}
				</div>
			</div>
		</motion.div>
	);
}
