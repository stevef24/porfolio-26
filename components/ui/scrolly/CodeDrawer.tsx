"use client";

/**
 * CodeDrawer - Mobile slide-up panel for code viewing
 *
 * A bottom sheet drawer that displays code content with:
 * - Slide-up animation from bottom
 * - Drag-to-dismiss gesture
 * - Body scroll lock when open
 * - Theme-aware syntax highlighting
 */

import {
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
	motion,
	AnimatePresence,
	useReducedMotion,
	useDragControls,
	type PanInfo,
} from "motion/react";
import { cn } from "@/lib/utils";
import { springSmooth, springSnappy } from "@/lib/motion-variants";
import { deriveFilename } from "@/lib/scrolly/types";
import CopyIcon from "@/components/ui/copy-icon";
import type { CompilationResult } from "@/lib/scrolly/utils";
import type { ScrollyCodeStep } from "@/lib/scrolly/types";

interface CodeDrawerProps {
	/** Whether the drawer is open */
	isOpen: boolean;
	/** Callback when drawer should close */
	onClose: () => void;
	/** Compiled tokens from server-side compilation */
	compiledSteps: CompilationResult;
	/** The specific step to display */
	step: ScrollyCodeStep;
	/** Index of this step */
	stepIndex: number;
	/** Optional header content (e.g., step title) */
	header?: ReactNode;
	/** Maximum height as percentage of viewport (default: 70) */
	maxHeight?: number;
	/** Additional CSS classes */
	className?: string;
}

/** Threshold in pixels for drag-to-dismiss */
const DISMISS_THRESHOLD = 100;

/**
 * Mobile code drawer with drag-to-dismiss.
 *
 * Features:
 * - Portal rendering to document.body
 * - Escape key to close
 * - Tap overlay to close
 * - Drag down to dismiss (threshold: 100px)
 * - Body scroll lock with scrollbar compensation
 * - Spring animations (respects reduced motion)
 */
