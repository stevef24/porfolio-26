"use client";

/**
 * ScrollyStage - Code stage with Shiki Magic Move animations
 *
 * Renders precompiled Magic Move tokens with smooth transitions between steps.
 * Supports theme switching (light/dark) and focus line highlighting.
 */

import { useMemo, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "motion/react";
import { ShikiMagicMovePrecompiled } from "shiki-magic-move/react";
import { cn } from "@/lib/utils";
import { useScrollyContext } from "./ScrollyContext";
import { getTokensForTheme } from "@/lib/scrolly/compile-steps";
import { deriveFilename, SCROLLY_DEFAULTS } from "@/lib/scrolly/types";
import type { CompilationResult } from "@/lib/scrolly/compile-steps";
import type { ScrollyCodeStep } from "@/lib/scrolly/types";

interface ScrollyStageProps {
	/** Compiled tokens from server-side compilation */
	compiledSteps: CompilationResult;
	/** Original steps for metadata (focusLines, file) */
	steps: ScrollyCodeStep[];
	/** Additional CSS classes */
	className?: string;
}

/**
 * Code stage component with Magic Move animations.
 *
 * Features:
 * - Animated code transitions between steps
 * - Theme-aware rendering (light/dark)
 * - Filename badge display
 * - Focus line highlighting
 * - Reduced motion support
 */
export function ScrollyStage({
	compiledSteps,
	steps,
	className,
}: ScrollyStageProps) {
	const { activeIndex } = useScrollyContext();
	const { resolvedTheme } = useTheme();
	const prefersReducedMotion = useReducedMotion();
	const [isAnimating, setIsAnimating] = useState(false);

	// Get current step metadata
	const currentStep = steps[activeIndex];

	// Select tokens based on current theme (steps prop for ShikiMagicMovePrecompiled)
	const magicMoveSteps = useMemo(() => {
		const theme = resolvedTheme === "dark" ? "dark" : "light";
		return getTokensForTheme(compiledSteps, theme);
	}, [compiledSteps, resolvedTheme]);

	// Derive filename from step or lang
	const filename = currentStep ? deriveFilename(currentStep) : "";

	// Animation callbacks
	const handleAnimationStart = useCallback(() => {
		setIsAnimating(true);
	}, []);

	const handleAnimationEnd = useCallback(() => {
		setIsAnimating(false);
	}, []);

	// Get focus lines for current step (1-based line numbers)
	const focusLines = useMemo(() => {
		return currentStep?.focusLines || [];
	}, [currentStep]);

	// Check if compilation has errors
	const hasErrors = compiledSteps.errors.length > 0;

	if (hasErrors && magicMoveSteps.length === 0) {
		return (
			<div
				className={cn(
					"h-full w-full rounded-md",
					"bg-card border border-border",
					"flex flex-col items-center justify-center",
					"text-muted-foreground",
					className
				)}
			>
				<div className="text-swiss-label mb-2">Compilation Error</div>
				<div className="text-swiss-caption text-destructive">
					{compiledSteps.errors[0]?.message || "Failed to compile code"}
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"relative h-full w-full",
				"rounded-md border border-border bg-card",
				"overflow-hidden",
				className
			)}
		>
			{/* Filename badge - top right */}
			{filename && (
				<div
					className={cn(
						"absolute top-3 right-3 z-10",
						"px-2 py-1 rounded",
						"bg-muted/80 backdrop-blur-sm",
						"text-swiss-label",
						"transition-opacity duration-200",
						isAnimating && "opacity-50"
					)}
				>
					{filename}
				</div>
			)}

			{/* Code container with Magic Move */}
			<div
				className={cn(
					"scrolly-stage-code h-full w-full overflow-auto p-4 pt-12",
					"font-mono text-sm leading-relaxed",
					focusLines.length > 0 && "has-focus-lines"
				)}
				data-focus-lines={focusLines.join(",")}
			>
				<ShikiMagicMovePrecompiled
					steps={magicMoveSteps}
					step={activeIndex}
					animate={!prefersReducedMotion}
					options={{
						duration: prefersReducedMotion
							? 0
							: SCROLLY_DEFAULTS.magicMove.duration,
						stagger: prefersReducedMotion
							? 0
							: SCROLLY_DEFAULTS.magicMove.stagger,
					}}
					onStart={handleAnimationStart}
					onEnd={handleAnimationEnd}
				/>
			</div>

			{/* Focus line highlighting styles */}
			{focusLines.length > 0 && (
				<FocusLineHighlights
					focusLines={focusLines}
					isAnimating={isAnimating}
				/>
			)}
		</div>
	);
}

/**
 * Focus line highlights overlay.
 * Renders subtle highlight bands for focused lines.
 *
 * Note: This is a visual enhancement. The actual line highlighting
 * is also handled via CSS targeting the shiki-magic-move line elements.
 */
function FocusLineHighlights({
	focusLines,
	isAnimating,
}: {
	focusLines: number[];
	isAnimating: boolean;
}) {
	// We use CSS-based highlighting rather than absolute positioning
	// since Magic Move's output structure may vary.
	// This component serves as a marker for future enhancements.
	return (
		<style>{`
			/* Focus line highlighting for Shiki Magic Move */
			.scrolly-magic-move.has-focus-lines .shiki-magic-move-line {
				transition: background-color 0.2s ease;
			}

			/* Highlight specific lines based on data-line attribute */
			${focusLines
				.map(
					(line) => `
				.scrolly-magic-move.has-focus-lines .shiki-magic-move-line:nth-child(${line}) {
					background: var(--muted);
					margin-left: -1rem;
					margin-right: -1rem;
					padding-left: 1rem;
					padding-right: 1rem;
					border-left: 2px solid var(--foreground);
				}
			`
				)
				.join("\n")}

			/* Dim non-focused lines when focus lines exist */
			.scrolly-magic-move.has-focus-lines .shiki-magic-move-line {
				opacity: ${isAnimating ? 1 : 0.5};
			}

			${focusLines
				.map(
					(line) => `
				.scrolly-magic-move.has-focus-lines .shiki-magic-move-line:nth-child(${line}) {
					opacity: 1;
				}
			`
				)
				.join("\n")}
		`}</style>
	);
}
