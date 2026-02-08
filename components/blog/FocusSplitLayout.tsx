"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springGentle } from "@/lib/motion-variants";

interface FocusSplitLayoutProps {
	mode: "split" | "read";
	left: ReactNode;
	right: ReactNode;
	panelWidth?: number;
	className?: string;
	panelClassName?: string;
}

export function FocusSplitLayout({
	mode,
	left,
	right,
	panelWidth = 420,
	className,
	panelClassName,
}: FocusSplitLayoutProps): JSX.Element {
	const prefersReducedMotion = useReducedMotion();
	const isSplit = mode === "split";
	const clampedWidth = Math.min(Math.max(panelWidth, 360), 520);

	const panelTransition = prefersReducedMotion
		? { duration: 0 }
		: springGentle;

	return (
		<div className={cn("relative w-full", className)}>
			<div className="md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-6">
				<div className="min-w-0">{left}</div>

				<motion.aside
					className={cn(
						"hidden md:block overflow-hidden justify-self-end",
						panelClassName
					)}
					animate={{ width: isSplit ? clampedWidth : 0 }}
					transition={panelTransition}
					style={{ pointerEvents: isSplit ? "auto" : "none" }}
					aria-hidden={!isSplit}
				>
					<AnimatePresence initial={false}>
						{isSplit && (
							<motion.div
								className="h-full w-full"
								initial={
									prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }
								}
								animate={
									prefersReducedMotion
										? { opacity: 1, scale: 1 }
										: {
												opacity: 1,
												scale: 1,
												transition: {
													...springGentle,
													delay: 0.12,
												},
											}
								}
								exit={
									prefersReducedMotion
										? { opacity: 1, scale: 1, transition: { duration: 0 } }
										: {
												opacity: 0,
												scale: 0.98,
												transition: {
													...springGentle,
													delay: 0,
												},
											}
								}
							>
								{right}
							</motion.div>
						)}
					</AnimatePresence>
				</motion.aside>
			</div>
		</div>
	);
}
