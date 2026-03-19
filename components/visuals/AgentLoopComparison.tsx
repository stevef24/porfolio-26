"use client";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — AgentLoopComparison
 *
 * Toggle: Chatbot → Agent Loop
 *
 *    0ms   Title blur-morphs "Chatbot" → "Agent Loop"
 *          Environment node fades in at center
 *          User + LLM slide apart
 *  400ms   Forward arrow draws in (User → Env)
 *  900ms   Return arrow draws in (Env → User)
 * 1100ms   Gradient loop arrows draw (Env ↔ LLM orthogonal)
 * 1400ms   Settled
 *
 * Toggle: Agent Loop → Chatbot
 *
 *    0ms   Env fades out, User + LLM slide together
 *  400ms   Title blur-morphs back to "Chatbot"
 *  500ms   Bidirectional arrows draw in (User ↔ LLM)
 *  800ms   Settled
 *
 * Reduced motion: Agent loop shown statically, toggle works
 * ───────────────────────────────────────────────────────── */

import {
	useRef,
	useState,
	useEffect,
	useCallback,
	useLayoutEffect,
	useMemo,
} from "react";
import {
	motion,
	AnimatePresence,
	useInView,
	useReducedMotion,
} from "motion/react";
import { getBoxToBoxArrow } from "perfect-arrows";
import { VisualWrapper } from "./VisualWrapper";

/* ── Canvas constants ─────────────────────────────────── */
const CANVAS_W = 440;
const CANVAS_H = 230;
const BOX_W = 56;
const BOX_H = 56;

/* ── Node positions ───────────────────────────────────── */
const POS = {
	chatbot: {
		user: { x: 140, y: 30 },
		llm: { x: 244, y: 30 },
	},
	agent: {
		user: { x: 30, y: 30 },
		env: { x: 175, y: 30 },
		llm: { x: 320, y: 30 },
	},
} as const;

/* ── Color tokens ─────────────────────────────────────── */
const FG = "var(--va-fg)";
const FG_MUTED = "var(--va-fg-muted)";
const GREEN = "var(--va-green)";
const RED = "var(--va-red)";
const SURFACE = "var(--sf-bg-surface)";

/* ── Arrow phase enum ─────────────────────────────────── */
const enum Phase {
	IDLE = 0,
	FORWARD = 1,
	RETURN = 2,
	SETTLED = 3,
}

/* ── Icon shade tokens ────────────────────────────────── */
const ICON_VARS = {
	"--icon-s1": "color-mix(in oklch, var(--va-fg) 90%, transparent)",
	"--icon-s2": "color-mix(in oklch, var(--va-fg) 60%, transparent)",
	"--icon-s3": "color-mix(in oklch, var(--va-fg) 40%, transparent)",
	"--icon-s4": "color-mix(in oklch, var(--va-fg) 25%, transparent)",
	"--icon-stroke": "var(--sf-border-subtle)",
} as Record<string, string>;

const ICON_SIZE = 36;

/* ── Isometric node icons ─────────────────────────────── */
function UserIcon() {
	return (
		<svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 207 207" fill="none">
			<path d="m40.67 70.44 21.42-11.91 1.07 0.08c5.93 17.05 20.65 30.53 40.15 30.53 12.57 0 23.57-5.61 32.3-13.92l30.45 17.08v85.32l-44.02 26.44-81.37-49.07v-84.55z" fill="var(--icon-s3)" stroke="var(--icon-stroke)" strokeLinejoin="round" strokeWidth="1.5" />
			<path d="m122 116.7 43.87-24.41v85.09l-43.7 26.52-0.17-87.2z" fill="var(--icon-s2)" stroke="var(--icon-stroke)" strokeLinejoin="round" strokeWidth="1.5" />
			<path d="m40.9 71.14 80.85 45.58v87.08l-80.92-49.02 0.07-83.64z" fill="var(--icon-s1)" stroke="var(--icon-stroke)" strokeLinejoin="round" strokeWidth="1.5" />
			<path d="m103.2 88.68c24.27 0 43.45-20.19 42.95-42.57 0-22.67-18.71-43.17-42.95-43.17-23.7 0-42.8 19.53-42.8 43.17 0 22.96 18.42 42.57 42.8 42.57z" fill="var(--icon-s1)" stroke="var(--icon-stroke)" strokeMiterlimit="10" strokeWidth="1.2" />
		</svg>
	);
}

