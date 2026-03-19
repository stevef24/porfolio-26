"use client";

/* ─────────────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — RuntimeSystem
 *
 *    0ms   Stage 0  Model node fades in (left)
 *                   Single "Runtime" box (right) with title centered
 *
 *  400ms   Stage 1  Arrow draws Model → Runtime
 *
 *  900ms   Stage 2  "Runtime" title moves to top-left corner
 *                   Container expands to 2×2 grid
 *                   Box 1 blur-fades in: "Loop Control" (top-left)
 *
 * 1300ms   Stage 3  Box 2 blur-fades in: "Tool Execution" (top-right)
 *
 * 1700ms   Stage 4  Box 3 blur-fades in: "Rule Enforcement" (bottom-left)
 *
 * 2100ms   Stage 5  Box 4 blur-fades in: "Context Shaping" (bottom-right)
 *
 * 2700ms   Stage 6  Pulse dot travels Model → Runtime (handoff)
 *
 * 3200ms   Stage 7  Settled. Replay available.
 *
 * Core idea: The model decides. The runtime executes.
 * Reduced motion: Full 2×2 grid, Model left, arrow drawn.
 * ───────────────────────────────────────────────────────────────── */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { VisualWrapper } from "./VisualWrapper";

/* ── Timing ────────────────────────────────────────────────────── */
const TIMING = {
	arrow: 400, // arrow draws in
	expand: 900, // container expands, box 1 appears
	box2: 1300, // Tool Execution
	box3: 1700, // Rule Enforcement
	box4: 2100, // Context Shaping
	pulse: 2700, // arrow pulse
	settled: 3200, // done
} as const;

/* ── Icon shade tokens (shared with AgentLoopComparison) ──────── */
const ICON_VARS = {
	"--icon-s1": "color-mix(in oklch, var(--va-fg) 90%, transparent)",
	"--icon-s2": "color-mix(in oklch, var(--va-fg) 60%, transparent)",
	"--icon-s3": "color-mix(in oklch, var(--va-fg) 40%, transparent)",
	"--icon-s4": "color-mix(in oklch, var(--va-fg) 25%, transparent)",
	"--icon-stroke": "var(--sf-border-subtle)",
} as Record<string, string>;

/* ── Layout ────────────────────────────────────────────────────── */
const ICON_SIZE = 36; // smaller LLM pyramid
const BOX_W = 96; // responsibility box width
const BOX_H = 52; // responsibility box height
const GAP = 6; // gap between boxes
const PAD = 8; // container inner padding
const TITLE_H = 20; // space for "Runtime" corner label
const GRID_W = BOX_W * 2 + GAP;
const GRID_H = BOX_H * 2 + GAP;

/* Container always at expanded size — no layout shift */
const CONTAINER_W = GRID_W + PAD * 2;
const CONTAINER_H = GRID_H + PAD * 2 + TITLE_H;

/* ── Springs ───────────────────────────────────────────────────── */
const LAYOUT_SPRING = {
	type: "spring" as const,
	visualDuration: 0.5,
	bounce: 0.12,
};

const BLUR_IN = {
	type: "spring" as const,
	visualDuration: 0.4,
	bounce: 0.05,
};

/* ── Box config ────────────────────────────────────────────────── */
/* Monochrome per rulebook Rule 4: no decorative color.
 * All boxes use the neutral surface system. Labels carry meaning. */
const BOXES = [
	{ label: "Loop Control" },
	{ label: "Tool Execution" },
	{ label: "Rule Enforcement" },
	{ label: "Context Shaping" },
] as const;

/* ═══════════════════════════════════════════════════════════════
 * Isometric LLM pyramid (reused from AgentLoopComparison)
 * ═══════════════════════════════════════════════════════════════ */

function LlmSvg() {
	return (
		<svg
			width={ICON_SIZE}
			height={ICON_SIZE}
			viewBox="0 0 200 200"
			fill="none"
		>
			<path
				d="m12.66 100 86.71-90.58 87.46 90.58-87.35 97.41-86.82-97.41z"
				fill="var(--icon-s2)"
			/>
			<path
				d="m12.66 100 86.71-90.58-0.08 136.3-86.63-45.73z"
				fill="var(--icon-s4)"
			/>
			<path
				d="m99.37 9.42 87.46 90.58-87.54 45.73 0.08-136.3z"
				fill="var(--icon-s2)"
			/>
			<path
				d="m99.29 197.4 87.39-97.41-87.47 45.69 0.08 51.72z"
				fill="var(--icon-s1)"
			/>
			<rect x="132.1" y="2.6" width="5.2" height="25.5" rx="2.6" fill="var(--icon-s4)" />
			<rect x="149.8" y="16.6" width="5.2" height="21" rx="2.6" fill="var(--icon-s4)" transform="rotate(45 152.4 27)" />
			<rect x="160.4" y="52.3" width="26.7" height="5.2" rx="2.6" fill="var(--icon-s4)" />
		</svg>
	);
}

/* ═══════════════════════════════════════════════════════════════
 * Horizontal arrow with draw + pulse
 * ═══════════════════════════════════════════════════════════════ */

