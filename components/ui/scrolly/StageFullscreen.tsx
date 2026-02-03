"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springSmooth } from "@/lib/motion-variants";

interface StageFullscreenProps {
	/** Whether the fullscreen modal is open */
	isOpen: boolean;
	/** Callback when modal should close */
	onClose: () => void;
	/** Content to render in fullscreen */
	children: ReactNode;
	/** Additional CSS classes for the content container */
	className?: string;
}

/**
 * Fullscreen modal for ScrollyStage canvas.
 * Renders via portal to document.body for proper stacking context.
 *
 * Features:
 * - Escape key closes modal
 * - Click outside (on overlay) closes modal
 * - Body scroll locked when open
 * - Spring animations (respects reduced motion)
 *
 * @example
 * ```tsx
 * <StageFullscreen isOpen={isFullscreen} onClose={() => setFullscreen(false)}>
 *   <ScrollyStage ... />
 * </StageFullscreen>
 * ```
 */
export function StageFullscreen({
	isOpen,
	onClose,
	children,
	className,
}: StageFullscreenProps) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();
	const [mounted, setMounted] = useState(false);

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

	// Don't render on server or before mount
	if (!mounted) return null;

	return createPortal(
		<AnimatePresence mode="wait">
			{isOpen && (
				<motion.div
					ref={overlayRef}
					className={cn(
						"fixed inset-0 z-50",
						"bg-background/80 backdrop-blur-sm"
					)}
					initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
					transition={{ duration: 0.2 }}
					onClick={handleOverlayClick}
					role="dialog"
					aria-modal="true"
					aria-label="Fullscreen stage view"
				>
					{/* Expanding container - starts from right, expands to fill */}
					<motion.div
						className={cn(
							"absolute inset-y-2 right-2",
							"overflow-hidden rounded-3xl",
							// OpenAI design: muted background with shadow only in light mode
							"bg-muted",
							"shadow-[0_25px_80px_rgba(0,0,0,0.25)] dark:shadow-none",
							className
						)}
						// Expand from right half to full width
						initial={
							prefersReducedMotion
								? { width: "100%", left: "0.5rem", opacity: 1 }
								: { width: "50vw", left: "auto", opacity: 0.8 }
						}
						animate={{ width: "calc(100% - 1rem)", left: "0.5rem", opacity: 1 }}
						exit={
							prefersReducedMotion
								? { opacity: 0 }
								: { width: "50vw", left: "auto", opacity: 0 }
						}
						transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
					>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body
	);
}
