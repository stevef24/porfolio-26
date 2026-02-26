"use client";

/**
 * CanvasStep - Scroll-triggered step wrapper for CanvasZone.
 * Registers with CanvasZoneContext for active step tracking.
 * Features a minimal left-side arrow indicator that springs into place.
 */

import { useRef, useEffect, useState, type ReactNode } from "react";
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

	// Track scroll direction: compare new activeStepIndex to previous
	const prevIndexRef = useRef<number>(activeStepIndex);
	const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");

	useEffect(() => {
		if (activeStepIndex !== prevIndexRef.current) {
			setScrollDirection(activeStepIndex > prevIndexRef.current ? "down" : "up");
			prevIndexRef.current = activeStepIndex;
		}
	}, [activeStepIndex]);

	// Bar grows from top when scrolling down, from bottom when scrolling up
	const barOrigin = scrollDirection === "down" ? "top" : "bottom";

	// Spring config for bar indicator
	const barSpring = {
		type: "spring" as const,
		visualDuration: 0.28,
		bounce: 0,
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
				"canvas-step relative cursor-pointer rounded-lg pl-4",
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
			{/* Left bar — direction-aware: grows from top (scroll ↓) or bottom (scroll ↑) */}
			<AnimatePresence mode="sync">
				{isActive && (
					<motion.div
						initial={prefersReducedMotion ? false : { scaleY: 0, opacity: 0 }}
						animate={{ scaleY: 1, opacity: 1 }}
						exit={prefersReducedMotion ? undefined : { scaleY: 0, opacity: 0 }}
						transition={prefersReducedMotion ? { duration: 0 } : barSpring}
						className="absolute left-0 top-1 bottom-1 w-px rounded-full"
						style={{
							transformOrigin: `center ${barOrigin}`,
							background:
								"linear-gradient(to bottom, transparent 0%, var(--foreground) 22%, var(--foreground) 78%, transparent 100%)",
						}}
						aria-hidden="true"
					/>
				)}
			</AnimatePresence>

			{children}

			{mobileCanvasContent && (
				<MobileCodeCollapsible>{mobileCanvasContent}</MobileCodeCollapsible>
			)}
		</div>
	);
}

/* ── Collapsible wrapper for mobile code snippets ──────────────── */

function MobileCodeCollapsible({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(true);
	const contentRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();

	return (
		<div className="md:hidden mt-4" onClick={(e) => e.stopPropagation()}>
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className={cn(
					"flex items-center gap-2 w-full text-left",
					"text-swiss-code",
					"text-muted-foreground hover:text-foreground/70",
					"py-2 transition-colors"
				)}
				aria-expanded={isOpen}
			>
				<motion.span
					animate={{ rotate: isOpen ? 90 : 0 }}
					transition={
						prefersReducedMotion
							? { duration: 0 }
							: { type: "spring", visualDuration: 0.2, bounce: 0 }
					}
					className="text-xs"
					aria-hidden="true"
				>
					&#9654;
				</motion.span>
				{isOpen ? "Hide code" : "Show code"}
			</button>
			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						ref={contentRef}
						initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={
							prefersReducedMotion
								? undefined
								: { height: 0, opacity: 0 }
						}
						transition={
							prefersReducedMotion
								? { duration: 0 }
								: { type: "spring", visualDuration: 0.3, bounce: 0.05 }
						}
						className="overflow-hidden"
					>
						<div className="rounded-[10px] overflow-hidden bg-secondary p-4">
							{children}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
