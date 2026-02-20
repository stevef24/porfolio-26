"use client";

/*
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  STORYBOARD — Codex Orchestration Loop                         │
 * │                                                                 │
 * │  0 ms   Stage 0  Plan node fades in                            │
 * │  400     Stage 1  Arrow draws → Implement node fades in        │
 * │  800     Stage 2  Arrow draws → CI node fades in               │
 * │  1200    Stage 3  Arrow draws → Review node fades in           │
 * │  1600    Stage 4  Loop arrow draws back to Plan, pulse glow    │
 * │  2400    Stage 5  All nodes settle                              │
 * │                                                                 │
 * │  Layout (top-down):                                            │
 * │                                                                 │
 * │         ┌──────┐    ┌───────────┐    ┌────┐    ┌────────┐     │
 * │         │ Plan │───▶│ Implement │───▶│ CI │───▶│ Review │     │
 * │         └──┬───┘    └───────────┘    └────┘    └───┬────┘     │
 * │            │                                       │           │
 * │            └───────────── ◀ ────────────────────────┘           │
 * │                        Repeat                                   │
 * └─────────────────────────────────────────────────────────────────┘
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualWrapper } from "./VisualWrapper";

/* ── Timing ────────────────────────────────────────────────────── */
const TIMING = {
	stageGap: 400,
	loopArrow: 1600,
	settle: 2400,
} as const;

/* ── Node config ───────────────────────────────────────────────── */
const NODES = [
	{ id: "plan", label: "Plan" },
	{ id: "implement", label: "Implement" },
	{ id: "ci", label: "CI" },
	{ id: "review", label: "Review" },
] as const;

const ACCENT = "var(--va-fg)";
const DIM = "var(--sf-border-subtle)";
const TEXT_DIM = "var(--sf-text-tertiary)";
const TEXT_ON = "var(--sf-text-primary)";
const SURFACE = "var(--sf-bg-surface)";

/* ── SVG layout ────────────────────────────────────────────────── */
const NODE_W = 88;
const NODE_H = 32;
const GAP = 36;
const SVG_W = NODES.length * NODE_W + (NODES.length - 1) * GAP;
const SVG_H = NODE_H + 48; // room for loop arrow below
const Y_MID = NODE_H / 2;

function nodeX(i: number) {
	return i * (NODE_W + GAP);
}

