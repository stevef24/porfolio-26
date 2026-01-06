"use client";

/**
 * ScrollyCoding - Main container for scrollytelling code walkthroughs
 *
 * Two-column layout:
 * - Left column: Scrollable step cards
 * - Right column: Sticky code stage with Shiki Magic Move
 *
 * On mobile (<768px), shows inline code after each step (no animation).
 *
 * Entrance Animation:
 * - Section slides in from off-screen when scrolled into view
 * - Similar to a sliding navbar effect
 * - Respects reduced motion preferences
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { ScrollyProvider } from "./ScrollyContext";
import { ScrollyStep } from "./ScrollyStep";
import { ScrollyStage } from "./ScrollyStage";
import { ScrollyStageMobile } from "./ScrollyStageMobile";
import { ScrollyLiveRegion } from "./ScrollyLiveRegion";
import { springSmooth } from "@/lib/motion-variants";
import { SCROLLY_DEFAULTS } from "@/lib/scrolly/types";
import type { ScrollyCodingProps } from "@/lib/scrolly/types";
import type { CompilationResult } from "@/lib/scrolly/utils";

interface ScrollyCodingComponentProps extends Omit<ScrollyCodingProps, "compiledSteps"> {
	/** Compiled tokens from server-side compilation */
	compiledSteps: CompilationResult;
}

/**
 * Main scrolly coding component.
 *
 * @example
 * ```tsx
 * // In a Server Component
 * const compiledSteps = await compileScrollySteps(steps);
 *
 * // Pass to client component
 * <ScrollyCoding steps={steps} compiledSteps={compiledSteps} />
 * ```
 */
export function ScrollyCoding({
	steps,
	compiledSteps,
	doc,
	className,
}: ScrollyCodingComponentProps) {
	const stageConfig = {
		...SCROLLY_DEFAULTS.stage,
		...doc?.stage,
	};

	// Ref for entrance animation detection
	const sectionRef = useRef<HTMLElement>(null);
	const prefersReducedMotion = useReducedMotion();

	// Detect when section enters viewport (trigger once)
	const isInView = useInView(sectionRef, {
		once: true,
		// Start animation when top of section is 20% from bottom of viewport
		margin: "0px 0px -20% 0px",
	});

	// Entrance animation variants - slide up from below with fade
	const sectionVariants = {
		hidden: {
			opacity: 0,
			y: 100, // Start below current position
			scale: 0.98,
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
		},
	};

	return (
		<ScrollyProvider totalSteps={steps.length}>
			{/* Full-bleed wrapper - breaks out of article container */}
			<motion.section
				ref={sectionRef}
				className={cn(
					// Full-bleed: expand to viewport width
					"relative w-screen",
					// Center and break out of parent container
					"left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]",
					// Two-column grid on desktop (50/50 split like Devouring Details)
					"md:grid md:grid-cols-2",
					// Single column on mobile
					"flex flex-col",
					className
				)}
				initial="hidden"
				animate={isInView ? "visible" : "hidden"}
				variants={prefersReducedMotion ? undefined : sectionVariants}
				transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
				aria-label="Interactive code walkthrough"
				aria-roledescription="code walkthrough"
			>
				{/* Screen reader announcements */}
				<ScrollyLiveRegion steps={steps} />

				{/* Steps Column (left on desktop) - generous padding like DD (48px) */}
				<div
					className="relative md:order-1 md:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] md:pr-12"
					role="list"
					aria-label="Walkthrough steps"
				>
					<div className="space-y-0">
						{steps.map((step, index) => (
							<div key={step.id} role="listitem">
								<ScrollyStep
									index={index}
									step={step}
									totalSteps={steps.length}
								/>
								{/* Mobile: Inline code stage after each step */}
								<div className="md:hidden px-4 pb-8">
									<ScrollyStageMobile
										compiledSteps={compiledSteps}
										step={step}
										stepIndex={index}
									/>
								</div>
							</div>
						))}
					</div>

					{/* Bottom padding to allow last step to reach center (desktop only) */}
					<div className="hidden md:block h-[50vh]" aria-hidden="true" />
				</div>

				{/* Stage Column (right on desktop, sticky) - warm background */}
				<div
					className={cn(
						// Mobile: hidden (inline stages shown instead)
						"hidden md:block",
						// Desktop: sticky positioning
						"md:order-2",
						// Warm subtle background (Devouring Details style)
						"scrolly-stage-bg"
					)}
				>
					<div
						className="sticky px-10 py-8"
						style={{
							top: stageConfig.stickyTop,
							height: `calc(100vh - ${stageConfig.stickyTop}px)`,
						}}
					>
						<ScrollyStage
							compiledSteps={compiledSteps}
							steps={steps}
						/>
					</div>
				</div>
			</motion.section>
		</ScrollyProvider>
	);
}
