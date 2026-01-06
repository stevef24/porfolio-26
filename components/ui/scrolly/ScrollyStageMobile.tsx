"use client";

/**
 * ScrollyStageMobile - Compact inline code stage for mobile layouts
 *
 * Shows static code for a single step. No Magic Move animation - just
 * prerendered highlighted code with theme support.
 */

import { useMemo, useState, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
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
	const { resolvedTheme } = useTheme();
	const [copied, setCopied] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch - only render theme-dependent content after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	// Get tokens for current theme and step (use dark as default for SSR)
	const tokensInfo = useMemo(() => {
		const theme = mounted && resolvedTheme === "light" ? "light" : "dark";
		const steps =
			theme === "light" ? compiledSteps.stepsLight : compiledSteps.stepsDark;
		return steps[stepIndex]?.tokens ?? null;
	}, [compiledSteps, stepIndex, resolvedTheme, mounted]);

	// Split flat tokens array into lines for rendering
	const lines = useMemo(() => {
		if (!tokensInfo) return [];

		const result: Array<Array<{ content: string; color?: string; key: string }>> = [[]];

		for (const token of tokensInfo.tokens) {
			// Handle tokens that contain newlines
			const parts = token.content.split("\n");
			parts.forEach((part, i) => {
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
				"relative rounded-md border border-border bg-card",
				"overflow-hidden",
				className
			)}
		>
			{/* Header bar with filename and copy button */}
			<div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
				{filename && (
					<span className="text-swiss-label text-muted-foreground">
						{filename}
					</span>
				)}
				<button
					type="button"
					onClick={handleCopy}
					className={cn(
						"text-swiss-label transition-colors",
						"hover:text-foreground",
						copied ? "text-foreground" : "text-muted-foreground"
					)}
					aria-label={copied ? "Copied!" : "Copy code"}
				>
					{copied ? "Copied!" : "Copy"}
				</button>
			</div>

			{/* Code container with horizontal scroll */}
			<div
				className={cn(
					"scrolly-stage-mobile overflow-x-auto p-4",
					"font-mono text-sm leading-relaxed",
					focusLines.length > 0 && "has-focus-lines"
				)}
			>
				{/* Render tokens as static highlighted code */}
				<pre className="m-0">
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

			{/* Focus line styles */}
			{focusLines.length > 0 && (
				<style>{`
					.scrolly-stage-mobile.has-focus-lines .shiki-line {
						opacity: 0.5;
						transition: opacity 200ms ease;
					}
					.scrolly-stage-mobile.has-focus-lines .shiki-line.focused-line {
						opacity: 1;
						background: var(--muted);
						margin-left: -1rem;
						margin-right: -1rem;
						padding-left: 1rem;
						padding-right: 1rem;
						border-left: 2px solid var(--foreground);
					}
				`}</style>
			)}
		</div>
	);
}
