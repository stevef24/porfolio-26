"use client";

/**
 * ScrollyCoding - Main container for scrollytelling code walkthroughs.
 * Desktop: Two-column layout with fixed canvas drawer that slides in from right.
 * Mobile: Inline code after each step (no drawer animation).
 */

import { useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springScrollySplit } from "@/lib/motion-variants";
import { ScrollyProvider } from "./ScrollyContext";
import { ScrollyDrawerProvider, useScrollyDrawer } from "./ScrollyDrawerContext";
import { ScrollyStep } from "./ScrollyStep";
import { ScrollyStage } from "./ScrollyStage";
import { ScrollyStageMobile } from "./ScrollyStageMobile";
import { ScrollyLiveRegion } from "./ScrollyLiveRegion";
import type { ScrollyCodingProps } from "@/lib/scrolly/types";
import type { CompilationResult } from "@/lib/scrolly/utils";

interface ScrollyCodingComponentProps extends Omit<ScrollyCodingProps, "compiledSteps"> {
	compiledSteps: CompilationResult;
}

/** Inner component that consumes drawer context. */
function ScrollyCodingInner({
	steps,
	compiledSteps,
	className,
}: ScrollyCodingComponentProps) {
	const { isDrawerOpen, openDrawer, closeDrawer } = useScrollyDrawer();
	const prefersReducedMotion = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);
	const stepsContainerRef = useRef<HTMLDivElement>(null);

	// Track when steps container enters center zone (drawer trigger)
	const isStepsInView = useInView(stepsContainerRef, {
		margin: "-45% 0px -45% 0px",
	});

	// Sync drawer state with scroll position
	useEffect(() => {
		if (isStepsInView && !isDrawerOpen) openDrawer();
		if (!isStepsInView && isDrawerOpen) closeDrawer();
	}, [isStepsInView, isDrawerOpen, openDrawer, closeDrawer]);

	const transition = prefersReducedMotion ? { duration: 0 } : springScrollySplit;

	return (
		<motion.section
			ref={sectionRef}
			className={cn(
				"relative flex w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden",
				className
			)}
			aria-label="Interactive code walkthrough"
			aria-roledescription="code walkthrough"
		>
			<ScrollyLiveRegion steps={steps} />

			{/* Blog content column - compresses when drawer opens */}
			<motion.div
				layout
				className="flex-shrink-0 w-full flex justify-center"
				animate={{ width: isDrawerOpen ? "50vw" : "100vw" }}
				transition={transition}
				style={{ willChange: "width" }}
			>
				<div className="w-[680px] max-w-full px-4 md:px-6 mx-auto">
					<div className="hidden md:block h-[15vh]" aria-hidden="true" />

					<div
						ref={stepsContainerRef}
						className="space-y-0"
						role="list"
						aria-label="Walkthrough steps"
					>
						{steps.map((step, index) => (
							<div key={step.id} role="listitem">
								<ScrollyStep index={index} step={step} totalSteps={steps.length} />
								<div className="md:hidden pb-6">
									<ScrollyStageMobile
										compiledSteps={compiledSteps}
										step={step}
										stepIndex={index}
									/>
								</div>
							</div>
						))}
					</div>

					<div className="hidden md:block h-[30vh]" aria-hidden="true" />
				</div>
			</motion.div>

			{/* Desktop drawer - slides in from right */}
			<motion.div
				className="hidden md:block fixed right-0 top-0 h-screen w-[50vw] p-2 z-30 font-mono"
				initial={{ x: "100%" }}
				animate={{ x: isDrawerOpen ? "0%" : "100%" }}
				transition={transition}
			>
				<ScrollyStage compiledSteps={compiledSteps} steps={steps} />
			</motion.div>
		</motion.section>
	);
}

/** Main scrolly coding component with context providers. */
export function ScrollyCoding(props: ScrollyCodingComponentProps) {
	return (
		<ScrollyDrawerProvider>
			<ScrollyProvider totalSteps={props.steps.length}>
				<ScrollyCodingInner {...props} />
			</ScrollyProvider>
		</ScrollyDrawerProvider>
	);
}
