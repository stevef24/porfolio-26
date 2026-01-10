"use client";

/**
 * ScrollyStageMobile - Compact inline code stage for mobile layouts
 *
 * Shows static code for a single step. No Magic Move animation - just
 * prerendered highlighted code with theme support.
 *
 * Features expandable drawer for full-screen code viewing.
 */

import { useMemo, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion-variants";
import { deriveFilename } from "@/lib/scrolly/types";
import { CodeDrawer } from "./CodeDrawer";
import ExpandIcon from "@/components/ui/expand-icon";
import CopyIcon from "@/components/ui/copy-icon";
import type { CompilationResult } from "@/lib/scrolly/utils";
import type { ScrollyCodeStep } from "@/lib/scrolly/types";

interface ScrollyStageMobileProps {
	/** Compiled tokens from server-side compilation */
	compiledSteps: CompilationResult;
	/** The specific step to display */
	step: ScrollyCodeStep;
	/** Index of this step */
	stepIndex: number;
	/** Additional CSS classes */
	className?: string;
}

/**
 * Mobile-optimized code stage.
 *
 * Features:
 * - Static code display (no animation overhead)
 * - Theme-aware rendering
 * - Filename badge
 * - Copy to clipboard button
 * - Focus line highlighting
 */
export function ScrollyStageMobile({
	compiledSteps,
	step,
	stepIndex,
	className,
}: ScrollyStageMobileProps) {
	const [copied, setCopied] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const prefersReducedMotion = useReducedMotion();

	// Prevent hydration mismatch - only render theme-dependent content after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	// Get tokens for current step (dual-theme tokens - CSS handles theme switching)
	const tokensInfo = useMemo(() => {
		if (!mounted) return null;
		return compiledSteps.steps[stepIndex]?.tokens ?? null;
	}, [compiledSteps, stepIndex, mounted]);

	// Split flat tokens array into lines for rendering
	const lines = useMemo(() => {
		if (!tokensInfo) return [];

		const result: Array<Array<{ content: string; color?: string; key: string }>> = [[]];

		for (const token of tokensInfo.tokens) {
			// Handle tokens that contain newlines
			const parts = token.content.split("\n");
			parts.forEach((part: string, i: number) => {
				if (i > 0) {
					// Start a new line
					result.push([]);
				}
				if (part) {
					result[result.length - 1].push({
						content: part,
						color: token.color,
						key: `${token.key}-${i}`,
					});
				}
			});
		}

		return result;
	}, [tokensInfo]);

	// Derive filename
	const filename = deriveFilename(step);

	// Focus lines for this step
	const focusLines = step.focusLines || [];

	// Copy handler
	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(step.code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Silently fail - clipboard API may not be available
		}
	}, [step.code]);

	// Check for compilation errors
	if (!tokensInfo) {
		return (
			<div
				className={cn(
					"rounded-md border border-border bg-card p-4",
					"text-swiss-caption text-muted-foreground",
					className
				)}
			>
				Failed to compile code
			</div>
		);
	}

	return (
		<div
			className={cn(
				"relative bg-card",
				// Full-width, no border for cleaner mobile look
				"-mx-4 rounded-none",
				className
			)}
		>
			{/* Header bar with filename and icon actions */}
			<div className="flex items-center justify-between px-4 py-1.5 border-y border-border bg-muted/30">
				{filename && (
					<span className="text-swiss-label text-muted-foreground">
						{filename}
					</span>
				)}
				<div className="flex items-center gap-0.5">
					{/* Expand button - 44px touch target */}
					<motion.button
						type="button"
						onClick={() => setIsDrawerOpen(true)}
						className={cn(
							"w-11 h-11 flex items-center justify-center",
							"cursor-pointer",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						)}
						aria-label="Expand code"
						title="Expand"
						whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
						transition={prefersReducedMotion ? { duration: 0 } : springSnappy}
					>
						<span className={cn(
							"w-8 h-8 flex items-center justify-center rounded-full",
							"bg-muted text-muted-foreground",
							"hover:bg-accent hover:text-accent-foreground",
							"transition-colors duration-150"
						)}>
							<ExpandIcon size={16} />
						</span>
					</motion.button>
					{/* Copy button - 44px touch target */}
					<motion.button
						type="button"
						onClick={handleCopy}
						className={cn(
							"w-11 h-11 flex items-center justify-center",
							"cursor-pointer",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						)}
						aria-label={copied ? "Copied!" : "Copy code"}
						title={copied ? "Copied!" : "Copy"}
						whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
						transition={prefersReducedMotion ? { duration: 0 } : springSnappy}
					>
						<span className={cn(
							"w-8 h-8 flex items-center justify-center rounded-full",
							"transition-colors duration-150",
							copied
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
						)}>
							<CopyIcon size={16} />
						</span>
					</motion.button>
				</div>
			</div>

			{/* Code container - no horizontal scroll, wrap long lines */}
			<div
				className={cn(
					"scrolly-stage-mobile px-4 py-3",
					"font-mono text-[13px] leading-relaxed",
					focusLines.length > 0 && "has-focus-lines"
				)}
			>
				{/* Render tokens as static highlighted code */}
				<pre className="m-0 whitespace-pre-wrap break-words overflow-hidden">
					<code>
						{lines.map((lineTokens, lineIndex) => (
							<span
								key={lineIndex}
								className={cn(
									"shiki-line block",
									focusLines.includes(lineIndex + 1) && "focused-line"
								)}
							>
								{lineTokens.map((token) => (
									<span key={token.key} style={{ color: token.color }}>
										{token.content}
									</span>
								))}
								{lineIndex < lines.length - 1 && "\n"}
							</span>
						))}
					</code>
				</pre>
			</div>

			{/* Focus line styles - Oatmeal olive green with CSS spring */}
			{focusLines.length > 0 && (
				<style>{`
					.scrolly-stage-mobile.has-focus-lines .shiki-line {
						opacity: 0.4;
						transition: opacity 350ms linear(0, 0.3667, 0.8271, 1.0379, 1.0652, 1.0332, 1.006, 0.9961, 0.996, 0.9984, 0.9999, 1);
					}
					.scrolly-stage-mobile.has-focus-lines .shiki-line.focused-line {
						opacity: 1;
						background: oklch(0.55 0.05 120 / 0.12);
						margin-left: -1rem;
						margin-right: -1rem;
						padding-left: calc(1rem - 2px);
						padding-right: 1rem;
						border-left: 2px solid oklch(0.55 0.05 120);
					}
					.dark .scrolly-stage-mobile.has-focus-lines .shiki-line.focused-line {
						background: oklch(0.55 0.04 120 / 0.15);
						border-left-color: oklch(0.58 0.04 120);
					}
				`}</style>
			)}

			{/* Expandable code drawer */}
			<CodeDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				compiledSteps={compiledSteps}
				step={step}
				stepIndex={stepIndex}
				header={
					step.title && (
						<span className="text-swiss-caption text-foreground">
							{step.title}
						</span>
					)
				}
			/>
		</div>
	);
}
