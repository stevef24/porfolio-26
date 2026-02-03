"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { springSmooth } from "@/lib/motion-variants";
import ExpandIcon from "@/components/ui/expand-icon";
import RefreshIcon from "@/components/ui/refresh-icon";
import CodeIcon from "@/components/ui/code-icon";
import LinkIcon from "@/components/ui/link-icon";
import CopyIcon from "@/components/ui/copy-icon";
import LayoutBottombarCollapseIcon from "@/components/ui/layout-bottombar-collapse-icon";

interface StageControlsProps {
	/** Current view mode */
	viewMode: "rendered" | "source";
	/** Whether stage is in fullscreen */
	isFullscreen: boolean;
	/** Show source code toggle button */
	showSourceToggle?: boolean;
	/** Show refresh button */
	showRefresh?: boolean;
	/** Show copy link button */
	showLink?: boolean;
	/** Show copy code button */
	showCopy?: boolean;
	/** Callback when view mode toggles */
	onToggleView?: () => void;
	/** Callback when refresh is clicked */
	onRefresh?: () => void;
	/** Callback when fullscreen toggles */
	onToggleFullscreen?: () => void;
	/** Callback when link is copied */
	onCopyLink?: () => void;
	/** Callback when code is copied */
	onCopyCode?: () => void;
	/** Additional CSS classes */
	className?: string;
}

/**
 * Control bar for ScrollyStage canvas.
 * Provides fullscreen toggle, refresh, source view, and copy actions.
 *
 * @example
 * ```tsx
 * <StageControls
 *   viewMode="rendered"
 *   isFullscreen={false}
 *   onToggleFullscreen={() => setFullscreen(!fullscreen)}
 *   onToggleView={() => setViewMode(v => v === "rendered" ? "source" : "rendered")}
 * />
 * ```
 */
export function StageControls({
	viewMode,
	isFullscreen,
	showSourceToggle = true,
	showRefresh = true,
	showLink = false,
	showCopy = true,
	onToggleView,
	onRefresh,
	onToggleFullscreen,
	onCopyLink,
	onCopyCode,
	className,
}: StageControlsProps) {
	const prefersReducedMotion = useReducedMotion();

	// OpenAI design: circular buttons with opacity-based backgrounds
	// Works in both light and dark mode via CSS variables
	const buttonClass = cn(
		"w-7 h-7 flex items-center justify-center",
		"rounded-full cursor-pointer",
		// Light mode: dark background on cream stage | Dark mode: light background on dark stage
		"bg-foreground/80 text-background/70",
		"hover:text-background hover:bg-foreground/90",
		"transition-all duration-150",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
	);

	const activeButtonClass = cn(buttonClass, "text-background bg-foreground/90");

	// Check if any buttons are visible
	const hasButtons =
		onToggleFullscreen ||
		(showRefresh && onRefresh) ||
		(showLink && onCopyLink) ||
		(showCopy && onCopyCode) ||
		(showSourceToggle && onToggleView);

	if (!hasButtons) return null;

	return (
		<motion.div
			className={cn(
				// OpenAI design: floating pill toolbar with opacity-based backgrounds
				"flex items-center gap-1 p-1",
				// Light mode: dark container | Dark mode: light container
				"bg-foreground/90 rounded-2xl",
				// Shadow only in light mode
				"shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-none",
				className
			)}
			initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
			animate={{ opacity: 1, y: 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
			role="toolbar"
			aria-label="Stage controls"
		>
			{/* Fullscreen Toggle */}
			{onToggleFullscreen && (
				<button
					type="button"
					onClick={onToggleFullscreen}
					className={isFullscreen ? activeButtonClass : buttonClass}
					title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
					aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
					aria-pressed={isFullscreen}
				>
					{isFullscreen ? (
						<LayoutBottombarCollapseIcon size={16} />
					) : (
						<ExpandIcon size={16} />
					)}
				</button>
			)}

			{/* Refresh */}
			{showRefresh && onRefresh && (
				<button
					type="button"
					onClick={onRefresh}
					className={buttonClass}
					title="Refresh preview"
					aria-label="Refresh preview"
				>
					<RefreshIcon size={16} />
				</button>
			)}

			{/* Copy Link */}
			{showLink && onCopyLink && (
				<button
					type="button"
					onClick={onCopyLink}
					className={buttonClass}
					title="Copy link to step"
					aria-label="Copy link to step"
				>
					<LinkIcon size={16} />
				</button>
			)}

			{/* Copy Code */}
			{showCopy && onCopyCode && (
				<button
					type="button"
					onClick={onCopyCode}
					className={buttonClass}
					title="Copy code"
					aria-label="Copy code to clipboard"
				>
					<CopyIcon size={16} />
				</button>
			)}

			{/* View Source Toggle */}
			{showSourceToggle && onToggleView && (
				<button
					type="button"
					onClick={onToggleView}
					className={viewMode === "source" ? activeButtonClass : buttonClass}
					title={viewMode === "source" ? "Show preview" : "Show source code"}
					aria-label={
						viewMode === "source" ? "Show preview" : "Show source code"
					}
					aria-pressed={viewMode === "source"}
				>
					<CodeIcon size={16} />
				</button>
			)}
		</motion.div>
	);
}
