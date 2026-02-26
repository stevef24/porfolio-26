"use client";

/**
 * PageHeaderShader — reusable full-bleed mesh gradient header background.
 * Mirrors BlogHeroHeader's shader stack (MeshGradient + PaperTexture + edge fades)
 * but accepts a CSS token prefix so each page can have its own colour palette.
 *
 * Reads colours from CSS custom properties so light/dark mode switches
 * automatically via a MutationObserver on document.documentElement.
 */

import { MeshGradient, PaperTexture } from "@paper-design/shaders-react";
import { useReducedMotion } from "motion/react";
import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderShaderProps {
	/** CSS variable prefix, e.g. "--blog-list-hero" or "--experiments-hero" */
	tokenPrefix: string;
	/** Fallback colours if CSS vars aren't resolved yet (light mode values) */
	fallbackMesh: [string, string, string, string];
	children: ReactNode;
	className?: string;
}

export function PageHeaderShader({
	tokenPrefix,
	fallbackMesh,
	children,
	className,
}: PageHeaderShaderProps) {
	const prefersReducedMotion = useReducedMotion();
	const [mounted, setMounted] = useState(false);
	const [colors, setColors] =
		useState<[string, string, string, string]>(fallbackMesh);
	const [paperFront, setPaperFront] = useState("rgb(102 102 102)");
	const [paperBack, setPaperBack] = useState("rgb(255 255 255)");

	useEffect(() => {
		setMounted(true);
		const root = document.documentElement;

		const sync = () => {
			const styles = getComputedStyle(root);
			const get = (token: string, fb: string) =>
				styles.getPropertyValue(token).trim() || fb;

			setColors([
				get(`${tokenPrefix}-mesh-1`, fallbackMesh[0]),
				get(`${tokenPrefix}-mesh-2`, fallbackMesh[1]),
				get(`${tokenPrefix}-mesh-3`, fallbackMesh[2]),
				get(`${tokenPrefix}-mesh-4`, fallbackMesh[3]),
			] as [string, string, string, string]);
			setPaperFront(get(`${tokenPrefix}-paper-front`, "rgb(102 102 102)"));
			setPaperBack(get(`${tokenPrefix}-paper-back`, "rgb(255 255 255)"));
		};

		sync();

		const observer = new MutationObserver(sync);
		observer.observe(root, {
			attributes: true,
			attributeFilter: ["class", "style", "data-theme"],
		});
		return () => observer.disconnect();
	}, [tokenPrefix]);

	return (
		<div className={cn("relative overflow-hidden", className)}>
			{/* Mesh gradient */}
			{mounted && (
				<div className="absolute inset-0">
					<MeshGradient
						colors={colors}
						speed={prefersReducedMotion ? 0 : 0.15}
						distortion={0.65}
						swirl={0.45}
						style={{ position: "absolute", width: "100%", height: "100%" }}
					/>
				</div>
			)}

			{/* Radial vignette — light so gradient shows through */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background: `radial-gradient(
						ellipse 100% 100% at 50% 50%,
						transparent 0%,
						transparent 65%,
						rgba(var(--background-rgb), 0.15) 85%,
						var(--background) 100%
					)`,
				}}
			/>

			{/* Left edge fade — narrower so gradient is visible */}
			<div
				className="absolute inset-y-0 left-0 w-[28%] pointer-events-none"
				style={{
					background: `linear-gradient(to right,
						var(--background) 0%,
						rgba(var(--background-rgb), 0.8) 35%,
						rgba(var(--background-rgb), 0.3) 70%,
						transparent 100%
					)`,
				}}
			/>

			{/* Right edge fade */}
			<div
				className="absolute inset-y-0 right-0 w-[28%] pointer-events-none"
				style={{
					background: `linear-gradient(to left,
						var(--background) 0%,
						rgba(var(--background-rgb), 0.8) 35%,
						rgba(var(--background-rgb), 0.3) 70%,
						transparent 100%
					)`,
				}}
			/>

			{/* Bottom edge fade */}
			<div
				className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
				style={{
					background: `linear-gradient(to top,
						var(--background) 0%,
						rgba(var(--background-rgb), 0.7) 40%,
						rgba(var(--background-rgb), 0.1) 80%,
						transparent 100%
					)`,
				}}
			/>

			{/* Paper texture — light mode */}
			{mounted && (
				<>
					<div className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay dark:hidden">
						<PaperTexture
							colorFront={paperFront}
							colorBack={paperBack}
							scale={1.5}
							contrast={0.2}
							style={{ position: "absolute", width: "100%", height: "100%" }}
						/>
					</div>
					{/* Paper texture — dark mode */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-soft-light hidden dark:block">
						<PaperTexture
							colorFront={paperFront}
							colorBack={paperBack}
							scale={1.5}
							contrast={0.15}
							style={{ position: "absolute", width: "100%", height: "100%" }}
						/>
					</div>
				</>
			)}

			{/* Content layer */}
			<div className="relative z-10">{children}</div>
		</div>
	);
}
