"use client";

import { useScroll, useTransform, motion, useReducedMotion, useSpring } from "motion/react";
import { useRef, useCallback } from "react";

interface SwissGridBackgroundProps {
	/** Grid cell size in pixels (default: 64px - 8x8 baseline) */
	gridSize?: number;
	/** Line opacity (default: 0.04 - very subtle) */
	lineOpacity?: number;
	/** Parallax scroll intensity (default: 0.15 - subtle movement) */
	parallaxIntensity?: number;
	/** Enable hover glow effect (default: true) */
	enableGlow?: boolean;
	/** Glow intensity (default: 0.12 - subtle) */
	glowIntensity?: number;
	/** Glow radius in pixels (default: 300) */
	glowRadius?: number;
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
	enableGlow = true,
	glowIntensity = 0.12,
	glowRadius = 300,
}: SwissGridBackgroundProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll();

	// Smooth spring animation for glow position
	const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
	const glowX = useSpring(0, springConfig);
	const glowY = useSpring(0, springConfig);
	const glowOpacity = useSpring(0, { stiffness: 200, damping: 25 });

	const handleMouseMove = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (!enableGlow || prefersReducedMotion) return;
			const rect = event.currentTarget.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			glowX.set(x);
			glowY.set(y);
		},
		[enableGlow, prefersReducedMotion, glowX, glowY]
	);

	const handleMouseEnter = useCallback(() => {
		if (!enableGlow || prefersReducedMotion) return;
		glowOpacity.set(glowIntensity);
	}, [enableGlow, prefersReducedMotion, glowOpacity, glowIntensity]);

	const handleMouseLeave = useCallback(() => {
		glowOpacity.set(0);
	}, [glowOpacity]);

	// Subtle parallax translation - disabled for reduced motion
	const y = useTransform(
		scrollYProgress,
		[0, 1],
		prefersReducedMotion ? [0, 0] : [0, -100 * parallaxIntensity]
	);

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 z-0 overflow-hidden"
			aria-hidden="true"
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
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

			{/* Interactive lime glow effect on hover */}
			{enableGlow && !prefersReducedMotion && (
				<motion.div
					className="absolute pointer-events-none rounded-full"
					style={{
						width: glowRadius * 2,
						height: glowRadius * 2,
						left: glowX,
						top: glowY,
						x: -glowRadius,
						y: -glowRadius,
						opacity: glowOpacity,
						background: `radial-gradient(
							circle at center,
							oklch(0.75 0.18 131 / 0.15) 0%,
							oklch(0.75 0.18 131 / 0.05) 40%,
							transparent 70%
						)`,
					}}
				/>
			)}
		</div>
	);
}

export default SwissGridBackground;
