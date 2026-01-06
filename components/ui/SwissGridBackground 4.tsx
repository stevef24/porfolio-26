"use client";

import { useScroll, useTransform, motion, useReducedMotion } from "motion/react";
import { useRef, useEffect, useState, useCallback } from "react";

interface GridPulse {
	id: number;
	startX: number;
	startY: number;
	direction: "horizontal" | "vertical";
	length: number;
}

interface SwissGridBackgroundProps {
	/** Grid cell size in pixels (default: 64px - 8x8 baseline) */
	gridSize?: number;
	/** Line opacity (default: 0.04 - very subtle) */
	lineOpacity?: number;
	/** Parallax scroll intensity (default: 0.15 - subtle movement) */
	parallaxIntensity?: number;
	/** Enable electric pulse animation (default: true) */
	enablePulse?: boolean;
	/** Pulse spawn interval in ms (default: 3000) */
	pulseInterval?: number;
}

/**
 * SwissGridBackground - A subtle mathematical grid background
 * inspired by Swiss Design principles.
 *
 * Features:
 * - Mathematical 64px grid (8x8 baseline)
 * - Very subtle opacity for luxury feel
 * - Parallax scroll effect
 * - Electric pulse animations along grid lines
 * - Gradient overlay for depth
 * - Respects reduced motion preferences
 */
export function SwissGridBackground({
	gridSize = 64,
	lineOpacity = 0.04,
	parallaxIntensity = 0.15,
	enablePulse = true,
	pulseInterval = 3000,
}: SwissGridBackgroundProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll();
	const [pulses, setPulses] = useState<GridPulse[]>([]);
	const pulseIdRef = useRef(0);

	// Spawn random pulses along grid lines
	const spawnPulse = useCallback(() => {
		if (typeof window === "undefined") return;

		const isHorizontal = Math.random() > 0.5;
		const gridLines = isHorizontal
			? Math.floor(window.innerHeight / gridSize)
			: Math.floor(window.innerWidth / gridSize);

		const lineIndex = Math.floor(Math.random() * gridLines);
		const length = gridSize * (2 + Math.floor(Math.random() * 4)); // 2-5 cells long

		const newPulse: GridPulse = {
			id: pulseIdRef.current++,
			startX: isHorizontal ? -length : lineIndex * gridSize,
			startY: isHorizontal ? lineIndex * gridSize : -length,
			direction: isHorizontal ? "horizontal" : "vertical",
			length,
		};

		setPulses((prev) => [...prev, newPulse]);

		// Remove pulse after animation completes
		setTimeout(() => {
			setPulses((prev) => prev.filter((p) => p.id !== newPulse.id));
		}, 4000);
	}, [gridSize]);

	// Spawn pulses at intervals
	useEffect(() => {
		if (!enablePulse || prefersReducedMotion) return;

		// Initial spawn after a short delay
		const initialTimeout = setTimeout(() => {
			spawnPulse();
		}, 1000);

		const interval = setInterval(() => {
			// Randomly spawn 1-2 pulses
			spawnPulse();
			if (Math.random() > 0.6) {
				setTimeout(spawnPulse, 500);
			}
		}, pulseInterval);

		return () => {
			clearTimeout(initialTimeout);
			clearInterval(interval);
		};
	}, [enablePulse, prefersReducedMotion, pulseInterval, spawnPulse]);

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

						{/* Gradient for pulse fade effect */}
						<linearGradient id="pulse-gradient-h" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="oklch(0.75 0.18 131)" stopOpacity="0" />
							<stop offset="20%" stopColor="oklch(0.75 0.18 131)" stopOpacity="0.6" />
							<stop offset="50%" stopColor="oklch(0.85 0.20 131)" stopOpacity="0.8" />
							<stop offset="80%" stopColor="oklch(0.75 0.18 131)" stopOpacity="0.6" />
							<stop offset="100%" stopColor="oklch(0.75 0.18 131)" stopOpacity="0" />
						</linearGradient>

						<linearGradient id="pulse-gradient-v" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stopColor="oklch(0.75 0.18 131)" stopOpacity="0" />
							<stop offset="20%" stopColor="oklch(0.75 0.18 131)" stopOpacity="0.6" />
							<stop offset="50%" stopColor="oklch(0.85 0.20 131)" stopOpacity="0.8" />
							<stop offset="80%" stopColor="oklch(0.75 0.18 131)" stopOpacity="0.6" />
							<stop offset="100%" stopColor="oklch(0.75 0.18 131)" stopOpacity="0" />
						</linearGradient>
					</defs>
					<rect
						width="100%"
						height="100%"
						fill="url(#swiss-grid)"
						className="text-foreground"
					/>
				</svg>
			</motion.div>

			{/* Electric pulse animations */}
			{enablePulse && !prefersReducedMotion && (
				<div className="absolute inset-0 overflow-hidden">
					{pulses.map((pulse) => (
						<motion.div
							key={pulse.id}
							className="absolute"
							style={{
								width: pulse.direction === "horizontal" ? pulse.length : 2,
								height: pulse.direction === "vertical" ? pulse.length : 2,
								background:
									pulse.direction === "horizontal"
										? "linear-gradient(to right, transparent, oklch(0.75 0.18 131 / 0.7), oklch(0.85 0.20 131), oklch(0.75 0.18 131 / 0.7), transparent)"
										: "linear-gradient(to bottom, transparent, oklch(0.75 0.18 131 / 0.7), oklch(0.85 0.20 131), oklch(0.75 0.18 131 / 0.7), transparent)",
								boxShadow: "0 0 8px oklch(0.75 0.18 131 / 0.5)",
								borderRadius: 1,
							}}
							initial={{
								x: pulse.startX,
								y: pulse.startY,
								opacity: 0,
							}}
							animate={{
								x:
									pulse.direction === "horizontal"
										? [pulse.startX, window?.innerWidth + pulse.length]
										: pulse.startX,
								y:
									pulse.direction === "vertical"
										? [pulse.startY, window?.innerHeight + pulse.length]
										: pulse.startY,
								opacity: [0, 1, 1, 0],
							}}
							transition={{
								duration: 3,
								ease: "linear",
								opacity: {
									times: [0, 0.1, 0.9, 1],
									duration: 3,
								},
							}}
						/>
					))}
				</div>
			)}

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
