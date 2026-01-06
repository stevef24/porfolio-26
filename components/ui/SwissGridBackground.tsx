"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "motion/react";

/**
 * High-fidelity Canvas Noise component.
 * Provides a dynamic, organic grain texture.
 */
const Noise: React.FC<{ refreshInterval?: number; alpha?: number }> = ({
	refreshInterval = 2,
	alpha = 15,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;

		let frame = 0;
		let animationId = 0;
		const size = 512; // Static buffer size for performance

		const resize = () => {
			if (!canvas) return;
			canvas.width = size;
			canvas.height = size;
			canvas.style.width = "100vw";
			canvas.style.height = "100vh";
		};

		const draw = () => {
			const imageData = ctx.createImageData(size, size);
			const data = imageData.data;
			for (let i = 0; i < data.length; i += 4) {
				const value = Math.random() * 255;
				data[i] = value;
				data[i + 1] = value;
				data[i + 2] = value;
				data[i + 3] = alpha;
			}
			ctx.putImageData(imageData, 0, 0);
		};

		const loop = () => {
			if (frame % refreshInterval === 0) draw();
			frame++;
			animationId = window.requestAnimationFrame(loop);
		};

		window.addEventListener("resize", resize);
		resize();
		loop();

		return () => {
			window.removeEventListener("resize", resize);
			window.cancelAnimationFrame(animationId);
		};
	}, [refreshInterval, alpha]);

	return (
		<canvas
			ref={canvasRef}
			className="pointer-events-none absolute inset-0 z-[1]"
			style={{ imageRendering: "pixelated" }}
		/>
	);
};

/**
 * SwissGridBackground - Redesigned Refined Unified Background
 *
 * Aesthetic:
 * - Dark Mode: Deep black base + subtle green spotlight + masked grid + high-fidelity canvas grain.
 * - Light Mode: Clean white base + very subtle structure grid (no grain).
 */
export function SwissGridBackground() {
	const { resolvedTheme } = useTheme();
	const prefersReducedMotion = useReducedMotion();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const isDark = resolvedTheme === "dark";

	return (
		<div
			className="fixed inset-0 -z-10 overflow-hidden select-none pointer-events-none"
			aria-hidden="true"
			style={{
				backgroundColor: isDark ? "#050505" : "#ffffff",
			}}
		>
			{/* 1. Subtle Ambient Glow (Dark Mode Only) */}
			{isDark && (
				<div
					className="absolute inset-0 z-0 opacity-100 transition-opacity duration-1000"
					style={{
						background: `radial-gradient(circle 900px at 50% 20%, oklch(0.2 0.01 60 / 0.15), transparent 70%)`,
					}}
				/>
			)}

			{/* 2. Grid Layer - Very Subtle */}
			<div
				className="absolute inset-0 z-[2]"
				style={{
					backgroundImage: `
            linear-gradient(to right, ${isDark ? "rgba(255, 255, 255, 0.018)" : "rgba(0, 0, 0, 0.012)"} 1px, transparent 1px),
            linear-gradient(to bottom, ${isDark ? "rgba(255, 255, 255, 0.018)" : "rgba(0, 0, 0, 0.012)"} 1px, transparent 1px)
          `,
					backgroundSize: "64px 64px",
					maskImage: isDark
						? "radial-gradient(ellipse 70% 50% at 50% 30%, #000 0%, transparent 100%)"
						: "none",
					WebkitMaskImage: isDark
						? "radial-gradient(ellipse 70% 50% at 50% 30%, #000 0%, transparent 100%)"
						: "none",
				}}
			/>

			{/* 3. High-Fidelity Grain (Dark Mode Only - Radiating from center) */}
			{isDark && !prefersReducedMotion && (
				<div
					className="absolute inset-0 z-[1]"
					style={{
						maskImage:
							"radial-gradient(circle 60% at 50% 40%, #000 0%, transparent 100%)",
						WebkitMaskImage:
							"radial-gradient(circle 60% at 50% 40%, #000 0%, transparent 100%)",
					}}
				>
					<Noise refreshInterval={5} alpha={3} />
				</div>
			)}

			{/* 4. Vignette / Depth Fade */}
			<div
				className="absolute inset-0 z-[3]"
				style={{
					background: isDark
						? "linear-gradient(to bottom, transparent 0%, #050505 100%)"
						: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.1) 100%)",
				}}
			/>
		</div>
	);
}

export default SwissGridBackground;