export function CodeDrawer({
	isOpen,
	onClose,
	compiledSteps,
	step,
	stepIndex,
	header,
	maxHeight = 70,
	className,
}: CodeDrawerProps) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();
	const [mounted, setMounted] = useState(false);
	const [copied, setCopied] = useState(false);
	const dragControls = useDragControls();

	// Only render portal after client-side mount
	useEffect(() => {
		setMounted(true);
	}, []);

	// Escape key handler
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	// Body scroll lock
	useEffect(() => {
		if (!isOpen) return;

		const originalOverflow = document.body.style.overflow;
		const originalPaddingRight = document.body.style.paddingRight;

		// Get scrollbar width to prevent layout shift
		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth;

		document.body.style.overflow = "hidden";
		if (scrollbarWidth > 0) {
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		}

		return () => {
			document.body.style.overflow = originalOverflow;
			document.body.style.paddingRight = originalPaddingRight;
		};
	}, [isOpen]);

	// Click outside handler
	const handleOverlayClick = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === overlayRef.current) {
				onClose();
			}
		},
		[onClose]
	);

	// Drag end handler
	const handleDragEnd = useCallback(
		(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
			// Close if dragged down past threshold or with enough velocity
			if (info.offset.y > DISMISS_THRESHOLD || info.velocity.y > 500) {
				onClose();
			}
		},
		[onClose]
	);

	// Get tokens for current step (dual-theme tokens - CSS handles theme switching)
	const tokensInfo = useMemo(() => {
		if (!mounted) return null;
		return compiledSteps.steps[stepIndex]?.tokens ?? null;
	}, [compiledSteps, stepIndex, mounted]);

	// Split tokens into lines
	const lines = useMemo(() => {
		if (!tokensInfo) return [];

		const result: Array<
			Array<{ content: string; color?: string; key: string }>
		> = [[]];

		for (const token of tokensInfo.tokens) {
			const parts = token.content.split("\n");
			parts.forEach((part: string, i: number) => {
				if (i > 0) {
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
			// Silently fail
		}
	}, [step.code]);

	// Don't render on server or before mount
	if (!mounted) return null;

	return createPortal(
		<AnimatePresence mode="wait">
			{isOpen && (
				<motion.div
					ref={overlayRef}
					className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
					initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
					transition={{ duration: 0.2 }}
					onClick={handleOverlayClick}
					role="dialog"
					aria-modal="true"
					aria-label="Code viewer"
				>
					{/* Drawer panel */}
					<motion.div
						className={cn(
							"absolute inset-x-0 bottom-0",
							"bg-card rounded-t-3xl",
							"shadow-2xl",
							"flex flex-col overflow-hidden",
							className
						)}
						style={{ maxHeight: `${maxHeight}vh` }}
						initial={
							prefersReducedMotion
								? { y: 0, opacity: 1 }
								: { y: "100%", opacity: 0.5 }
						}
						animate={{ y: 0, opacity: 1 }}
						exit={
							prefersReducedMotion
								? { opacity: 0 }
								: { y: "100%", opacity: 0.5 }
						}
						transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
						drag="y"
						dragControls={dragControls}
						dragConstraints={{ top: 0, bottom: 0 }}
						dragElastic={{ top: 0, bottom: 0.5 }}
						onDragEnd={handleDragEnd}
					>
						{/* Drag handle - accessible and responsive */}
						<div
							className={cn(
								"flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none",
								"hover:bg-muted/30 transition-colors duration-150"
							)}
							onPointerDown={(e) => dragControls.start(e)}
							role="slider"
							aria-label="Drag to resize or dismiss"
							aria-orientation="vertical"
							tabIndex={0}
						>
							<div className="w-12 h-1.5 rounded-full bg-muted-foreground/40 group-active:bg-muted-foreground/60" />
						</div>

						{/* Header with filename and copy */}
						<div className="flex items-center justify-between px-4 pb-2 border-b border-border">
							<div className="flex items-center gap-3">
								{filename && (
									<span className="text-swiss-label text-muted-foreground">
										{filename}
									</span>
								)}
								{header}
							</div>
							{/* Copy button with 44px touch target */}
							<motion.button
								type="button"
								onClick={handleCopy}
								className={cn(
									"w-11 h-11 flex items-center justify-center -mr-2",
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

						{/* Code content - scrollable */}
						<div
							className={cn(
								"code-drawer-content flex-1 overflow-y-auto overflow-x-hidden",
								"px-4 py-3",
								"font-mono text-[13px] leading-relaxed",
								focusLines.length > 0 && "has-focus-lines"
							)}
						>
							{tokensInfo ? (
								<pre className="m-0 whitespace-pre-wrap break-words">
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
							) : (
								<div className="text-swiss-caption text-muted-foreground">
									Failed to compile code
								</div>
							)}
						</div>

						{/* Focus line styles with CSS spring */}
						{focusLines.length > 0 && (
							<style>{`
								.code-drawer-content.has-focus-lines .shiki-line {
									opacity: 0.4;
									transition: opacity 350ms linear(0, 0.3667, 0.8271, 1.0379, 1.0652, 1.0332, 1.006, 0.9961, 0.996, 0.9984, 0.9999, 1);
								}
								.code-drawer-content.has-focus-lines .shiki-line.focused-line {
									opacity: 1;
									background: oklch(0.55 0.05 120 / 0.12);
									margin-left: -1rem;
									margin-right: -1rem;
									padding-left: calc(1rem - 2px);
									padding-right: 1rem;
									border-left: 2px solid oklch(0.55 0.05 120);
								}
								.dark .code-drawer-content.has-focus-lines .shiki-line.focused-line {
									background: oklch(0.55 0.04 120 / 0.15);
									border-left-color: oklch(0.58 0.04 120);
								}
							`}</style>
						)}

						{/* Safe area padding for notched devices */}
						<div className="pb-safe" />
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body
	);
}