function EnvIcon() {
	return (
		<svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 250 250" fill="none">
			<path d="m7.35 101.7 117.4-67.27 117.9 67.45v35.25l-117.7 69.25-117.7-69.25v-35.43z" fill="var(--icon-s1)" />
			<path d="m124.7 34.46-117.4 67.27 117.4 67.95 117.9-67.59-118-67.63z" fill="var(--icon-s2)" />
			<path d="m124.6 39.07-109.7 63.1 109.8 63.02 109.5-63.28-109.6-62.84z" fill="var(--icon-s3)" />
			<path d="m45.62 96.09c-6.68 0-10.17 3.33-10.17 5.96 0 3 4.35 5.34 10.17 5.34s9.29-2.93 9.29-5.78-3.98-5.52-9.29-5.52z" fill="var(--icon-s1)" />
			<path d="m8.04 136.8 8.52-3.98 5.16 3.56-5.16 3.98-0.34 11.59-8.18 5.57v-20.72z" fill="var(--icon-s2)" />
			<path d="m19.99 142.4 6.96-3.6 6.15 3.85-6.15 4.49-0.13 12.19-9.71 6.78-4-1.88v-1.47l6.96-4.93-0.08-15.43z" fill="var(--icon-s2)" />
			<path d="m31.71 151.1 7.2-4.28 6.19 3.55-6.19 5.12v12.44l-5.2 2.52-2-1.3v-18.05z" fill="var(--icon-s2)" />
			<path d="m41.75 155.8 8.83-2.94 5.71 4.31-5.71 4.93-0.21 10.81-7.31 4.32-1.31-1.07v-20.36z" fill="var(--icon-s2)" />
			<path d="m55.62 165.3 7.87-4.07 5.21 3.55-5.21 4.66v10.19l-6.57 4.4-1.3-1.25v-17.48z" fill="var(--icon-s2)" />
			<path d="m66.68 172 7.18-4.7 5.5 3.55-5.94 5.01v11.39l-5.5 2.77-1.24-1.59v-16.43z" fill="var(--icon-s2)" />
			<path d="m77.76 178.5 7.87-4.66 5.21 3.29-5.21 4.8v11.77l-6.1 3.37-1.77-1.21v-17.36z" fill="var(--icon-s2)" />
			<path d="m88.92 185.2 7.87-4.85 5.51 3.56-5.51 4.7v12.32l-6.57 3.42-1.3-1.25v-17.9z" fill="var(--icon-s2)" />
			<path d="m101.1 191.2 7.14-4.61 5.16 3.55-5.16 4.11v13.46l-4.84 1.79-2.3-1.45v-16.85z" fill="var(--icon-s2)" />
			<path d="m135.9 190 7.34-3.11 6.19 4.1-4.4 3.29v13.3l5.41 6-0.66 0.29-8.38-5.82v-12.51l-5.5-3.55v-1.99z" fill="var(--icon-s2)" />
			<path d="m147.5 183.9 5.54-3.56 8.18 5.32-4.19 2.77v10.72l7.61 5.1v1.07l-4.4 2.78-7.87-5.86v-12.56l-4.87-3.56v-2.22z" fill="var(--icon-s2)" />
			<path d="m158.5 176.5 6.02-3.28 7.61 5.1-4.11 3.01v12.61l7.1 5.2v0.98l-4.02 1.74-8.1-6.14v-16.18l-4.5-1.81v-1.23z" fill="var(--icon-s2)" />
			<path d="m170.1 169.2 5.25-2.69 8.35 5.58-3.94 2.73v11.9l8.73 4.54v1.62l-4.7 2.68-8.74-6.34v-13.7l-4.95-3v-3.32z" fill="var(--icon-s2)" />
			<path d="m181.6 162.8 5.03-2.77 7.23 5.01-3.1 2.22v12.58l9 5.46v1.73l-3.69 1.25-9.08-5.9v-15.84l-5.39-2.01v-1.73z" fill="var(--icon-s2)" />
			<path d="m193.3 155.8 4.32-2.16 7.87 5.12-3.24 2.05v12.14l9.49 5.22v0.8l-4.32 2.17-8.92-6.47v-12.91l-5.2-3v-2.96z" fill="var(--icon-s2)" />
			<path d="m204.3 149.3 4.33-2.77 8.35 5.61-3.38 2.44v12.62l8.53 5.22v1.24l-3.47 1.25-8.92-6.11v-14.6l-5.44-2.86v-2.04z" fill="var(--icon-s2)" />
			<path d="m215.3 143 5.42-3.28 7.87 5.12-3.66 2.52v12.33l7.74 7.3v1.3l-3.95-1.25-7.87-5.6v-13.04l-5.55-3.1v-2.3z" fill="var(--icon-s2)" />
			<path d="m228.2 136.1 5.5-2.85 7.38 5.3-3.39 2.53v11.27l9.32 4.4v2.94l-3.98 2.62-8.43-6.6v-14.59l-6.4-3.37v-1.65z" fill="var(--icon-s2)" />
		</svg>
	);
}

