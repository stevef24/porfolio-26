"use client";

/**
 * CodeCanvas - Standalone code viewer for CanvasZone integration
 *
 * A simplified version of ScrollyStage that doesn't require ScrollyContext.
 * Perfect for CanvasZone usage where the active step is controlled externally.
 *
 * @example
 * ```tsx
 * <CanvasZone
 *   id="intro"
 *   canvasContent={<CodeCanvas compiledSteps={compiled} steps={steps} activeStep={0} />}
 * >
 *   ...
 * </CanvasZone>
 * ```
 */

import { useMemo, useState, useCallback, memo, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ShikiMagicMoveRenderer } from "shiki-magic-move/react";
import { syncTokenKeys, toKeyedTokens } from "shiki-magic-move/core";
import type {
	KeyedTokensInfo,
	MagicMoveDifferOptions,
	MagicMoveRenderOptions,
} from "shiki-magic-move/types";
import { cn } from "@/lib/utils";
import { extractTokensForPrecompiled, type CompilationResult } from "@/lib/scrolly/utils";
import { deriveFilename, SCROLLY_DEFAULTS } from "@/lib/scrolly/types";
import { springGentle } from "@/lib/motion-variants";
import { StageControls } from "./StageControls";
import { StageFullscreen } from "./StageFullscreen";
import type { ScrollyCodeStep } from "@/lib/scrolly/types";

interface CodeCanvasProps {
	/** Compiled tokens from server-side compilation */
	compiledSteps: CompilationResult;
	/** Original steps for metadata (focusLines, file) */
	steps: ScrollyCodeStep[];
	/** Current active step index (0-based) */
	activeStep: number;
	/** Show canvas controls toolbar (default: true) */
	showControls?: boolean;
	/** Show copy link button in controls (default: false) */
	showCopyLink?: boolean;
	/** Additional CSS classes */
	className?: string;
}

type MagicMoveOptions = MagicMoveRenderOptions & MagicMoveDifferOptions;

const EMPTY_TOKENS = toKeyedTokens("", []);

/**
 * De-duplicate token keys to prevent React key conflicts.
 */
const dedupeTokenKeys = (tokensInfo: KeyedTokensInfo): KeyedTokensInfo => {
	const seen = new Map<string, number>();
	let hasDuplicates = false;

	const dedupedTokens = tokensInfo.tokens.map((token) => {
		const count = seen.get(token.key) ?? 0;
		seen.set(token.key, count + 1);

		if (count === 0) return token;

		hasDuplicates = true;
		return { ...token, key: `${token.key}-${count}` };
	});

	return hasDuplicates ? { ...tokensInfo, tokens: dedupedTokens } : tokensInfo;
};

/**
 * Magic Move renderer using precompiled tokens.
 */
function CodeMagicMoveRenderer({
	steps,
	step = 0,
	animate = true,
	options,
	onStart,
	onEnd,
}: {
	steps: KeyedTokensInfo[];
	step?: number;
	animate?: boolean;
	options?: MagicMoveOptions;
	onStart?: () => void;
	onEnd?: () => void;
}) {
	const previousRef = useRef<KeyedTokensInfo>(EMPTY_TOKENS);

	const result = useMemo(() => {
		const current = steps[Math.min(step, steps.length - 1)];
		const synced = syncTokenKeys(previousRef.current, current, options);
		const from = dedupeTokenKeys(synced.from);
		const to = dedupeTokenKeys(synced.to);
		previousRef.current = to;
		return { from, to };
	}, [steps, step, options]);

	return (
		<ShikiMagicMoveRenderer
			tokens={result.to}
			previous={result.from}
			options={options}
			animate={animate}
			onStart={onStart}
			onEnd={onEnd}
		/>
	);
}

/**
 * Standalone code canvas with Magic Move animations.
 *
 * Features:
 * - Animated code transitions between steps
 * - Dual-theme support via CSS variables (no JS theme switching)
 * - Filename badge display
 * - Focus line highlighting
 * - Copy to clipboard button
 * - Fullscreen mode
 * - Reduced motion support
 */
