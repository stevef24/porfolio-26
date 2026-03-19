"use client";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — ContextFilterDiagram
 *
 *  300ms   Stage 1: Context items fade in staggered (left column)
 *  900ms   Stage 2: Runtime + LLM nodes fade/scale in
 * 1400ms   Stage 3: Selection — kept items get green border, dimmed get red
 * 2400ms   Stage 4: Converging arrows draw from items → Runtime
 * 3200ms   Stage 5: Gradient loop arrows draw (Runtime ↔ Model)
 * 4000ms   Settled
 *
 * Layout (horizontal):
 *
 *   [Conversation ]         ╭──────╮  ╭→ ╭──────╮
 *   [Tool Results ] ──→     │Runtime│ ←╯  │Model │
 *   [System Prompt]         ╰──────╯     ╰──────╯
 *   [Screenshots  ] (dim)
 *   [MCP Metadata ] (dim)
 *
 * Reduced motion: final state shown statically
 * ───────────────────────────────────────────────────────── */

import {
	useRef,
	useState,
	useEffect,
	useCallback,
	useLayoutEffect,
} from "react";
import {
	motion,
	useInView,
	useReducedMotion,
} from "motion/react";
import { VisualWrapper } from "./VisualWrapper";

/* ── Layout ───────────────────────────────────────────── */
const CANVAS_W = 480;
const CANVAS_H = 280;

/* ── Color tokens ─────────────────────────────────────── */
const FG = "var(--va-fg)";
const FG_MUTED = "var(--va-fg-muted)";
const GREEN = "var(--va-green)";
const RED = "var(--va-red)";
const SURFACE = "var(--sf-bg-surface)";

/* ── Icon vars ────────────────────────────────────────── */
const ICON_VARS = {
	"--icon-s1": "color-mix(in oklch, var(--va-fg) 90%, transparent)",
	"--icon-s2": "color-mix(in oklch, var(--va-fg) 60%, transparent)",
	"--icon-s3": "color-mix(in oklch, var(--va-fg) 40%, transparent)",
	"--icon-s4": "color-mix(in oklch, var(--va-fg) 25%, transparent)",
	"--icon-stroke": "var(--sf-border-subtle)",
} as Record<string, string>;

/* ── Context items ────────────────────────────────────── */
const CONTEXT_ITEMS = [
	{ label: "Conversation", kept: true },
	{ label: "Tool Results", kept: true },
	{ label: "System Prompt", kept: true },
	{ label: "Screenshots", kept: false },
	{ label: "MCP Metadata", kept: false },
] as const;

/* ── Phases ───────────────────────────────────────────── */
const enum Phase {
	IDLE = 0,
	ITEMS = 1,
	NODES = 2,
	SELECT = 3,
	FLOW = 4,
	LOOP = 5,
	SETTLED = 6,
}

/* ── Layout positions ─────────────────────────────────── */
const ITEM_X = 10;
const ITEM_W = 120;
const ITEM_H = 30;
const ITEM_GAP = 6;
const LIST_H = CONTEXT_ITEMS.length * ITEM_H + (CONTEXT_ITEMS.length - 1) * ITEM_GAP;

const NODE_BOX = 48;
const MID_Y = CANVAS_H / 2; // center of Runtime & Model

const RT_X = 240;
const MODEL_X = 390;

// (Developer removed — outside the loop, not shown)

