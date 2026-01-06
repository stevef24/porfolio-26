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
import { springGentle } from "@/lib/motion-variants";
import type { ScrollyCodeStep } from "@/lib/scrolly/types";

interface ScrollyStepProps {
	/** Step index in the steps array */
	index: number;
	/** Step data */
	step: Pick<ScrollyCodeStep, "id" | "title" | "body">;
	/** Total number of steps (for accessibility) */
	totalSteps: number;
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
export function ScrollyStep({ index, step, totalSteps, className }: ScrollyStepProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { activeIndex, setActiveIndex, goToNextStep, goToPrevStep, scrollyId } = useScrollyContext();
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

	// Keyboard navigation handler
	const handleKeyDown = (e: React.KeyboardEvent) => {
		switch (e.key) {
			case "ArrowDown":
			case "ArrowRight":
				e.preventDefault();
				goToNextStep();
				// Focus next step if it exists
				const nextStep = document.getElementById(`${scrollyId}-step-${index + 1}`);
				nextStep?.focus();
				break;
			case "ArrowUp":
			case "ArrowLeft":
				e.preventDefault();
				goToPrevStep();
				// Focus previous step if it exists
				const prevStep = document.getElementById(`${scrollyId}-step-${index - 1}`);
				prevStep?.focus();
				break;
			case "Home":
				e.preventDefault();
				setActiveIndex(0);
				document.getElementById(`${scrollyId}-step-0`)?.focus();
				break;
			case "End":
				e.preventDefault();
				setActiveIndex(totalSteps - 1);
				document.getElementById(`${scrollyId}-step-${totalSteps - 1}`)?.focus();
				break;
		}
	};

	// Click handler to activate step
	const handleClick = () => {
		setActiveIndex(index);
		// Scroll into view smoothly
		ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	return (
		<motion.div
			ref={ref}
			id={`${scrollyId}-step-${index}`}
			className={cn(
				"relative py-8 pl-6 pr-4",
				"min-h-[40vh]", // Ensure enough height for scroll activation
				"transition-colors duration-200",
				"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				className
			)}
			// Accessibility attributes
			role="button"
			tabIndex={0}
			aria-pressed={isActive}
			aria-label={`Step ${index + 1} of ${totalSteps}: ${step.title}`}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			// Spring-based transition for active state
			animate={
				prefersReducedMotion
					? { opacity: 1, x: 0 }
					: {
							opacity: isActive ? 1 : 0.5,
							x: isActive ? 4 : 0, // Subtle shift right when active
						}
			}
			transition={prefersReducedMotion ? { duration: 0 } : springGentle}
		>
			{/* Left border indicator - Code Hike style with spring animation */}
			<motion.div
				className={cn(
					"absolute left-0 top-0 bottom-0",
					isActive ? "bg-foreground" : "bg-border/40"
				)}
				animate={
					prefersReducedMotion
						? { width: 2 }
						: { width: isActive ? 3 : 2 }
				}
				transition={prefersReducedMotion ? { duration: 0 } : springGentle}
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
