"use client";

import { useScroll, useTransform, motion, useReducedMotion } from "motion/react";
import { useRef } from "react";

interface SwissGridBackgroundProps {
	/** Grid cell size in pixels (default: 64px - 8x8 baseline) */
	gridSize?: number;
	/** Line opacity (default: 0.04 - very subtle) */
	lineOpacity?: number;
	/** Parallax scroll intensity (default: 0.15 - subtle movement) */
	parallaxIntensity?: number;
}

/**
 * SwissGridBackground - A subtle mathematical grid background
 * inspired by Swiss Design principles.
 *
 * Features:
 * - Mathematical 64px grid (8x8 baseline)
 * - Very subtle opacity for luxury feel
 * - Parallax scroll effect
 * - Gradient overlay for depth
 * - Respects reduced motion preferences
 */
export function SwissGridBackground({
	gridSize = 64,
	lineOpacity = 0.04,
	parallaxIntensity = 0.15,
}: SwissGridBackgroundProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll();

	// Subtle parallax translation - disabled for reduced motion
	const y = useTransform(
		scrollYProgress,
		[0, 1],
		prefersReducedMotion ? [0, 0] : [0, -100 * parallaxIntensity]
	);

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
			aria-hidden="true"
		>
			{/* Grid pattern with parallax */}
			<motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
				<svg
					width="100%"
					height="100%"
					className="absolute inset-0"
					preserveAspectRatio="none"
				>
					<defs>
						{/* Swiss grid pattern - clean L-shaped corners */}
						<pattern
							id="swiss-grid"
							width={gridSize}
							height={gridSize}
							patternUnits="userSpaceOnUse"
						>
							{/* Horizontal line */}
							<line
								x1="0"
								y1={gridSize}
								x2={gridSize}
								y2={gridSize}
								stroke="currentColor"
								strokeOpacity={lineOpacity}
								strokeWidth="1"
							/>
							{/* Vertical line */}
							<line
								x1={gridSize}
								y1="0"
								x2={gridSize}
								y2={gridSize}
								stroke="currentColor"
								strokeOpacity={lineOpacity}
								strokeWidth="1"
							/>
						</pattern>
					</defs>
					<rect
						width="100%"
						height="100%"
						fill="url(#swiss-grid)"
						className="text-foreground"
					/>
				</svg>
			</motion.div>

			{/* Horizontal gradient overlay - side vignettes for luxury feel */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background: `linear-gradient(
						to right,
						var(--background) 0%,
						transparent 12%,
						transparent 88%,
						var(--background) 100%
					)`,
				}}
			/>

			{/* Subtle bottom fade for content separation */}
			<div
				className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
				style={{
					background: `linear-gradient(
						to top,
						var(--background) 0%,
						transparent 100%
					)`,
					opacity: 0.6,
				}}
			/>
		</div>
	);
}

export default SwissGridBackground;
