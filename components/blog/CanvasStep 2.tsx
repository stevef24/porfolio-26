"use client";

/**
 * CanvasStep - Scroll-triggered step wrapper for CanvasZone.
 * Registers with CanvasZoneContext for active step tracking.
 * Features a minimal left-side arrow indicator that springs into place.
 */

import { useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCanvasZoneContext } from "./CanvasZoneContext";

interface CanvasStepProps {
	index: number;
	children: ReactNode;
	className?: string;
}

export function CanvasStep({
	index,
	children,
	className,
}: CanvasStepProps): JSX.Element {
	const ref = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();
	const {
		activeStepIndex,
		setActiveStepIndex,
		registerStep,
		unregisterStep,
		goToNextStep,
		goToPrevStep,
		totalSteps,
		zoneId,
		renderCanvasContent,
	} = useCanvasZoneContext();

	const isActive = activeStepIndex === index;
	const mobileCanvasContent = renderCanvasContent(index);

	// Spring config for snappy arrow animation
	const arrowSpring = {
		type: "spring" as const,
		stiffness: 400,
		damping: 25,
		mass: 0.8,
	};

	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		registerStep(index, element);
		return () => unregisterStep(index);
	}, [index, registerStep, unregisterStep]);

	function handleKeyDown(e: React.KeyboardEvent): void {
		const focusStep = (stepIndex: number) => {
			document.getElementById(`${zoneId}-canvas-step-${stepIndex}`)?.focus();
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
				setActiveStepIndex(0);
				focusStep(0);
				break;
			case "End":
				e.preventDefault();
				setActiveStepIndex(totalSteps - 1);
				focusStep(totalSteps - 1);
				break;
		}
	}

	function handleClick(): void {
		setActiveStepIndex(index);
		ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
	}

	return (
		<div
			ref={ref}
			id={`${zoneId}-canvas-step-${index}`}
			data-canvas-step-index={index}
			data-canvas-step-active={isActive}
			className={cn(
				"canvas-step relative cursor-pointer rounded-lg",
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				className
			)}
			role="button"
			tabIndex={0}
			aria-pressed={isActive}
			aria-label={`Step ${index + 1} of ${totalSteps}`}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			{/* Arrow indicator - springs into place when active, aligned with first line */}
			<AnimatePresence>
				{isActive && (
					<motion.span
						initial={prefersReducedMotion ? false : { x: -12, opacity: 0, scale: 0.8 }}
						animate={{ x: 0, opacity: 1, scale: 1 }}
						exit={prefersReducedMotion ? undefined : { x: -8, opacity: 0, scale: 0.8 }}
						transition={prefersReducedMotion ? { duration: 0 } : arrowSpring}
						className="absolute left-0 top-[2.15rem] text-muted-foreground select-none text-lg"
						aria-hidden="true"
					>
						›
					</motion.span>
				)}
			</AnimatePresence>

			{children}

			{mobileCanvasContent && (
				<div className="md:hidden mt-4 rounded-2xl overflow-hidden bg-secondary p-4">
					{mobileCanvasContent}
				</div>
			)}
		</div>
	);
}