export function CodeCanvas({
	compiledSteps,
	steps,
	activeStep,
	showControls = true,
	showCopyLink = false,
	className,
}: CodeCanvasProps) {
	const prefersReducedMotion = useReducedMotion();
	const [isAnimating, setIsAnimating] = useState(false);
	const [copied, setCopied] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Clamp activeStep to valid range
	const clampedStep = Math.max(0, Math.min(activeStep, steps.length - 1));
	const currentStep = steps[clampedStep];

	// Extract tokens for Magic Move (dual-theme - CSS handles theme switching)
	const magicMoveSteps = useMemo(() => {
		return extractTokensForPrecompiled(compiledSteps.steps);
	}, [compiledSteps]);

	// Derive filename from step or lang
	const filename = currentStep ? deriveFilename(currentStep) : "";

	// Animation callbacks
	const handleAnimationStart = useCallback(() => {
		setIsAnimating(true);
	}, []);

	const handleAnimationEnd = useCallback(() => {
		setIsAnimating(false);
	}, []);

	// Copy code to clipboard
	const handleCopyCode = useCallback(async () => {
		if (!currentStep) return;
		try {
			await navigator.clipboard.writeText(currentStep.code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Silently fail
		}
	}, [currentStep]);

	// Copy link to current step
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

	// Focus lines for current step
	const focusLines = useMemo(() => {
		return currentStep?.focusLines || [];
	}, [currentStep]);

	// Check for compilation errors
	const hasErrors = compiledSteps.errors.length > 0;

	if (hasErrors && magicMoveSteps.length === 0) {
		return (
			<div
				className={cn(
					"h-full w-full rounded-3xl",
					"bg-[#f1eee5] dark:bg-[#1a1a17]",
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
		<>
			<motion.div
				className={cn(
					"relative h-full w-full flex flex-col",
					"rounded-3xl overflow-hidden",
					"bg-[#f1eee5] dark:bg-[#1a1a17]",
					className
				)}
				role="region"
				aria-label={`Code example: ${filename || "code"}`}
				initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={prefersReducedMotion ? { duration: 0 } : springGentle}
			>
				{/* Floating toolbar */}
				{showControls && (
					<div className="absolute top-4 right-4 z-10 flex items-center gap-2">
						{/* Filename badge */}
						{filename && (
							<span
								className={cn(
									"text-swiss-label px-2.5 py-1",
									"rounded-full",
									"bg-[#19170f]/90 dark:bg-[#f8f6ef]/10",
									"text-[#f8f6ef]/80 dark:text-[#f8f6ef]/70",
									"backdrop-blur-sm",
									"transition-opacity duration-200",
									isAnimating && "opacity-60"
								)}
							>
								{filename}
							</span>
						)}
						{copied && (
							<span className="text-swiss-caption text-primary animate-in fade-in">
								Copied!
							</span>
						)}
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
					</div>
				)}

				{/* Code container */}
				<div
					className={cn(
						"code-canvas-code flex-1 overflow-x-auto overflow-y-auto",
						"px-5 py-6",
						"font-mono text-sm leading-relaxed",
						focusLines.length > 0 && "has-focus-lines"
					)}
					data-focus-lines={focusLines.join(",")}
				>
					<CodeMagicMoveRenderer
						steps={magicMoveSteps}
						step={clampedStep}
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

				{/* Focus line highlighting */}
				{focusLines.length > 0 && (
					<FocusLineHighlights
						focusLines={focusLines}
						isAnimating={isAnimating}
					/>
				)}
			</motion.div>

			{/* Fullscreen modal */}
			<StageFullscreen isOpen={isFullscreen} onClose={handleToggleFullscreen}>
				<div className="relative flex flex-col h-full">
					<div className="absolute top-4 right-4 z-10 flex items-center gap-2">
						{filename && (
							<span
								className={cn(
									"text-swiss-label px-2.5 py-1",
									"rounded-full",
									"bg-[#19170f]/90 dark:bg-[#f8f6ef]/10",
									"text-[#f8f6ef]/80 dark:text-[#f8f6ef]/70",
									"transition-opacity duration-200",
									isAnimating && "opacity-60"
								)}
							>
								{filename}
							</span>
						)}
						{copied && (
							<span className="text-swiss-caption text-primary animate-in fade-in">
								Copied!
							</span>
						)}
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

					<div
						className={cn(
							"code-canvas-code flex-1 overflow-auto",
							"px-8 py-12",
							"font-mono text-base leading-relaxed",
							focusLines.length > 0 && "has-focus-lines"
						)}
						data-focus-lines={focusLines.join(",")}
					>
						<CodeMagicMoveRenderer
							steps={magicMoveSteps}
							step={clampedStep}
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

// CSS spring for focus line transitions
const FOCUS_LINE_SPRING =
	"350ms linear(0, 0.3566, 0.7963, 1.0045, 1.0459, 1.0287, 1.0088, 0.9996, 1, 0.9987, 0.9996, 1)";

/**
 * Generate focus line CSS styles for CodeCanvas.
 */
function generateFocusLineStyles(
	focusLines: number[],
	isAnimating: boolean
): string {
	const highlightStyles = focusLines
		.map(
			(line) => `
		.code-canvas-code.has-focus-lines .shiki-magic-move-line:nth-child(${line}) {
			background: rgba(86, 98, 64, 0.12);
			margin-left: -1rem;
			margin-right: -1rem;
			padding-left: calc(1rem - 2px);
			padding-right: 1rem;
			border-left: 2px solid #566240;
		}
		.dark .code-canvas-code.has-focus-lines .shiki-magic-move-line:nth-child(${line}) {
			background: rgba(111, 124, 90, 0.15);
			border-left-color: #6f7c5a;
		}
	`
		)
		.join("\n");

	const opacityOverrides = focusLines
		.map(
			(line) => `
		.code-canvas-code.has-focus-lines .shiki-magic-move-line:nth-child(${line}) {
			opacity: 1;
		}
	`
		)
		.join("\n");

	return `
		.code-canvas-code.has-focus-lines .shiki-magic-move-line {
			transition: background-color ${FOCUS_LINE_SPRING},
			            opacity ${FOCUS_LINE_SPRING},
			            padding ${FOCUS_LINE_SPRING},
			            margin ${FOCUS_LINE_SPRING};
		}
		${highlightStyles}
		.code-canvas-code.has-focus-lines .shiki-magic-move-line {
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
	const styles = useMemo(
		() => generateFocusLineStyles(focusLines, isAnimating),
		[focusLines, isAnimating]
	);

	return <style>{styles}</style>;
});
