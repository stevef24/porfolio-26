"use client";

/**
 * ScrollyStep - Individual step card with scroll-based activation.
 * Uses useInView to detect when step enters viewport center zone.
 */

import { useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springGentle } from "@/lib/motion-variants";
import { useScrollyContext } from "./ScrollyContext";
import { SCROLLY_DEFAULTS } from "@/lib/scrolly/types";
import type { ScrollyCodeStep } from "@/lib/scrolly/types";

interface ScrollyStepProps {
	index: number;
	step: Pick<ScrollyCodeStep, "id" | "title" | "body">;
	totalSteps: number;
	className?: string;
}

export function ScrollyStep({ index, step, totalSteps, className }: ScrollyStepProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { activeIndex, setActiveIndex, goToNextStep, goToPrevStep, scrollyId } = useScrollyContext();
	const prefersReducedMotion = useReducedMotion();

	const isActive = activeIndex === index;
	const isPast = activeIndex > index;

	const isInView = useInView(ref, { margin: SCROLLY_DEFAULTS.inViewMargin });

	useEffect(() => {
		if (isInView) setActiveIndex(index);
	}, [isInView, index, setActiveIndex]);

	function handleKeyDown(e: React.KeyboardEvent): void {
		const focusStep = (stepIndex: number) => {
			document.getElementById(`${scrollyId}-step-${stepIndex}`)?.focus();
		};

		switch (e.key) {
			case "ArrowDown":
			case "ArrowRight":
				e.preventDefault();
				goToNextStep();
				focusStep(index + 1);
				break;
			case "ArrowUp":
			case "ArrowLeft":
				e.preventDefault();
				goToPrevStep();
				focusStep(index - 1);
				break;
			case "Home":
				e.preventDefault();
				setActiveIndex(0);
				focusStep(0);
				break;
			case "End":
				e.preventDefault();
				setActiveIndex(totalSteps - 1);
				focusStep(totalSteps - 1);
				break;
		}
	}

	function handleClick(): void {
		setActiveIndex(index);
		ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
	}

	// Opacity: active = 1, past = 0.3, future = 0.5
	const opacity = isActive ? 1 : isPast ? 0.3 : 0.5;
	const animateProps = prefersReducedMotion
		? { opacity: 1, x: 0 }
		: { opacity, x: isActive ? 4 : 0 };

	return (
		<motion.div
			ref={ref}
			id={`${scrollyId}-step-${index}`}
			className={cn(
				"relative scrolly-step",
				"md:min-h-[18vh] py-4 md:py-0",
				"cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				"rounded-lg -mx-3 px-3",
				"hover:bg-muted/30 transition-colors duration-150",
				className
			)}
			role="button"
			tabIndex={0}
			aria-pressed={isActive}
			aria-label={`Step ${index + 1} of ${totalSteps}: ${step.title}`}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			animate={animateProps}
			transition={prefersReducedMotion ? { duration: 0 } : springGentle}
		>
			<div className="space-y-4">
				<h3 className="scrolly-text-title">{step.title}</h3>
				<div className="scrolly-text-body">{step.body}</div>
			</div>
		</motion.div>
	);
}