function LLMIcon() {
	return (
		<svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 200 200" fill="none">
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

/* ── Arrow helper (perfect-arrows bezier) ─────────────── */
function computeArrow(
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	bow = 0,
) {
	const result = getBoxToBoxArrow(
		fromX,
		fromY,
		BOX_W,
		BOX_H,
		toX,
		toY,
		BOX_W,
		BOX_H,
		{ padStart: 6, padEnd: 10, bow },
	);
	const [sx, sy, cx, cy, ex, ey, ae] = result;
	const d = `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
	return { d, sx, sy, cx, cy, ex, ey, ae };
}

/* ── Animated bezier arrow ────────────────────────────── */
function BezierArrow({
	d,
	ex,
	ey,
	ae,
	color,
	visible,
	drawDelay = 0,
	drawDuration = 0.5,
	isReduced,
}: {
	d: string;
	ex: number;
	ey: number;
	ae: number;
	color: string;
	visible: boolean;
	drawDelay?: number;
	drawDuration?: number;
	isReduced: boolean;
}) {
	const angleDeg = (ae * 180) / Math.PI;

	return (
		<g>
			<motion.path
				d={d}
				stroke={color}
				strokeWidth={1.5}
				strokeLinecap="round"
				fill="none"
				initial={{ pathLength: 0, opacity: 0 }}
				animate={
					visible
						? { pathLength: 1, opacity: 1 }
						: { pathLength: 0, opacity: 0 }
				}
				transition={
					isReduced
						? { duration: 0 }
						: {
								pathLength: {
									delay: drawDelay,
									duration: drawDuration,
									ease: "easeOut",
								},
								opacity: { delay: drawDelay, duration: 0.01 },
							}
				}
			/>
			<motion.polygon
				points="0,-4 8,0 0,4"
				fill={color}
				transform={`translate(${ex},${ey}) rotate(${angleDeg})`}
				initial={{ opacity: 0 }}
				animate={visible ? { opacity: 1 } : { opacity: 0 }}
				transition={
					isReduced
						? { duration: 0 }
						: { delay: drawDelay + drawDuration * 0.7, duration: 0.15 }
				}
			/>
		</g>
	);
}

/* ── DiagramNode ──────────────────────────────────────── */
function DiagramNode({
	x,
	y,
	label,
	icon,
	visible,
	isReduced,
}: {
	x: number;
	y: number;
	label: string;
	icon: React.ReactNode;
	visible: boolean;
	isReduced: boolean;
}) {
	return (
		<motion.div
			className="absolute flex flex-col items-center gap-1"
			style={{ width: BOX_W }}
			animate={{
				x,
				y,
				opacity: visible ? 1 : 0,
				scale: visible ? 1 : 0.9,
			}}
			transition={
				isReduced
					? { duration: 0 }
					: {
							type: "spring",
							visualDuration: 0.45,
							bounce: 0.1,
							opacity: { duration: 0.25 },
						}
			}
		>
			<div
				className="flex items-center justify-center rounded-[3px]"
				style={{
					width: BOX_W,
					height: BOX_H,
					backgroundColor: SURFACE,
				}}
			>
				{icon}
			</div>
			<span
				className="text-[10px] font-mono uppercase tracking-wider whitespace-nowrap"
				style={{ color: FG_MUTED }}
			>
				{label}
			</span>
		</motion.div>
	);
}

/* ── Main component ───────────────────────────────────── */
interface AgentLoopComparisonProps {
	className?: string;
}

export function AgentLoopComparison({ className }: AgentLoopComparisonProps) {
	const prefersReducedMotion = useReducedMotion();
	const isReduced = !!prefersReducedMotion;
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.3 });
	const [mode, setMode] = useState<"chatbot" | "agent">(
		isReduced ? "agent" : "chatbot",
	);
	const [phase, setPhase] = useState<Phase>(
		isReduced ? Phase.SETTLED : Phase.IDLE,
	);
	const [hasAutoToggled, setHasAutoToggled] = useState(isReduced);
	const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

	const isAgent = mode === "agent";

	const clearTimers = useCallback(() => {
		timersRef.current.forEach(clearTimeout);
		timersRef.current = [];
	}, []);

	const schedule = useCallback((fn: () => void, ms: number) => {
		const t = setTimeout(fn, ms);
		timersRef.current.push(t);
		return t;
	}, []);

	// Auto-toggle on first view
	useEffect(() => {
		if (isInView && !hasAutoToggled && !isReduced) {
			const t = setTimeout(() => {
				setMode("agent");
				setHasAutoToggled(true);
			}, 1200);
			return () => clearTimeout(t);
		}
	}, [isInView, hasAutoToggled, isReduced]);

	// Run phase sequence when mode changes
	useEffect(() => {
		if (isReduced) {
			setPhase(Phase.SETTLED);
			return;
		}

		clearTimers();

		if (isAgent) {
			setPhase(Phase.IDLE);
			schedule(() => setPhase(Phase.FORWARD), 400);
			schedule(() => setPhase(Phase.RETURN), 900);
			schedule(() => setPhase(Phase.SETTLED), 1400);
		} else {
			setPhase(Phase.IDLE);
			schedule(() => setPhase(Phase.FORWARD), 500);
			schedule(() => setPhase(Phase.SETTLED), 800);
		}

		return clearTimers;
	}, [mode, isAgent, isReduced, clearTimers, schedule]);

	useEffect(() => () => clearTimers(), [clearTimers]);

	const handleToggle = useCallback(
		(index: number) => {
			const newMode = index === 0 ? "chatbot" : "agent";
			if (newMode !== mode) {
				setMode(newMode);
				setHasAutoToggled(true);
			}
		},
		[mode],
	);

	// Responsive scaling
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const update = () => {
			setScale(Math.min(1, el.clientWidth / CANVAS_W));
		};
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	/* ── Compute arrows ──────────────────────────────── */
	// Hand-crafted straight arrows at explicit Y offsets for clear separation.
	// Forward (green/muted) arrows sit above center, return (red/muted) below.
	const nodeMidY = POS.agent.env.y + BOX_H / 2;
	const OFFSET = 8; // vertical offset from center
	const PAD = 14;   // horizontal padding from box edges

	// Helper: straight arrow from right edge of box A to left edge of box B
	function straightArrow(ax: number, bx: number, y: number) {
		const sx = ax + BOX_W + PAD;
		const ex = bx - PAD;
		const d = `M ${sx} ${y} L ${ex} ${y}`;
		// angle: 0 = pointing right, PI = pointing left
		const ae = sx < ex ? 0 : Math.PI;
		return { d, sx, sy: y, cx: (sx + ex) / 2, cy: y, ex, ey: y, ae };
	}
	// Helper: straight arrow from left edge of box B to right edge of box A (reverse)
	function straightArrowRev(bx: number, ax: number, y: number) {
		const sx = bx - PAD;
		const ex = ax + BOX_W + PAD;
		const d = `M ${sx} ${y} L ${ex} ${y}`;
		const ae = Math.PI;
		return { d, sx, sy: y, cx: (sx + ex) / 2, cy: y, ex, ey: y, ae };
	}

	// Chatbot: bidirectional muted arrows
	const chatbotTopY = POS.chatbot.user.y + BOX_H / 2 - OFFSET;
	const chatbotBotY = POS.chatbot.user.y + BOX_H / 2 + OFFSET;
	const chatbotForward = straightArrow(POS.chatbot.user.x, POS.chatbot.llm.x, chatbotTopY);
	const chatbotReturn = straightArrowRev(POS.chatbot.llm.x, POS.chatbot.user.x, chatbotBotY);

	// Agent forward (top row) — User → Env only
	const agentTopY = nodeMidY - OFFSET;
	const userToEnvFwd = straightArrow(POS.agent.user.x, POS.agent.env.x, agentTopY);

	// Agent return (bottom row) — Env → User only
	const agentBotY = nodeMidY + OFFSET;
	const envToUserRet = straightArrowRev(POS.agent.env.x, POS.agent.user.x, agentBotY);

	const title = isAgent ? "Agent Loop" : "Chatbot";

	return (
		<VisualWrapper
			label="Chatbot vs Agent Loop"
			className={className}
			tone="neutral"
			showCaption={false}
			toggle={{
				options: ["Chatbot", "Agent"],
				value: isAgent ? 1 : 0,
				onChange: handleToggle,
			}}
		>
			<div
				ref={ref}
				className="relative flex w-full flex-col items-center gap-4 py-4"
				style={ICON_VARS as React.CSSProperties}
			>
				{/* Title */}
				<AnimatePresence mode="wait">
					<motion.h3
						key={title}
						className="text-[13px] font-mono uppercase tracking-wider"
						style={{ color: "var(--sf-text-primary)" }}
						initial={isReduced ? {} : { opacity: 0, filter: "blur(4px)" }}
						animate={{ opacity: 1, filter: "blur(0px)" }}
						exit={isReduced ? {} : { opacity: 0, filter: "blur(4px)" }}
						transition={{ duration: 0.25 }}
					>
						{title}
					</motion.h3>
				</AnimatePresence>

				{/* Scaled canvas */}
				<div
					ref={containerRef}
					className="w-full"
					style={{ height: CANVAS_H * scale }}
				>
					<div
						className="relative mx-auto"
						style={{
							width: CANVAS_W,
							height: CANVAS_H,
							transform: `scale(${scale})`,
							transformOrigin: "top center",
						}}
					>
						{/* SVG arrow overlay */}
						<svg
							className="absolute inset-0 pointer-events-none"
							width={CANVAS_W}
							height={CANVAS_H}
							viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
							fill="none"
						>
							{/* Gradient defs for loop arrows */}
							<defs>
								<linearGradient id="loop-grad-top" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor={FG_MUTED} stopOpacity={0.3} />
									<stop offset="50%" stopColor={FG_MUTED} stopOpacity={0.7} />
									<stop offset="100%" stopColor={FG_MUTED} stopOpacity={0.3} />
								</linearGradient>
								<linearGradient id="loop-grad-bot" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor={FG_MUTED} stopOpacity={0.3} />
									<stop offset="50%" stopColor={FG_MUTED} stopOpacity={0.7} />
									<stop offset="100%" stopColor={FG_MUTED} stopOpacity={0.3} />
								</linearGradient>
							</defs>
							{/* ── Chatbot: bidirectional ── */}
							{!isAgent && (
								<>
									<BezierArrow
										{...chatbotForward}
										color={FG_MUTED}
										visible={phase >= Phase.FORWARD}
										drawDelay={0}
										drawDuration={0.4}
										isReduced={isReduced}
									/>
									<BezierArrow
										{...chatbotReturn}
										color={FG_MUTED}
										visible={phase >= Phase.FORWARD}
										drawDelay={0.15}
										drawDuration={0.4}
										isReduced={isReduced}
									/>
								</>
							)}

							{/* ── Agent: User → Env forward arrow ── */}
							{isAgent && (
								<BezierArrow
									{...userToEnvFwd}
									color={FG_MUTED}
									visible={phase >= Phase.FORWARD}
									drawDelay={0}
									drawDuration={0.4}
									isReduced={isReduced}
								/>
							)}

							{/* ── Agent: Env → User return arrow ── */}
							{isAgent && (
								<BezierArrow
									{...envToUserRet}
									color={FG_MUTED}
									visible={phase >= Phase.RETURN}
									drawDelay={0}
									drawDuration={0.4}
									isReduced={isReduced}
								/>
							)}

							{/* ── Agent: gradient orthogonal loop between Env ↔ LLM ── */}
							{isAgent && (() => {
								const envCx = POS.agent.env.x + BOX_W / 2;
								const llmCx = POS.agent.llm.x + BOX_W / 2;
								const nodeTop = POS.agent.env.y;
								const nodeBot = POS.agent.env.y + BOX_H;
								const r = 8;
								const topGap = 18;
								const botGap = 50; // clear of labels + text

								// Top path: Env → LLM (above)
								const topY = nodeTop - topGap;
								const topD = [
									`M ${envCx} ${nodeTop - 4}`,
									`L ${envCx} ${topY + r}`,
									`Q ${envCx} ${topY} ${envCx + r} ${topY}`,
									`L ${llmCx - r} ${topY}`,
									`Q ${llmCx} ${topY} ${llmCx} ${topY + r}`,
									`L ${llmCx} ${nodeTop - 4}`,
								].join(" ");

								// Bottom path: LLM → Env (below, clearing labels)
								const labelClear = 22; // clear below label text
								const botY = nodeBot + botGap;
								const botD = [
									`M ${llmCx} ${nodeBot + labelClear}`,
									`L ${llmCx} ${botY - r}`,
									`Q ${llmCx} ${botY} ${llmCx - r} ${botY}`,
									`L ${envCx + r} ${botY}`,
									`Q ${envCx} ${botY} ${envCx} ${botY - r}`,
									`L ${envCx} ${nodeBot + labelClear}`,
								].join(" ");

								const visible = isReduced || phase >= Phase.RETURN;

								return (
									<>
										{/* Top: Env → LLM (gradient) */}
										<motion.path
											d={topD}
											stroke="url(#loop-grad-top)"
											strokeWidth={1.5}
											strokeLinecap="round"
											strokeLinejoin="round"
											fill="none"
											initial={{ pathLength: 0, opacity: 0 }}
											animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
											transition={isReduced ? { duration: 0 } : { delay: 0.2, duration: 0.6, ease: "easeOut" }}
										/>
										<motion.polyline
											points={`${llmCx - 4},${nodeTop - 4 - 5} ${llmCx},${nodeTop - 4} ${llmCx + 4},${nodeTop - 4 - 5}`}
											fill="none" stroke={FG_MUTED} strokeWidth={1.5}
											strokeLinecap="round" strokeLinejoin="round"
											initial={{ opacity: 0 }}
											animate={visible ? { opacity: 0.5 } : { opacity: 0 }}
											transition={isReduced ? { duration: 0 } : { delay: 0.7, duration: 0.15 }}
										/>

										{/* Bottom: LLM → Env (gradient) */}
										<motion.path
											d={botD}
											stroke="url(#loop-grad-bot)"
											strokeWidth={1.5}
											strokeLinecap="round"
											strokeLinejoin="round"
											fill="none"
											initial={{ pathLength: 0, opacity: 0 }}
											animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
											transition={isReduced ? { duration: 0 } : { delay: 0.4, duration: 0.6, ease: "easeOut" }}
										/>
										<motion.polyline
											points={`${envCx - 4},${nodeBot + labelClear + 5} ${envCx},${nodeBot + labelClear} ${envCx + 4},${nodeBot + labelClear + 5}`}
											fill="none" stroke={FG_MUTED} strokeWidth={1.5}
											strokeLinecap="round" strokeLinejoin="round"
											initial={{ opacity: 0 }}
											animate={visible ? { opacity: 0.5 } : { opacity: 0 }}
											transition={isReduced ? { duration: 0 } : { delay: 0.9, duration: 0.15 }}
										/>
									</>
								);
							})()}
						</svg>

						{/* Nodes */}
						<DiagramNode
							x={isAgent ? POS.agent.user.x : POS.chatbot.user.x}
							y={isAgent ? POS.agent.user.y : POS.chatbot.user.y}
							label="User"
							icon={<UserIcon />}
							visible
							isReduced={isReduced}
						/>

						<DiagramNode
							x={
								isAgent
									? POS.agent.env.x
									: POS.chatbot.user.x +
										(POS.chatbot.llm.x - POS.chatbot.user.x) / 2
							}
							y={isAgent ? POS.agent.env.y : POS.chatbot.user.y}
							label="Runtime"
							icon={<EnvIcon />}
							visible={isAgent}
							isReduced={isReduced}
						/>

						<DiagramNode
							x={isAgent ? POS.agent.llm.x : POS.chatbot.llm.x}
							y={isAgent ? POS.agent.llm.y : POS.chatbot.llm.y}
							label="LLM"
							icon={<LLMIcon />}
							visible
							isReduced={isReduced}
						/>
					</div>
				</div>
			</div>
		</VisualWrapper>
	);
}
