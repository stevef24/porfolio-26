"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { springSmooth, springSnappy } from "@/lib/motion-variants";
import ExpandIcon from "@/components/ui/expand-icon";
import RefreshIcon from "@/components/ui/refresh-icon";
import CodeIcon from "@/components/ui/code-icon";
import LinkIcon from "@/components/ui/link-icon";
import CopyIcon from "@/components/ui/copy-icon";
import LayoutBottombarCollapseIcon from "@/components/ui/layout-bottombar-collapse-icon";

interface StageControlsProps {
	viewMode: "rendered" | "source";
	isFullscreen: boolean;
	showSourceToggle?: boolean;
	showRefresh?: boolean;
	showLink?: boolean;
	showCopy?: boolean;
	onToggleView?: () => void;
	onRefresh?: () => void;
	onToggleFullscreen?: () => void;
	onCopyLink?: () => void;
	onCopyCode?: () => void;
	className?: string;
}

interface ControlButtonProps {
	onClick: () => void;
	isActive?: boolean;
	title: string;
	ariaLabel: string;
	ariaPressed?: boolean;
	children: React.ReactNode;
}

/** Minimal icon button for floating pill toolbar. */
function StageControlButton({
	onClick,
	isActive = false,
	title,
	ariaLabel,
	ariaPressed,
	children,
}: ControlButtonProps) {
	const prefersReducedMotion = useReducedMotion();
	const hoverTap = prefersReducedMotion ? {} : { scale: 1.05 };
	const tapScale = prefersReducedMotion ? {} : { scale: 0.95 };

	return (
		<motion.button
			type="button"
			onClick={onClick}
			className={cn(
				"relative w-9 h-9 flex items-center justify-center",
				"cursor-pointer rounded-full",
				"text-foreground/50 hover:text-foreground hover:bg-foreground/8",
				isActive && "text-foreground bg-foreground/8",
				"transition-colors duration-150",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
			)}
			title={title}
			aria-label={ariaLabel}
			aria-pressed={ariaPressed}
			whileHover={hoverTap}
			whileTap={tapScale}
			transition={prefersReducedMotion ? { duration: 0 } : springSnappy}
		>
			{children}
		</motion.button>
	);
}

/** Floating pill toolbar for ScrollyStage canvas. */
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
				"flex items-center gap-0.5 px-1.5 py-1 rounded-full",
				"bg-background/95 dark:bg-card/90",
				"shadow-sm shadow-black/5 dark:shadow-black/20 backdrop-blur-md",
				"border border-border/40",
				className
			)}
			initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
			role="toolbar"
			aria-label="Stage controls"
		>
			{onToggleFullscreen && (
				<StageControlButton
					onClick={onToggleFullscreen}
					isActive={isFullscreen}
					title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
					ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
					ariaPressed={isFullscreen}
				>
					{isFullscreen ? <LayoutBottombarCollapseIcon size={16} /> : <ExpandIcon size={16} />}
				</StageControlButton>
			)}

			{showRefresh && onRefresh && (
				<StageControlButton onClick={onRefresh} title="Refresh preview" ariaLabel="Refresh preview">
					<RefreshIcon size={16} />
				</StageControlButton>
			)}

			{showLink && onCopyLink && (
				<StageControlButton onClick={onCopyLink} title="Copy link to step" ariaLabel="Copy link to step">
					<LinkIcon size={16} />
				</StageControlButton>
			)}

			{showCopy && onCopyCode && (
				<StageControlButton onClick={onCopyCode} title="Copy code" ariaLabel="Copy code to clipboard">
					<CopyIcon size={16} />
				</StageControlButton>
			)}

			{showSourceToggle && onToggleView && (
				<StageControlButton
					onClick={onToggleView}
					isActive={viewMode === "source"}
					title={viewMode === "source" ? "Show preview" : "Show source code"}
					ariaLabel={viewMode === "source" ? "Show preview" : "Show source code"}
					ariaPressed={viewMode === "source"}
				>
					<CodeIcon size={16} />
				</StageControlButton>
			)}
		</motion.div>
	);
}
