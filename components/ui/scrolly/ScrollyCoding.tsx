"use client";

/**
 * ScrollyCoding - Main container for scrollytelling code walkthroughs
 *
 * Two-column layout:
 * - Left column: Scrollable step cards
 * - Right column: Sticky code stage with Shiki Magic Move
 *
 * On mobile (<768px), shows inline code after each step (no animation).
 */

import { cn } from "@/lib/utils";
import { ScrollyProvider } from "./ScrollyContext";
import { ScrollyStep } from "./ScrollyStep";
import { ScrollyStage } from "./ScrollyStage";
import { ScrollyStageMobile } from "./ScrollyStageMobile";
import { ScrollyLiveRegion } from "./ScrollyLiveRegion";
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

	return (
		<ScrollyProvider totalSteps={steps.length}>
			{/* Full-bleed wrapper - breaks out of article container */}
			<section
				className={cn(
					// Full-bleed: expand to viewport width
					"relative w-screen",
					// Center and break out of parent container
					"left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]",
					// Two-column grid on desktop (45/55 split for more code space)
					"md:grid md:grid-cols-[45fr_55fr]",
					// Single column on mobile
					"flex flex-col",
					className
				)}
				aria-label="Interactive code walkthrough"
				aria-roledescription="code walkthrough"
			>
				{/* Screen reader announcements */}
				<ScrollyLiveRegion steps={steps} />

				{/* Steps Column (left on desktop) */}
				<div
					className="relative md:order-1 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] md:pr-8"
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
								<div className="md:hidden px-4 pb-6">
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
					<div className="hidden md:block h-[40vh]" aria-hidden="true" />
				</div>

				{/* Stage Column (right on desktop, sticky) - with subtle background */}
				<div
					className={cn(
						// Mobile: hidden (inline stages shown instead)
						"hidden md:block",
						// Desktop: sticky positioning
						"md:order-2",
						// Subtle background like Devouring Details
						"bg-muted/30"
					)}
				>
					<div
						className="sticky px-8 py-6"
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
			</section>
		</ScrollyProvider>
	);
}