export function CodexOrchestrationLoop({
	className,
}: {
	className?: string;
}) {
	const prefersReducedMotion = useReducedMotion();
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.3 });

	// stage: -1 = idle, 0-3 = nodes, 4 = loop arrow, 5 = settled
	const [stage, setStage] = useState<number>(prefersReducedMotion ? 5 : -1);
	const [hasPlayed, setHasPlayed] = useState(!!prefersReducedMotion);

	const runSequence = useCallback(() => {
		if (prefersReducedMotion) return;
		setStage(-1);
		setHasPlayed(true);

		for (let s = 0; s <= 5; s++) {
			const delay =
				s <= 3
					? s * TIMING.stageGap
					: s === 4
						? TIMING.loopArrow
						: TIMING.settle;
			setTimeout(() => setStage(s), delay);
		}
	}, [prefersReducedMotion]);

	useEffect(() => {
		if (isInView && !hasPlayed) {
			const t = setTimeout(runSequence, 300);
			return () => clearTimeout(t);
		}
	}, [isInView, hasPlayed, runSequence]);

	const handleReplay = () => {
		setHasPlayed(false);
		setTimeout(runSequence, 50);
	};

	const isReduced = !!prefersReducedMotion;

	return (
		<VisualWrapper
			label="Codex orchestration loop diagram"
			className={className}
			tone="neutral"
			showCaption={false}
		>
			<div
				ref={ref}
				className="relative flex w-full flex-col items-center py-4"
			>
				{hasPlayed && !isReduced && (
					<button
						onClick={handleReplay}
						aria-label="Replay loop animation"
						className={cn(
							"absolute right-0 top-0",
							"text-[10px] uppercase tracking-[0.08em]",
							"px-2 py-1 rounded border",
							"border-[var(--sf-border-subtle)]",
							"hover:border-[var(--va-blue)]",
							"transition-colors duration-150",
							"cursor-pointer",
						)}
						style={{
							color: TEXT_DIM,
							backgroundColor: "var(--sf-bg-subtle)",
						}}
					>
						Replay
					</button>
				)}
				<svg
					viewBox={`-4 -4 ${SVG_W + 8} ${SVG_H + 8}`}
					className="block w-full max-w-[520px]"
					fill="none"
					role="img"
					aria-label="Orchestration loop: Plan, Implement, CI, Review, Repeat"
				>
					{/* Forward arrows between nodes */}
					{NODES.slice(0, -1).map((_, i) => {
						const x1 = nodeX(i) + NODE_W;
						const x2 = nodeX(i + 1);
						const visible = isReduced || stage > i;

						return (
							<g key={`arrow-${i}`}>
								<motion.line
									x1={x1 + 4}
									y1={Y_MID}
									x2={x2 - 4}
									y2={Y_MID}
									stroke={ACCENT}
									strokeWidth={1.5}
									strokeLinecap="round"
									initial={{ pathLength: 0, opacity: 0 }}
									animate={
										visible
											? { pathLength: 1, opacity: 1 }
											: { pathLength: 0, opacity: 0 }
									}
									transition={
										isReduced
											? { duration: 0 }
											: { duration: 0.3, ease: "easeOut" }
									}
								/>
								<motion.polyline
									points={`${x2 - 10},${Y_MID - 4} ${x2 - 4},${Y_MID} ${x2 - 10},${Y_MID + 4}`}
									stroke={ACCENT}
									strokeWidth={1.5}
									strokeLinecap="round"
									strokeLinejoin="round"
									initial={{ opacity: 0 }}
									animate={visible ? { opacity: 1 } : { opacity: 0 }}
									transition={
										isReduced
											? { duration: 0 }
											: { duration: 0.15, delay: 0.2 }
									}
								/>
							</g>
						);
					})}

					{/* Loop-back arrow: Review → Plan (below) */}
					{(() => {
						const startX = nodeX(3) + NODE_W / 2;
						const endX = nodeX(0) + NODE_W / 2;
						const loopY = NODE_H + 24;
						const d = `M ${startX} ${NODE_H} L ${startX} ${loopY} L ${endX} ${loopY} L ${endX} ${NODE_H}`;
						const visible = isReduced || stage >= 4;

						return (
							<g>
								<motion.path
									d={d}
									stroke={ACCENT}
									strokeWidth={1.5}
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeDasharray="4 3"
									initial={{ pathLength: 0, opacity: 0 }}
									animate={
										visible
											? { pathLength: 1, opacity: 0.6 }
											: { pathLength: 0, opacity: 0 }
									}
									transition={
										isReduced
											? { duration: 0 }
											: { duration: 0.6, ease: "easeOut" }
									}
								/>
								<motion.polyline
									points={`${endX - 4},${NODE_H + 6} ${endX},${NODE_H} ${endX + 4},${NODE_H + 6}`}
									stroke={ACCENT}
									strokeWidth={1.5}
									strokeLinecap="round"
									strokeLinejoin="round"
									initial={{ opacity: 0 }}
									animate={visible ? { opacity: 0.6 } : { opacity: 0 }}
									transition={
										isReduced
											? { duration: 0 }
											: { duration: 0.15, delay: 0.5 }
									}
								/>
							</g>
						);
					})()}

					{/* Nodes */}
					{NODES.map((node, i) => {
						const x = nodeX(i);
						const active = isReduced || stage >= i;
						const isCurrent = stage === i && !isReduced;

						return (
							<motion.g
								key={node.id}
								initial={{ opacity: 0, y: 6 }}
								animate={
									active
										? { opacity: 1, y: 0 }
										: { opacity: 0, y: 6 }
								}
								transition={
									isReduced
										? { duration: 0 }
										: {
												type: "spring",
												visualDuration: 0.3,
												bounce: 0.15,
											}
								}
							>
								<rect
									x={x}
									y={0}
									width={NODE_W}
									height={NODE_H}
									rx={3}
									fill={SURFACE}
									stroke={active ? ACCENT : DIM}
									strokeWidth={isCurrent ? 2 : 1}
								/>
								{/* Subtle pulse glow on active node */}
								{isCurrent && (
									<motion.rect
										x={x - 2}
										y={-2}
										width={NODE_W + 4}
										height={NODE_H + 4}
										rx={5}
										fill="none"
										stroke={ACCENT}
										strokeWidth={1}
										initial={{ opacity: 0 }}
										animate={{ opacity: [0, 0.4, 0] }}
										transition={{
											duration: 1.2,
											repeat: Infinity,
											ease: "easeInOut",
										}}
									/>
								)}
								<text
									x={x + NODE_W / 2}
									y={Y_MID + 1}
									textAnchor="middle"
									dominantBaseline="central"
									fill={active ? TEXT_ON : TEXT_DIM}
									fontSize={11}
									fontFamily="var(--font-code), monospace"
									letterSpacing="0.04em"
								>
									{node.label}
								</text>
							</motion.g>
						);
					})}
				</svg>
			</div>
		</VisualWrapper>
	);
}