function HorizontalArrow({
	drawn,
	pulse,
	isReduced,
}: {
	drawn: boolean;
	pulse: boolean;
	isReduced: boolean;
}) {
	const w = 48;
	const h = 20;
	const tip = 5;

	return (
		<motion.svg
			width={w}
			height={h}
			viewBox={`0 0 ${w} ${h}`}
			className="shrink-0"
			style={{ overflow: "visible" }}
		>
			<motion.line
				x1={0}
				y1={h / 2}
				x2={w - tip}
				y2={h / 2}
				stroke="var(--va-fg-muted)"
				strokeWidth={1.5}
				initial={{ pathLength: isReduced ? 1 : 0 }}
				animate={{ pathLength: drawn ? 1 : 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			/>
			<motion.path
				d={`M${w - tip * 2} ${h / 2 - tip} L${w} ${h / 2} L${w - tip * 2} ${h / 2 + tip}`}
				stroke="var(--va-fg-muted)"
				strokeWidth={1.5}
				fill="none"
				initial={{ opacity: isReduced ? 1 : 0 }}
				animate={{ opacity: drawn ? 1 : 0 }}
				transition={{ delay: drawn ? 0.35 : 0, duration: 0.2 }}
			/>
			{pulse && !isReduced && (
				<motion.circle
					r={3}
					fill="var(--va-accent)"
					initial={{ cx: 0, cy: h / 2, opacity: 0 }}
					animate={{ cx: [0, w, w], cy: h / 2, opacity: [0, 1, 0] }}
					transition={{ duration: 0.8, ease: "easeInOut" }}
				/>
			)}
		</motion.svg>
	);
}

/* ═══════════════════════════════════════════════════════════════
 * Main component
 * ═══════════════════════════════════════════════════════════════ */

export function RuntimeSystem() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.3 });
	const isReduced = useReducedMotion() ?? false;

	const [stage, setStage] = useState(0);
	const [replayKey, setReplayKey] = useState(0);

	const handleReplay = useCallback(() => {
		setStage(0);
		setReplayKey((k) => k + 1);
	}, []);

	useEffect(() => {
		if (!isInView) {
			setStage(0);
			return;
		}
		if (isReduced) {
			setStage(7);
			return;
		}

		setStage(0);
		const t: ReturnType<typeof setTimeout>[] = [];
		t.push(setTimeout(() => setStage(1), TIMING.arrow));
		t.push(setTimeout(() => setStage(2), TIMING.expand));
		t.push(setTimeout(() => setStage(3), TIMING.box2));
		t.push(setTimeout(() => setStage(4), TIMING.box3));
		t.push(setTimeout(() => setStage(5), TIMING.box4));
		t.push(setTimeout(() => setStage(6), TIMING.pulse));
		t.push(setTimeout(() => setStage(7), TIMING.settled));
		return () => t.forEach(clearTimeout);
	}, [isInView, isReduced, replayKey]);

	return (
		<VisualWrapper
			label="The model decides. The runtime executes, enforces, and shapes context."
			tone="blue"
			onReplay={handleReplay}
			showReplay={stage >= 7}
		>
			<div
				ref={ref}
				className="flex items-center justify-center gap-3 sm:gap-5"
				style={ICON_VARS}
			>
				{/* ── Model node ── */}
				<div className="flex flex-col items-center gap-1.5 shrink-0">
					<motion.div
						initial={{
							opacity: isReduced ? 1 : 0,
							scale: isReduced ? 1 : 0.85,
						}}
						animate={{ opacity: 1, scale: 1 }}
						transition={LAYOUT_SPRING}
					>
						<LlmSvg />
					</motion.div>
					<span
						className="text-[10px] font-mono uppercase tracking-wider"
						style={{ color: "var(--va-fg-muted)" }}
					>
						Model
					</span>
				</div>

				{/* ── Arrow ── */}
				<HorizontalArrow
					drawn={stage >= 1}
					pulse={stage === 6}
					isReduced={isReduced}
				/>

				{/* ── Runtime container — fixed size, no layout shift ── */}
				<div
					className="relative shrink-0 overflow-hidden"
					style={{
						width: CONTAINER_W,
						height: CONTAINER_H,
						borderRadius: 8,
						border: "1px solid var(--sf-border-subtle)",
						backgroundColor: "var(--sf-bg-subtle)",
					}}
				>
					{/* "Runtime" title — always top-left */}
					<span
						className="absolute text-[10px] font-mono uppercase tracking-widest select-none font-semibold"
						style={{
							color: "var(--va-fg)",
							top: 5,
							left: PAD,
						}}
					>
						Runtime
					</span>

					{/* ── 2×2 grid of responsibility boxes ── */}
					<div
						className="absolute grid grid-cols-2"
						style={{
							top: TITLE_H + PAD - 6,
							left: PAD,
							width: GRID_W,
							height: GRID_H,
							gap: GAP,
						}}
					>
						{BOXES.map((box, i) => {
							const visible = stage >= i + 2 || isReduced;
							return (
								<motion.div
									key={box.label}
									className="flex items-center justify-center text-center px-3 py-2"
									style={{
										width: BOX_W,
										height: BOX_H,
										borderRadius: 5,
										backgroundColor: "var(--sf-bg-muted)",
										border: "1px solid var(--sf-border-subtle)",
									}}
									initial={
										isReduced
											? { opacity: 1, filter: "blur(0px)", scale: 1 }
											: { opacity: 0, filter: "blur(8px)", scale: 0.92 }
									}
									animate={
										visible
											? { opacity: 1, filter: "blur(0px)", scale: 1 }
											: { opacity: 0, filter: "blur(8px)", scale: 0.92 }
									}
									transition={BLUR_IN}
								>
									<span
										className="text-[9px] font-mono uppercase tracking-wider leading-tight select-none font-medium"
										style={{ color: "var(--va-fg)" }}
									>
										{box.label}
									</span>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</VisualWrapper>
	);
}
