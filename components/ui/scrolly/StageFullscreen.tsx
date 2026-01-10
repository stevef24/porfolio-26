"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springSmooth } from "@/lib/motion-variants";

interface StageFullscreenProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	className?: string;
}

/** Fullscreen modal for ScrollyStage canvas with escape key and click-outside close. */
export function StageFullscreen({
	isOpen,
	onClose,
	children,
	className,
}: StageFullscreenProps) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	// Escape key closes modal
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

	// Lock body scroll when open
	useEffect(() => {
		if (!isOpen) return;
		const originalOverflow = document.body.style.overflow;
		const originalPaddingRight = document.body.style.paddingRight;
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

		document.body.style.overflow = "hidden";
		if (scrollbarWidth > 0) {
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		}

		return () => {
			document.body.style.overflow = originalOverflow;
			document.body.style.paddingRight = originalPaddingRight;
		};
	}, [isOpen]);

	const handleOverlayClick = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === overlayRef.current) onClose();
		},
		[onClose]
	);

	if (!mounted) return null;

	const reducedMotion = Boolean(prefersReducedMotion);

	return createPortal(
		<AnimatePresence mode="wait">
			{isOpen && (
				<motion.div
					ref={overlayRef}
					className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
					initial={{ opacity: reducedMotion ? 1 : 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					onClick={handleOverlayClick}
					role="dialog"
					aria-modal="true"
					aria-label="Fullscreen stage view"
				>
					<motion.div
						className={cn(
							"absolute inset-y-2 right-2 overflow-hidden rounded-3xl",
							"bg-secondary shadow-2xl",
							className
						)}
						initial={
							reducedMotion
								? { width: "100%", left: "0.5rem", opacity: 1 }
								: { width: "50vw", left: "auto", opacity: 0.8 }
						}
						animate={{ width: "calc(100% - 1rem)", left: "0.5rem", opacity: 1 }}
						exit={reducedMotion ? { opacity: 0 } : { width: "50vw", left: "auto", opacity: 0 }}
						transition={reducedMotion ? { duration: 0 } : springSmooth}
					>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body
	);
}
