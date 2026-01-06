"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { segmentedIndicatorSpring } from "@/lib/motion-variants";

interface SegmentedControlOption {
	value: string;
	label: string;
}

interface SegmentedControlProps {
	options: SegmentedControlOption[];
	value: string;
	onChange: (value: string) => void;
	className?: string;
	size?: "sm" | "md";
}

/**
 * SegmentedControl - Animated toggle between options
 * Inspired by animations.dev with spring physics indicator
 */
export function SegmentedControl({
	options,
	value,
	onChange,
	className,
	size = "md",
}: SegmentedControlProps) {
	const prefersReducedMotion = useReducedMotion();

	return (
		<div
			className={cn(
				"inline-flex rounded-full bg-muted p-1 relative",
				className
			)}
			role="radiogroup"
			aria-label="View options"
		>
			{options.map((option) => {
				const isActive = value === option.value;

				return (
					<button
						key={option.value}
						type="button"
						role="radio"
						aria-checked={isActive}
						onClick={() => onChange(option.value)}
						className={cn(
							"relative flex-1 rounded-full font-medium transition-colors z-10 cursor-pointer",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1",
							size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm",
							isActive
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground"
						)}
					>
						{isActive && (
							<motion.span
								layoutId="segmented-control-indicator"
								className="absolute inset-0 bg-background rounded-full shadow-sm"
								transition={
									prefersReducedMotion ? { duration: 0 } : segmentedIndicatorSpring
								}
							/>
						)}
						<span className="relative z-10">{option.label}</span>
					</button>
				);
			})}
		</div>
	);
}

export default SegmentedControl;
