"use client";

/**
 * ScrollyCoding - Main container for scrollytelling code walkthroughs
 *
 * Two-column layout:
 * - Left column: Scrollable step cards
 * - Right column: Sticky code stage (placeholder for Phase 4)
 *
 * On mobile (<768px), falls back to single-column stacked layout.
 */

import { cn } from "@/lib/utils";
import { ScrollyProvider, useScrollyContext } from "./ScrollyContext";
import { ScrollyStep } from "./ScrollyStep";
import { SCROLLY_DEFAULTS } from "@/lib/scrolly/types";
import type { ScrollyCodingProps } from "@/lib/scrolly/types";
import type { CompilationResult } from "@/lib/scrolly/compile-steps";

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
			<div
				className={cn(
					// Base layout
					"relative w-full",
					// Two-column grid on desktop
					"md:grid md:grid-cols-2 md:gap-8",
					// Single column on mobile
					"flex flex-col",
					className
				)}
			>
				{/* Steps Column (left on desktop) */}
				<div className="relative md:order-1">
					<div className="space-y-0">
						{steps.map((step, index) => (
							<ScrollyStep
								key={step.id}
								index={index}
								step={step}
							/>
						))}
					</div>

					{/* Bottom padding to allow last step to reach center */}
					<div className="h-[40vh]" aria-hidden="true" />
				</div>

				{/* Stage Column (right on desktop, sticky) */}
				<div
					className={cn(
						// Mobile: hidden for now (Phase 7 will add mobile fallback)
						"hidden md:block",
						// Desktop: sticky positioning
						"md:order-2"
					)}
				>
					<div
						className="sticky"
						style={{
							top: stageConfig.stickyTop,
							height: `calc(100vh - ${stageConfig.stickyTop + 40}px)`,
						}}
					>
						{/* Stage placeholder - Phase 4 will add ScrollyStage */}
						<StagePlaceholder compiledSteps={compiledSteps} />
					</div>
				</div>
			</div>
		</ScrollyProvider>
	);
}

/**
 * Temporary stage placeholder.
 * Phase 4 will replace this with ScrollyStage component.
 */
function StagePlaceholder({
	compiledSteps,
}: {
	compiledSteps: CompilationResult;
}) {
	const { activeIndex, totalSteps } = useScrollyContext();

	return (
		<div
			className={cn(
				"h-full w-full rounded-md",
				"bg-card border border-border",
				"flex flex-col items-center justify-center",
				"text-muted-foreground"
			)}
		>
			<div className="text-swiss-label mb-2">Stage Placeholder</div>
			<div className="text-swiss-caption">
				Step {activeIndex + 1} of {totalSteps}
			</div>
			{compiledSteps.errors.length > 0 && (
				<div className="mt-4 text-destructive text-xs">
					{compiledSteps.errors.length} compilation error(s)
				</div>
			)}
		</div>
	);
}
