"use client";

/**
 * ScrollyCoding - Main container for scrollytelling code walkthroughs
 *
 * Layout behavior:
 * - Normal state: Blog content centered (single-column article layout)
 * - Enter scrolly: Canvas slides in from right, content compresses to left
 * - Active state: Two-column layout with fixed canvas drawer
 * - Exit scrolly: Canvas slides out, content returns to center
 *
 * On mobile/tablet (<1024px), shows inline code after each step (no drawer animation).
 */

import { useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollyProvider } from "./ScrollyContext";
import {
	ScrollyDrawerProvider,
	useScrollyDrawer,
} from "./ScrollyDrawerContext";
import { ScrollyStep } from "./ScrollyStep";
import { ScrollyStage } from "./ScrollyStage";
import { ScrollyStageMobile } from "./ScrollyStageMobile";
import { ScrollyLiveRegion } from "./ScrollyLiveRegion";
import { springScrollySplit } from "@/lib/motion-variants";
import type { ScrollyCodingProps } from "@/lib/scrolly/types";
import type { CompilationResult } from "@/lib/scrolly/utils";

interface ScrollyCodingComponentProps extends Omit<
	ScrollyCodingProps,
	"compiledSteps"
> {
	/** Compiled tokens from server-side compilation */
	compiledSteps: CompilationResult;
}

/**
 * Inner component that consumes drawer context.
 * Separated to allow context to be provided at the right level.
 */
function ScrollyCodingInner({
	steps,
	compiledSteps,
	className,
}: ScrollyCodingComponentProps) {
	const { isDrawerOpen, openDrawer, closeDrawer } = useScrollyDrawer();
	const prefersReducedMotion = useReducedMotion();
	const isMobile = useIsMobile();
	const isDesktopDrawerLayout = !isMobile;

	// Ref for the entire scrolly section
	const sectionRef = useRef<HTMLElement>(null);
	// Ref for just the steps container (excludes top/bottom padding zones)
	// This is what we track for drawer open/close triggers
	const stepsContainerRef = useRef<HTMLDivElement>(null);

	// Track when steps are in view (not the padding zones)
	// Negative margin = steps must be MORE into viewport to trigger
	// -45% from top and bottom means steps must be nearly centered before triggering
	// This ensures intro content ("The Core Pattern") is scrolled away before drawer opens
	const isStepsInView = useInView(stepsContainerRef, {
		margin: "-45% 0px -45% 0px",
	});

	// Manage drawer state based on scroll position
	useEffect(() => {
		if (!isDesktopDrawerLayout) {
			if (isDrawerOpen) {
				closeDrawer();
			}
			return;
		}

		if (isStepsInView && !isDrawerOpen) {
			openDrawer();
		}
		if (!isStepsInView && isDrawerOpen) {
			closeDrawer();
		}
	}, [isDesktopDrawerLayout, isStepsInView, isDrawerOpen, openDrawer, closeDrawer]);

	const contentWrapperWidth = isDesktopDrawerLayout
		? isDrawerOpen
			? "50vw"
			: "100vw"
		: "100%";

	return (
		<motion.section
			ref={sectionRef}
			className={cn(
				isDesktopDrawerLayout
					? "relative flex w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden"
					: "relative flex w-full overflow-x-hidden",
				className
			)}
			aria-label="Interactive code walkthrough"
			aria-roledescription="code walkthrough"
		>
			{/* Screen reader announcements */}
			<ScrollyLiveRegion steps={steps} />

			{/* Left: Blog Content Wrapper - Slides left/right based on drawer state */}
			<motion.div
				layout
				className="flex-shrink-0 w-full flex justify-center"
				animate={{
					width: contentWrapperWidth,
				}}
				transition={prefersReducedMotion ? { duration: 0 } : springScrollySplit}
				style={{
					willChange:
						isDesktopDrawerLayout && isDrawerOpen ? "width" : "auto",
				}}
			>
				{/* Content Lock - fixed width prevents text reflow during animation */}
				<div
					className={cn(
						"w-[680px] max-w-full px-4 md:px-6",
						"mx-auto"
					)}
				>
					{/* Top padding - gives intro content room before drawer opens */}
					<div className="hidden lg:block h-[15vh]" aria-hidden="true" />

					{/* Steps container - THIS is what we track for drawer triggers */}
					<div
						ref={stepsContainerRef}
						className="space-y-0"
						role="list"
						aria-label="Walkthrough steps"
					>
						{steps.map((step, index) => (
							<div key={step.id} role="listitem">
								<ScrollyStep
									index={index}
									step={step}
									totalSteps={steps.length}
								/>
								{/* Mobile/Tablet: Inline code stage after each step */}
								<div className="lg:hidden pb-6">
									<ScrollyStageMobile
										compiledSteps={compiledSteps}
										step={step}
										stepIndex={index}
									/>
								</div>
							</div>
						))}
					</div>

					{/* Bottom padding - lets last step reach viewport center */}
					<div className="hidden lg:block h-[30vh]" aria-hidden="true" />
				</div>
			</motion.div>

			{/* Right: Drawer Wrapper - Slides in from right */}
			{isDesktopDrawerLayout && (
				<motion.div
					className={cn(
						// Hidden on mobile/tablet
						"hidden lg:block",
						// Fixed position relative to viewport
						"fixed right-0 top-0 h-screen w-[50vw]",
						// Padding for visual breathing room
						"p-2",
						// Above content but below modals
						"z-30",
						// Code font for the drawer
						"font-mono"
					)}
					initial={{ x: "100%" }}
					animate={{ x: isDrawerOpen ? "0%" : "100%" }}
					transition={prefersReducedMotion ? { duration: 0 } : springScrollySplit}
				>
					<ScrollyStage compiledSteps={compiledSteps} steps={steps} />
				</motion.div>
			)}
		</motion.section>
	);
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
export function ScrollyCoding(props: ScrollyCodingComponentProps) {
	return (
		<ScrollyDrawerProvider>
			<ScrollyProvider totalSteps={props.steps.length}>
				<ScrollyCodingInner {...props} />
			</ScrollyProvider>
		</ScrollyDrawerProvider>
	);
}
