"use client";

/**
 * ScrollyStageMobile - Compact inline code stage for mobile layouts
 *
 * Shows static code for a single step. No Magic Move animation - just
 * prerendered highlighted code with theme support.
 */

import { useMemo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { deriveFilename } from "@/lib/scrolly/types";
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

	// Get tokens for current step (CSS handles theme switching)
	const tokensInfo = useMemo(() => {
		return compiledSteps.steps[stepIndex]?.tokens ?? null;
	}, [compiledSteps, stepIndex]);

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
			{/* Header bar with filename and copy button */}
			<div className="flex items-center justify-between px-4 py-2 border-y border-border bg-muted/30">
				{filename && (
					<span className="text-swiss-label text-muted-foreground">
						{filename}
					</span>
				)}
				<button
					type="button"
					onClick={handleCopy}
					className={cn(
						"text-swiss-label transition-colors cursor-pointer",
						"hover:text-foreground",
						copied ? "text-foreground" : "text-muted-foreground"
					)}
					aria-label={copied ? "Copied!" : "Copy code"}
				>
					{copied ? "Copied!" : "Copy"}
				</button>
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

			{/* Focus line styles - uses global canvas CSS variables */}
			{focusLines.length > 0 && (
				<style>{`
					.scrolly-stage-mobile.has-focus-lines .shiki-line {
						opacity: 0.4;
						transition: opacity 200ms ease;
					}
					.scrolly-stage-mobile.has-focus-lines .shiki-line.focused-line {
						opacity: 1;
						background: var(--canvas-focus-bg);
						margin-left: -1rem;
						margin-right: -1rem;
						padding-left: calc(1rem - 2px);
						padding-right: 1rem;
						border-left: 2px solid var(--canvas-focus-border);
					}
				`}</style>
			)}
		</div>
	);
}
