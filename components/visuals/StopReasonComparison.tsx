"use client";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — StopReasonComparison
 *
 * Toggle: Naive → Correct
 *
 *    0ms   Title blur-morphs between states
 *          JSON box layout-animates to new size
 *          Content cross-fades, verdict badge morphs ✗ ↔ ✓
 *  300ms   Settled
 *
 * Flow:  [Runtime icon + ✗/✓] → [compact JSON] → [LLM icon]
 *
 * The runtime sends the message to the LLM.
 * Naive: runtime checks content type (wrong signal)
 * Correct: runtime checks stop_reason (reliable signal)
 *
 * Reduced motion: correct state shown statically
 * ───────────────────────────────────────────────────────── */

import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import {
	motion,
	AnimatePresence,
	useInView,
	useReducedMotion,
} from "motion/react";
import { VisualWrapper } from "./VisualWrapper";

/* ── Layout ───────────────────────────────────────────── */
const CANVAS_W = 440;

/* ── Color tokens ─────────────────────────────────────── */
const GREEN = "var(--va-green)";
const RED = "var(--va-red)";
const FG = "var(--va-fg)";
const FG_MUTED = "var(--va-fg-muted)";
const SURFACE = "var(--sf-bg-surface)";

const LAYOUT_SPRING = {
	type: "spring" as const,
	visualDuration: 0.25,
	bounce: 0.06,
};

const BADGE_SPRING = {
	type: "spring" as const,
	visualDuration: 0.15,
	bounce: 0.2,
};

/* ── Icon vars ────────────────────────────────────────── */
const ICON_VARS = {
	"--icon-s1": "color-mix(in oklch, var(--va-fg) 90%, transparent)",
	"--icon-s2": "color-mix(in oklch, var(--va-fg) 60%, transparent)",
	"--icon-s3": "color-mix(in oklch, var(--va-fg) 40%, transparent)",
	"--icon-s4": "color-mix(in oklch, var(--va-fg) 25%, transparent)",
	"--icon-stroke": "var(--sf-border-subtle)",
} as Record<string, string>;

/* ── Isometric SVG icons ──────────────────────────────── */
function LLMIcon() {
	return (
		<svg width={28} height={28} viewBox="0 0 200 200" fill="none">
			<path d="m12.66 100 86.71-90.58 87.46 90.58-87.35 97.41-86.82-97.41z" fill="var(--icon-s2)" />
			<path d="m12.66 100 86.71-90.58-0.08 136.3-86.63-45.73z" fill="var(--icon-s4)" />
			<path d="m99.37 9.42 87.46 90.58-87.54 45.73 0.08-136.3z" fill="var(--icon-s2)" />
			<path d="m99.29 197.4 87.39-97.41-87.47 45.69 0.08 51.72z" fill="var(--icon-s1)" />
			<rect x="132.1" y="2.6" width="5.2" height="25.5" rx="2.6" fill="var(--icon-s4)" />
			<rect x="149.8" y="16.6" width="5.2" height="21" rx="2.6" fill="var(--icon-s4)" transform="rotate(45 152.4 27)" />
			<rect x="160.4" y="52.3" width="26.7" height="5.2" rx="2.6" fill="var(--icon-s4)" />
		</svg>
	);
}

function RuntimeIcon() {
	return (
		<svg width={28} height={28} viewBox="0 0 250 250" fill="none">
			<path d="m7.35 101.7 117.4-67.27 117.9 67.45v35.25l-117.7 69.25-117.7-69.25v-35.43z" fill="var(--icon-s1)" />
			<path d="m124.7 34.46-117.4 67.27 117.4 67.95 117.9-67.59-118-67.63z" fill="var(--icon-s2)" />
			<path d="m124.6 39.07-109.7 63.1 109.8 63.02 109.5-63.28-109.6-62.84z" fill="var(--icon-s3)" />
		</svg>
	);
}