/* ── Isometric SVG icons ──────────────────────────────── */
function UserIcon() {
	return (
		<svg width={22} height={22} viewBox="0 0 207 207" fill="none">
			<path d="m40.67 70.44 21.42-11.91 1.07 0.08c5.93 17.05 20.65 30.53 40.15 30.53 12.57 0 23.57-5.61 32.3-13.92l30.45 17.08v85.32l-44.02 26.44-81.37-49.07v-84.55z" fill="var(--icon-s3)" stroke="var(--icon-stroke)" strokeLinejoin="round" strokeWidth="1.5" />
			<path d="m122 116.7 43.87-24.41v85.09l-43.7 26.52-0.17-87.2z" fill="var(--icon-s2)" stroke="var(--icon-stroke)" strokeLinejoin="round" strokeWidth="1.5" />
			<path d="m40.9 71.14 80.85 45.58v87.08l-80.92-49.02 0.07-83.64z" fill="var(--icon-s1)" stroke="var(--icon-stroke)" strokeLinejoin="round" strokeWidth="1.5" />
			<path d="m103.2 88.68c24.27 0 43.45-20.19 42.95-42.57 0-22.67-18.71-43.17-42.95-43.17-23.7 0-42.8 19.53-42.8 43.17 0 22.96 18.42 42.57 42.8 42.57z" fill="var(--icon-s1)" stroke="var(--icon-stroke)" strokeMiterlimit="10" strokeWidth="1.2" />
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

function LLMIcon() {
	return (
		<svg width={24} height={24} viewBox="0 0 200 200" fill="none">
			<path d="m12.66 100 86.71-90.58 87.46 90.58-87.35 97.41-86.82-97.41z" fill="var(--icon-s2)" />
			<path d="m12.66 100 86.71-90.58-0.08 136.3-86.63-45.73z" fill="var(--icon-s4)" />
			<path d="m99.37 9.42 87.46 90.58-87.54 45.73 0.08-136.3z" fill="var(--icon-s2)" />
			<path d="m99.29 197.4 87.39-97.41-87.47 45.69 0.08 51.72z" fill="var(--icon-s1)" />
		</svg>
	);
}

/* ── Animated arrow (straight line with arrowhead) ────── */
function StraightArrow({
	x1, y1, x2, y2, color, visible, isReduced, delay = 0,
}: {
	x1: number; y1: number; x2: number; y2: number;
	color: string; visible: boolean; isReduced: boolean; delay?: number;
}) {
	const isRight = x2 > x1;
	return (
		<g>
			<motion.line
				x1={x1} y1={y1} x2={x2} y2={y2}
				stroke={color} strokeWidth={1.5} strokeLinecap="round"
				initial={{ pathLength: 0, opacity: 0 }}
				animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
				transition={isReduced ? { duration: 0 } : { delay, duration: 0.4, ease: "easeOut" }}
			/>
			<motion.polyline
				points={
					isRight
						? `${x2 - 5},${y2 - 3} ${x2},${y2} ${x2 - 5},${y2 + 3}`
						: `${x2 + 5},${y2 - 3} ${x2},${y2} ${x2 + 5},${y2 + 3}`
				}
				fill="none" stroke={color} strokeWidth={1.5}
				strokeLinecap="round" strokeLinejoin="round"
				initial={{ opacity: 0 }}
				animate={visible ? { opacity: 1 } : { opacity: 0 }}
				transition={isReduced ? { duration: 0 } : { delay: delay + 0.3, duration: 0.15 }}
			/>
		</g>
	);
}

/* ── Main component ───────────────────────────────────── */
export function ContextFilterDiagram({ className }: { className?: string }) {
	const prefersReducedMotion = useReducedMotion();
	const isReduced = !!prefersReducedMotion;
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.3 });
	const [phase, setPhase] = useState<Phase>(isReduced ? Phase.SETTLED : Phase.IDLE);
	const [hasPlayed, setHasPlayed] = useState(isReduced);
	const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

	const clearTimers = useCallback(() => {
		timersRef.current.forEach(clearTimeout);
		timersRef.current = [];
	}, []);

	const schedule = useCallback((fn: () => void, ms: number) => {
		const t = setTimeout(fn, ms);
		timersRef.current.push(t);
	}, []);

	const runSequence = useCallback(() => {
		if (isReduced) return;
		clearTimers();
		setHasPlayed(true);
		setPhase(Phase.IDLE);
		schedule(() => setPhase(Phase.ITEMS), 300);
		schedule(() => setPhase(Phase.NODES), 900);
		schedule(() => setPhase(Phase.SELECT), 1400);
		schedule(() => setPhase(Phase.FLOW), 2400);
		schedule(() => setPhase(Phase.LOOP), 3200);
		schedule(() => setPhase(Phase.SETTLED), 4000);
	}, [isReduced, clearTimers, schedule]);

	useEffect(() => {
		if (isInView && !hasPlayed) {
			const t = setTimeout(runSequence, 400);
			return () => clearTimeout(t);
		}
	}, [isInView, hasPlayed, runSequence]);

	useEffect(() => () => clearTimers(), [clearTimers]);

	const handleReplay = () => {
		setHasPlayed(false);
		setTimeout(runSequence, 50);
	};

	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const update = () => setScale(Math.min(1, el.clientWidth / CANVAS_W));
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const LIST_TOP = MID_Y - LIST_H / 2;

	// Loop arrow positions (parallel arrows like AgentLoopComparison)
	// (Arrow positions computed inline in orthogonal paths)

	return (
		<VisualWrapper
			label="Context is a design choice"
			className={className}
			tone="neutral"
			showCaption={false}
			onReplay={handleReplay}
			showReplay={hasPlayed && !isReduced}
		>
			<div
				ref={ref}
				className="relative flex w-full flex-col items-center py-4"
				style={ICON_VARS as React.CSSProperties}
			>
				<div ref={containerRef} className="w-full" style={{ height: CANVAS_H * scale }}>
					<div
						className="relative mx-auto"
						style={{
							width: CANVAS_W,
							height: CANVAS_H,
							transform: `scale(${scale})`,
							transformOrigin: "top center",
						}}
					>
						<svg
							className="absolute inset-0 pointer-events-none"
							width={CANVAS_W}
							height={CANVAS_H}
							viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
							fill="none"
						>
							{/* Gradient defs for loop arrows */}
							<defs>
								<linearGradient id="ctx-loop-grad-top" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor={FG_MUTED} stopOpacity={0.3} />
									<stop offset="50%" stopColor={FG_MUTED} stopOpacity={0.8} />
									<stop offset="100%" stopColor={FG_MUTED} stopOpacity={0.3} />
								</linearGradient>
								<linearGradient id="ctx-loop-grad-bot" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor={FG_MUTED} stopOpacity={0.3} />
									<stop offset="50%" stopColor={FG_MUTED} stopOpacity={0.8} />
									<stop offset="100%" stopColor={FG_MUTED} stopOpacity={0.3} />
								</linearGradient>
							</defs>
							{/* Kept items → Runtime (converging arrows) */}
							{CONTEXT_ITEMS.map((item, i) => {
								if (!item.kept) return null;
								const itemY = LIST_TOP + i * (ITEM_H + ITEM_GAP) + ITEM_H / 2;
								const visible = isReduced || phase >= Phase.FLOW;
								return (
									<motion.line
										key={`flow-${i}`}
										x1={ITEM_X + ITEM_W + 8}
										y1={itemY}
										x2={RT_X - NODE_BOX / 2 - 8}
										y2={MID_Y}
										stroke={FG_MUTED}
										strokeWidth={1}
										strokeLinecap="round"
										initial={{ pathLength: 0, opacity: 0 }}
										animate={visible ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
										transition={isReduced ? { duration: 0 } : { delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
									/>
								);
							})}

							{/* Runtime → Model: gradient orthogonal path ABOVE */}
							{(() => {
								const r = 8;
								const gap = 18;
								const topY = MID_Y - NODE_BOX / 2 - gap;
								const sx = RT_X;
								const sy = MID_Y - NODE_BOX / 2 - 4;
								const ex = MODEL_X;
								const ey = sy;
								const d = [
									`M ${sx} ${sy}`,
									`L ${sx} ${topY + r}`,
									`Q ${sx} ${topY} ${sx + r} ${topY}`,
									`L ${ex - r} ${topY}`,
									`Q ${ex} ${topY} ${ex} ${topY + r}`,
									`L ${ex} ${ey}`,
								].join(" ");
								return (
									<>
										<motion.path
											d={d}
											stroke="url(#ctx-loop-grad-top)"
											strokeWidth={1.5}
											strokeLinecap="round"
											strokeLinejoin="round"
											fill="none"
											initial={{ pathLength: 0, opacity: 0 }}
											animate={
												phase >= Phase.LOOP || isReduced
													? { pathLength: 1, opacity: 1 }
													: { pathLength: 0, opacity: 0 }
											}
											transition={isReduced ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
										/>
										<motion.polyline
											points={`${ex - 4},${ey - 5} ${ex},${ey} ${ex + 4},${ey - 5}`}
											fill="none" stroke={FG_MUTED} strokeWidth={1.5}
											strokeLinecap="round" strokeLinejoin="round"
											initial={{ opacity: 0 }}
											animate={phase >= Phase.LOOP || isReduced ? { opacity: 0.6 } : { opacity: 0 }}
											transition={isReduced ? { duration: 0 } : { delay: 0.5, duration: 0.15 }}
										/>
									</>
								);
							})()}

							{/* Model → Runtime: gradient orthogonal path BELOW */}
							{(() => {
								const r = 8;
								const gap = 52; // clear of label text
								const labelClear = 22; // start below labels
								const botY = MID_Y + NODE_BOX / 2 + gap;
								const sx = MODEL_X;
								const startY = MID_Y + NODE_BOX / 2 + labelClear;
								const ex = RT_X;
								const endY = startY;
								const d = [
									`M ${sx} ${startY}`,
									`L ${sx} ${botY - r}`,
									`Q ${sx} ${botY} ${sx - r} ${botY}`,
									`L ${ex + r} ${botY}`,
									`Q ${ex} ${botY} ${ex} ${botY - r}`,
									`L ${ex} ${endY}`,
								].join(" ");
								return (
									<>
										<motion.path
											d={d}
											stroke="url(#ctx-loop-grad-bot)"
											strokeWidth={1.5}
											strokeLinecap="round"
											strokeLinejoin="round"
											fill="none"
											initial={{ pathLength: 0, opacity: 0 }}
											animate={
												phase >= Phase.LOOP || isReduced
													? { pathLength: 1, opacity: 1 }
													: { pathLength: 0, opacity: 0 }
											}
											transition={isReduced ? { duration: 0 } : { delay: 0.2, duration: 0.6, ease: "easeOut" }}
										/>
										<motion.polyline
											points={`${ex - 4},${endY + 5} ${ex},${endY} ${ex + 4},${endY + 5}`}
											fill="none" stroke={FG_MUTED} strokeWidth={1.5}
											strokeLinecap="round" strokeLinejoin="round"
											initial={{ opacity: 0 }}
											animate={phase >= Phase.LOOP || isReduced ? { opacity: 0.6 } : { opacity: 0 }}
											transition={isReduced ? { duration: 0 } : { delay: 0.7, duration: 0.15 }}
										/>
									</>
								);
							})()}
						</svg>

						{/* Context items — vertical list, left side */}
						{CONTEXT_ITEMS.map((item, i) => {
							const y = LIST_TOP + i * (ITEM_H + ITEM_GAP);
							const visible = isReduced || phase >= Phase.ITEMS;
							const selected = isReduced || phase >= Phase.SELECT;
							const dimmed = selected && !item.kept;

							return (
								<motion.div
									key={item.label}
									className="absolute flex items-center justify-center rounded-[3px]"
									style={{
										left: ITEM_X,
										top: y,
										width: ITEM_W,
										height: ITEM_H,
										backgroundColor: SURFACE,
										borderLeft: selected
											? `2px solid ${item.kept ? GREEN : RED}`
											: "2px solid transparent",
										transition: "border-color 0.3s",
									}}
									initial={isReduced ? {} : { opacity: 0, x: -10 }}
									animate={{
										opacity: dimmed ? 0.2 : visible ? 1 : 0,
										x: visible ? 0 : -10,
									}}
									transition={
										isReduced
											? { duration: 0 }
											: { delay: i * 0.12, type: "spring", visualDuration: 0.4, bounce: 0.1 }
									}
								>
									<span
										className="text-[10px] font-mono uppercase tracking-wider"
										style={{ color: dimmed ? FG_MUTED : FG }}
									>
										{item.label}
									</span>
								</motion.div>
							);
						})}

						{/* Runtime node — fades in after context items */}
						<motion.div
							className="absolute flex flex-col items-center gap-1"
							style={{ left: RT_X - NODE_BOX / 2, top: MID_Y - NODE_BOX / 2 }}
							initial={isReduced ? {} : { opacity: 0, scale: 0.92 }}
							animate={
								phase >= Phase.NODES || isReduced
									? { opacity: 1, scale: 1 }
									: { opacity: 0, scale: 0.92 }
							}
							transition={isReduced ? { duration: 0 } : { type: "spring", visualDuration: 0.4, bounce: 0.1 }}
						>
							<div
								className="flex items-center justify-center rounded-[3px]"
								style={{ width: NODE_BOX, height: NODE_BOX, backgroundColor: SURFACE }}
							>
								<RuntimeIcon />
							</div>
							<span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: FG_MUTED }}>
								Runtime
							</span>
						</motion.div>

						{/* Model node — fades in slightly after Runtime */}
						<motion.div
							className="absolute flex flex-col items-center gap-1"
							style={{ left: MODEL_X - NODE_BOX / 2, top: MID_Y - NODE_BOX / 2 }}
							initial={isReduced ? {} : { opacity: 0, scale: 0.92 }}
							animate={
								phase >= Phase.NODES || isReduced
									? { opacity: 1, scale: 1 }
									: { opacity: 0, scale: 0.92 }
							}
							transition={isReduced ? { duration: 0 } : { delay: 0.15, type: "spring", visualDuration: 0.4, bounce: 0.1 }}
						>
							<div
								className="flex items-center justify-center rounded-[3px]"
								style={{ width: NODE_BOX, height: NODE_BOX, backgroundColor: SURFACE }}
							>
								<LLMIcon />
							</div>
							<span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: FG_MUTED }}>
								LLM
							</span>
						</motion.div>

					</div>
				</div>
			</div>
		</VisualWrapper>
	);
}
