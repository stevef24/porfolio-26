"use client";

/**
 * CanvasStep - Scroll-triggered step wrapper for CanvasZone.
 * Registers with CanvasZoneContext for active step tracking.
 */

import { useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCanvasZoneContext } from "./CanvasZoneContext";

interface CanvasStepProps {
	index: number;
	children: ReactNode;
	className?: string;
}

export function CanvasStep({ index, children, className }: CanvasStepProps) {
	const ref = useRef<HTMLDivElement>(null);
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
			className={cn(
				"relative cursor-pointer rounded-lg",
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
			{children}

			{mobileCanvasContent && (
				<div className="md:hidden mt-4 rounded-2xl overflow-hidden bg-secondary p-4">
					{mobileCanvasContent}
				</div>
			)}
		</div>
	);
}