/* ── Main component ───────────────────────────────────── */
export function StopReasonComparison({ className }: { className?: string }) {
	const prefersReducedMotion = useReducedMotion();
	const isReduced = !!prefersReducedMotion;
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.3 });
	const [mode, setMode] = useState<"naive" | "correct">(
		isReduced ? "correct" : "naive",
	);
	const [hasAutoToggled, setHasAutoToggled] = useState(isReduced);

	const isCorrect = mode === "correct";
	const accent = isCorrect ? GREEN : RED;

	useEffect(() => {
		if (isInView && !hasAutoToggled && !isReduced) {
			const t = setTimeout(() => {
				setMode("correct");
				setHasAutoToggled(true);
			}, 1800);
			return () => clearTimeout(t);
		}
	}, [isInView, hasAutoToggled, isReduced]);

	const handleToggle = useCallback(
		(index: number) => {
			const newMode = index === 0 ? "naive" : "correct";
			if (newMode !== mode) {
				setMode(newMode);
				setHasAutoToggled(true);
			}
		},
		[mode],
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	const [containerWidth, setContainerWidth] = useState(CANVAS_W);

	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const update = () => {
			const w = el.clientWidth;
			setContainerWidth(w);
			setScale(Math.min(1, w / CANVAS_W));
		};
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return (
		<VisualWrapper
			label="Stop reason comparison"
			className={className}
			tone="neutral"
			showCaption={false}
			toggle={{
				options: ["Naive", "Correct"],
				value: isCorrect ? 1 : 0,
				onChange: handleToggle,
			}}
		>
			<div
				ref={ref}
				className="relative flex w-full flex-col items-center gap-4 py-3"
				style={ICON_VARS as React.CSSProperties}
			>
				{/* Title — blur morphs */}
				<AnimatePresence mode="wait">
					<motion.h3
						key={mode}
						className="text-[13px] font-mono uppercase tracking-wider"
						style={{ color: "var(--sf-text-primary)" }}
						initial={isReduced ? {} : { opacity: 0, filter: "blur(4px)" }}
						animate={{ opacity: 1, filter: "blur(0px)" }}
						exit={isReduced ? {} : { opacity: 0, filter: "blur(4px)" }}
						transition={{ duration: 0.25 }}
					>
						{isCorrect ? "Checking stop_reason" : "Checking content type"}
					</motion.h3>
				</AnimatePresence>

				{/* Scaled canvas */}
				<div ref={containerRef} className="w-full">
					<div
						style={{
							width: CANVAS_W,
							transform: `scale(${scale})`,
							transformOrigin: "top left",
							marginLeft: (containerWidth - CANVAS_W * scale) / 2,
						}}
					>
						{/* Flow: Runtime → JSON → LLM */}
						<motion.div
							layout
							className="flex items-center justify-center gap-3"
							transition={isReduced ? { duration: 0 } : LAYOUT_SPRING}
						>
							{/* Runtime node with verdict badge */}
							<motion.div layout className="flex flex-col items-center gap-1 shrink-0" transition={isReduced ? { duration: 0 } : LAYOUT_SPRING}>
								<div
									className="relative flex items-center justify-center rounded-[3px]"
									style={{ width: 44, height: 44, backgroundColor: SURFACE }}
								>
									<RuntimeIcon />
									<motion.span
										layoutId="stop-verdict-badge"
										className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-mono font-bold"
										animate={{
											backgroundColor: accent,
											scale: [0.85, 1],
										}}
										style={{
											width: 16,
											height: 16,
											color: "oklch(1 0 0)",
										}}
										transition={isReduced ? { duration: 0 } : BADGE_SPRING}
									>
										{isCorrect ? "✓" : "✗"}
									</motion.span>
								</div>
								<span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: FG_MUTED }}>
									Runtime
								</span>
							</motion.div>

							{/* Arrow → */}
							<motion.div layout transition={isReduced ? { duration: 0 } : LAYOUT_SPRING}>
								<Arrow />
							</motion.div>

							{/* JSON block — layout animates size smoothly */}
							<motion.div
								layout
								className="rounded-[4px] overflow-hidden shrink-0"
								style={{
									backgroundColor: "var(--code-block-bg)",
									border: "1px solid var(--code-block-border)",
									boxShadow: "var(--code-block-shadow)",
								}}
								transition={isReduced ? { duration: 0 } : LAYOUT_SPRING}
							>
								<AnimatePresence mode="popLayout">
									<motion.pre
										key={mode}
										layout
										className="m-0 whitespace-pre px-3 py-2"
										style={{
											fontFamily: "var(--code-font-family)",
											fontSize: "11px",
											lineHeight: "18px",
											letterSpacing: "-0.01em",
										}}
										initial={isReduced ? {} : { opacity: 0, filter: "blur(3px)" }}
										animate={{ opacity: 1, filter: "blur(0px)" }}
										exit={isReduced ? {} : { opacity: 0, filter: "blur(3px)" }}
										transition={{ duration: 0.1 }}
									>
										{isCorrect ? (
											<>
												<Ln><M>{"{ "}</M><K>{'"stop_reason"'}</K><M>{": "}</M><Hi color={GREEN}>{'"end_turn"'}</Hi><M>{","}</M></Ln>
												<Ln><M>{"  "}</M><K>{'"content"'}</K><M>{": "}</M><K>{'"Done."'}</K><M>{" }"}</M></Ln>
											</>
										) : (
											<>
												<Ln><M>{"{ "}</M><K>{'"content"'}</K><M>{": [{ "}</M><K>{'"type"'}</K><M>{": "}</M><Hi color={RED}>{'"text"'}</Hi><M>{" }],"}</M></Ln>
												<Ln><M>{"  "}</M><K>{'"text"'}</K><M>{": "}</M><K>{'"Done."'}</K><M>{" }"}</M></Ln>
											</>
										)}
									</motion.pre>
								</AnimatePresence>
							</motion.div>

							{/* Arrow → */}
							<motion.div layout transition={isReduced ? { duration: 0 } : LAYOUT_SPRING}>
								<Arrow />
							</motion.div>

							{/* LLM node */}
							<motion.div layout className="flex flex-col items-center gap-1 shrink-0" transition={isReduced ? { duration: 0 } : LAYOUT_SPRING}>
								<div
									className="flex items-center justify-center rounded-[3px]"
									style={{ width: 44, height: 44, backgroundColor: SURFACE }}
								>
									<LLMIcon />
								</div>
								<span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: FG_MUTED }}>
									LLM
								</span>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</div>
		</VisualWrapper>
	);
}

/* ── Tiny arrow ───────────────────────────────────────── */
function Arrow() {
	return (
		<svg width="20" height="10" viewBox="0 0 20 10" fill="none" className="shrink-0">
			<line x1="0" y1="5" x2="14" y2="5" stroke={FG_MUTED} strokeWidth="1.5" strokeLinecap="round" />
			<polyline points="11,2 15,5 11,8" fill="none" stroke={FG_MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

/* ── Syntax primitives ────────────────────────────────── */
function Ln({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
function M({ children }: { children: React.ReactNode }) {
	return <span style={{ color: FG_MUTED }}>{children}</span>;
}
function K({ children }: { children: React.ReactNode }) {
	return <span style={{ color: FG }}>{children}</span>;
}
function Hi({ children, color }: { children: React.ReactNode; color: string }) {
	return <span style={{ color, fontWeight: 600 }}>{children}</span>;
}
