"use client";

/**
 * ScrollyStage - Code stage with Shiki Magic Move animations
 *
 * Renders precompiled Magic Move tokens with smooth transitions between steps.
 * Supports theme switching (light/dark) and focus line highlighting.
 * Features entrance animation with spring physics.
 * Includes canvas controls (fullscreen, copy, refresh) with ItsHover animated icons.
 */

import { useMemo, useState, useCallback, memo, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "motion/react";
import { ShikiMagicMovePrecompiled } from "shiki-magic-move/react";
import { cn } from "@/lib/utils";
import { useScrollyContext } from "./ScrollyContext";
import { getTokensForTheme, type CompilationResult } from "@/lib/scrolly/utils";
import { deriveFilename, SCROLLY_DEFAULTS } from "@/lib/scrolly/types";
import { springGentle } from "@/lib/motion-variants";
import { StageControls } from "./StageControls";
import { StageFullscreen } from "./StageFullscreen";
import type { ScrollyCodeStep } from "@/lib/scrolly/types";

interface ScrollyStageProps {
	/** Compiled tokens from server-side compilation */
	compiledSteps: CompilationResult;
	/** Original steps for metadata (focusLines, file) */
	steps: ScrollyCodeStep[];
	/** Show canvas controls toolbar (default: true) */
	showControls?: boolean;
	/** Show copy link button in controls (default: true) */
	showCopyLink?: boolean;
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
 * - Copy to clipboard button
 * - Reduced motion support
 */
export function ScrollyStage({
	compiledSteps,
	steps,
	showControls = true,
	showCopyLink = true,
	className,
}: ScrollyStageProps) {
	const { activeIndex } = useScrollyContext();
	const { resolvedTheme } = useTheme();
	const prefersReducedMotion = useReducedMotion();
	const [isAnimating, setIsAnimating] = useState(false);
	const [copied, setCopied] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Hydration fix: only render theme-dependent content after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	// Get current step metadata
	const currentStep = steps[activeIndex];

	// Select tokens based on current theme (steps prop for ShikiMagicMovePrecompiled)
	// Use dark as default for SSR to avoid hydration mismatch, switch after mount
	const magicMoveSteps = useMemo(() => {
		const theme = mounted && resolvedTheme === "light" ? "light" : "dark";
		return getTokensForTheme(compiledSteps, theme);
	}, [compiledSteps, resolvedTheme, mounted]);

	// Derive filename from step or lang
	const filename = currentStep ? deriveFilename(currentStep) : "";

	// Animation callbacks
	const handleAnimationStart = useCallback(() => {
		setIsAnimating(true);
	}, []);

	const handleAnimationEnd = useCallback(() => {
		setIsAnimating(false);
	}, []);

	// Copy code to clipboard handler
	const handleCopyCode = useCallback(async () => {
		if (!currentStep) return;
		try {
			await navigator.clipboard.writeText(currentStep.code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Silently fail - clipboard API may not be available
		}
	}, [currentStep]);

	// Copy link to current step (URL hash)
	const handleCopyLink = useCallback(async () => {
		if (!currentStep) return;
		try {
			const url = new URL(window.location.href);
			url.hash = `step-${currentStep.id}`;
			await navigator.clipboard.writeText(url.toString());
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Silently fail
		}
	}, [currentStep]);

	// Fullscreen toggle
	const handleToggleFullscreen = useCallback(() => {
		setIsFullscreen((prev) => !prev);
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

	const { scrollyId } = useScrollyContext();

	return (
		<>
		<motion.div
			id={`${scrollyId}-stage`}
			className={cn(
				"relative h-full w-full flex flex-col",
				"rounded-md border border-border bg-card",
				"overflow-hidden",
				className
			)}
			role="region"
			aria-label={`Code example: ${filename || "code"}`}
			aria-live="polite"
			// Entrance animation with spring physics
			initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={prefersReducedMotion ? { duration: 0 } : springGentle}
		>
			{/* Header bar with filename and canvas controls */}
			<div
				className={cn(
					"flex items-center justify-between px-3 py-2",
					"border-b border-border bg-muted/30",
					"transition-opacity duration-200",
					isAnimating && "opacity-70"
				)}
			>
				<div className="flex items-center gap-2">
					{filename && (
						<span className="text-swiss-label text-muted-foreground">
							{filename}
						</span>
					)}
					{copied && (
						<span className="text-swiss-caption text-primary animate-in fade-in">
							Copied!
						</span>
					)}
				</div>
				{showControls && (
					<StageControls
						viewMode="rendered"
						isFullscreen={isFullscreen}
						showSourceToggle={false}
						showRefresh={false}
						showLink={showCopyLink}
						showCopy={true}
						onToggleFullscreen={handleToggleFullscreen}
						onCopyLink={handleCopyLink}
						onCopyCode={handleCopyCode}
					/>
				)}
			</div>

			{/* Code container with Magic Move - scrollable area */}
			<div
				className={cn(
					"scrolly-stage-code flex-1 overflow-x-auto overflow-y-auto p-4",
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
		</motion.div>

		{/* Fullscreen modal portal */}
		<StageFullscreen isOpen={isFullscreen} onClose={handleToggleFullscreen}>
			<div className="flex flex-col h-full">
				{/* Fullscreen header */}
				<div
					className={cn(
						"flex items-center justify-between px-4 py-3",
						"border-b border-border bg-muted/30"
					)}
				>
					<div className="flex items-center gap-2">
						{filename && (
							<span className="text-swiss-label text-muted-foreground">
								{filename}
							</span>
						)}
						{copied && (
							<span className="text-swiss-caption text-primary animate-in fade-in">
								Copied!
							</span>
						)}
					</div>
					<StageControls
						viewMode="rendered"
						isFullscreen={true}
						showSourceToggle={false}
						showRefresh={false}
						showLink={showCopyLink}
						showCopy={true}
						onToggleFullscreen={handleToggleFullscreen}
						onCopyLink={handleCopyLink}
						onCopyCode={handleCopyCode}
					/>
				</div>

				{/* Fullscreen code container */}
				<div
					className={cn(
						"scrolly-stage-code flex-1 overflow-auto p-6",
						"font-mono text-base leading-relaxed",
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

				{/* Focus line styles for fullscreen */}
				{focusLines.length > 0 && (
					<FocusLineHighlights
						focusLines={focusLines}
						isAnimating={isAnimating}
					/>
				)}
			</div>
		</StageFullscreen>
		</>
	);
}

/**
 * Focus line highlights overlay.
 * Renders subtle highlight bands for focused lines.
 *
 * Note: This is a visual enhancement. The actual line highlighting
 * is also handled via CSS targeting the shiki-magic-move line elements.
 */
// CSS spring easing for focus line transitions (matches springGentle feel)
const FOCUS_LINE_SPRING = "350ms linear(0, 0.3566, 0.7963, 1.0045, 1.0459, 1.0287, 1.0088, 0.9996, 1, 0.9987, 0.9996, 1)";

/**
 * Generate focus line CSS styles.
 * Memoized via useMemo in the component to avoid recalculating on every render.
 *
 * Uses lime green accent for highlighting (matches site theme).
 */
function generateFocusLineStyles(focusLines: number[], isAnimating: boolean): string {
	const highlightStyles = focusLines
		.map(
			(line) => `
		.scrolly-stage-code.has-focus-lines .shiki-magic-move-line:nth-child(${line}) {
			background: oklch(0.95 0.15 125 / 30%); /* Lime green tint */
			margin-left: -1rem;
			margin-right: -1rem;
			padding-left: calc(1rem - 2px);
			padding-right: 1rem;
			border-left: 2px solid oklch(0.65 0.2 125); /* Lime green indicator */
		}
		/* Dark mode override */
		.dark .scrolly-stage-code.has-focus-lines .shiki-magic-move-line:nth-child(${line}) {
			background: oklch(0.3 0.1 125 / 30%);
			border-left-color: oklch(0.75 0.2 125);
		}
	`
		)
		.join("\n");

	const opacityOverrides = focusLines
		.map(
			(line) => `
		.scrolly-stage-code.has-focus-lines .shiki-magic-move-line:nth-child(${line}) {
			opacity: 1;
		}
	`
		)
		.join("\n");

	return `
		/* Focus line highlighting for Shiki Magic Move with spring physics */
		.scrolly-stage-code.has-focus-lines .shiki-magic-move-line {
			transition: background-color ${FOCUS_LINE_SPRING},
			            opacity ${FOCUS_LINE_SPRING},
			            padding ${FOCUS_LINE_SPRING},
			            margin ${FOCUS_LINE_SPRING};
		}

		/* Highlight specific lines - warm peachy (Devouring Details style) */
		${highlightStyles}

		/* Dim non-focused lines when focus lines exist */
		.scrolly-stage-code.has-focus-lines .shiki-magic-move-line {
			opacity: ${isAnimating ? 1 : 0.5};
		}

		${opacityOverrides}
	`;
}

const FocusLineHighlights = memo(function FocusLineHighlights({
	focusLines,
	isAnimating,
}: {
	focusLines: number[];
	isAnimating: boolean;
}) {
	// Memoize the generated CSS to avoid recalculating on unrelated re-renders
	const styles = useMemo(
		() => generateFocusLineStyles(focusLines, isAnimating),
		[focusLines, isAnimating]
	);

	return <style>{styles}</style>;
});
