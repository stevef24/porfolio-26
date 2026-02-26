"use client";

/*
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  CompilerComparison — Traditional React vs React 19 Pipeline    │
 * │                                                                 │
 * │  Two horizontal SVG pipelines (toggled), 6 steps each.         │
 * │  Auto-plays with step highlight + description below.           │
 * │                                                                 │
 * │  Layout:                                                       │
 * │  ┌─────┐───▶┌───────┐───▶┌──────┐───▶┌──────┐───▶┌──────┐───▶┌──────┐ │
 * │  │ JSX │    │ Babel │    │ Bundle│   │ Memo │    │ Run  │    │Debug │ │
 * │  └─────┘    └───────┘    └──────┘    └──────┘    └──────┘    └──────┘ │
 * └─────────────────────────────────────────────────────────────────┘
 */

import { useRef, useState, useEffect, useCallback } from "react";
import {
	motion,
	AnimatePresence,
	useInView,
	useReducedMotion,
} from "motion/react";
import { VisualWrapper } from "@/components/visuals/VisualWrapper";

/* ── Constants ──────────────────────────────────────────────────── */
const ACCENT = "var(--va-fg)";
const DIM = "var(--sf-border-subtle)";
const TEXT_DIM = "var(--sf-text-tertiary)";
const TEXT_ON = "var(--sf-text-primary)";
const SURFACE = "var(--sf-bg-surface)";

const STEP_INTERVAL = 3000;

/* ── Pipeline data ──────────────────────────────────────────────── */
interface PipelineStep {
	label: string;
	description: string;
}

const TRADITIONAL: PipelineStep[] = [
	{
		label: "JSX",
		description:
			"Write components using JSX — HTML-like syntax mixed with JavaScript.",
	},
	{
		label: "Babel",
		description:
			"Babel transforms JSX into standard JavaScript function calls browsers understand.",
	},
	{
		label: "Bundle",
		description:
			"Webpack bundles transformed files into deploy-ready build artifacts.",
	},
	{
		label: "Memo",
		description:
			"Manually wrap components with React.memo, useMemo, and useCallback to prevent unnecessary re-renders.",
	},
	{
		label: "Run",
		description:
			"The browser executes the bundle — performance depends on how well you placed those manual optimisations.",
	},
	{
		label: "Debug",
		description:
			"Use React DevTools to hunt unnecessary re-renders and patch missed memoisation.",
	},
];

const REACT19: PipelineStep[] = [
	{
		label: "JSX",
		description:
			"Same familiar JSX — no syntax changes, no new APIs to learn.",
	},
	{
		label: "Build",
		description:
			"Babel plus the new React Compiler process JSX during the build step.",
	},
	{
		label: "Compile",
		description:
			"The compiler analyses code, auto-applies memoisation, and enforces immutability rules.",
	},
	{
		label: "Output",
		description:
			"Build artifacts ship with compiler-injected optimisations baked in.",
	},
	{
		label: "Fast",
		description:
			"Fewer unnecessary re-renders out of the box — no manual memo needed.",
	},
	{
		label: "Config",
		description:
			"Opt-in compiler settings let you control which components or hooks get optimised.",
	},
];

const PIPELINES = { traditional: TRADITIONAL, react19: REACT19 } as const;
type PipelineKey = keyof typeof PIPELINES;

/* ── SVG layout ─────────────────────────────────────────────────── */
const NODE_W = 52;
const NODE_H = 28;
const GAP = 14;
const COUNT = 6;
const SVG_W = COUNT * NODE_W + (COUNT - 1) * GAP;
const SVG_H = NODE_H + 4;
const Y_MID = NODE_H / 2;

function nodeX(i: number) {
	return i * (NODE_W + GAP);
}

/* ── Component ──────────────────────────────────────────────────── */
export default function CompilerComparison({
	className,
}: {
	className?: string;
}) {
	const prefersReducedMotion = useReducedMotion();
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.3 });

	const [pipeline, setPipeline] = useState<PipelineKey>("traditional");
	const [step, setStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);
	const [hasPlayed, setHasPlayed] = useState(!!prefersReducedMotion);

	const steps = PIPELINES[pipeline];
	const isReduced = !!prefersReducedMotion;

	// Auto-advance
	useEffect(() => {
		if (!isPlaying || !isInView) return;
		const t = setInterval(() => {
			setStep((s) => (s + 1) % COUNT);
		}, STEP_INTERVAL);
		return () => clearInterval(t);
	}, [isPlaying, isInView]);

	// Start on scroll into view
	useEffect(() => {
		if (isInView && !hasPlayed) {
			setHasPlayed(true);
		}
	}, [isInView, hasPlayed]);

	const handleReplay = useCallback(() => {
		setStep(0);
		setIsPlaying(true);
	}, []);

	const handleNodeClick = (i: number) => {
		setStep(i);
		setIsPlaying(false);
	};

	const handleToggle = (key: PipelineKey) => {
		setPipeline(key);
		setStep(0);
		setIsPlaying(true);
	};

	return (
		<VisualWrapper
			label="React compilation pipeline comparison"
			className={className}
			tone="neutral"
			showCaption={false}
			onReplay={handleReplay}
			showReplay={hasPlayed && !isReduced}
		>
			<div ref={ref} className="flex w-full flex-col items-center gap-5">
				{/* Pipeline toggle */}
				<div
					className="inline-flex items-center rounded-[6px] p-[3px]"
					style={{ backgroundColor: "var(--sf-bg-subtle)" }}
				>
					{(["traditional", "react19"] as const).map((key) => (
						<button
							key={key}
							type="button"
							onClick={() => handleToggle(key)}
							className="relative cursor-pointer rounded-[4px] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-150"
							style={{
								color:
									pipeline === key ? TEXT_ON : TEXT_DIM,
								backgroundColor:
									pipeline === key ? SURFACE : "transparent",
							}}
						>
							{key === "traditional" ? "Traditional" : "React 19"}
						</button>
					))}
				</div>

				{/* SVG pipeline */}
				<div className="w-full">
					<svg
						viewBox={`-2 -2 ${SVG_W + 4} ${SVG_H + 4}`}
						className="block w-full max-w-[420px] mx-auto"
						fill="none"
						role="img"
						aria-label={`${pipeline === "traditional" ? "Traditional React" : "React 19"} pipeline: ${steps.map((s) => s.label).join(", ")}`}
					>
						{/* Arrows */}
						{Array.from({ length: COUNT - 1 }).map((_, i) => {
							const x1 = nodeX(i) + NODE_W;
							const x2 = nodeX(i + 1);

							return (
								<g key={`arrow-${i}`}>
									<motion.line
										x1={x1 + 3}
										y1={Y_MID}
										x2={x2 - 3}
										y2={Y_MID}
										stroke={step >= i + 1 || isReduced ? ACCENT : DIM}
										strokeWidth={1.2}
										strokeLinecap="round"
										initial={false}
										animate={{
											opacity: step >= i + 1 || isReduced ? 1 : 0.4,
										}}
										transition={
											isReduced
												? { duration: 0 }
												: { duration: 0.25, ease: "easeOut" }
										}
									/>
									<motion.polyline
										points={`${x2 - 8},${Y_MID - 3} ${x2 - 3},${Y_MID} ${x2 - 8},${Y_MID + 3}`}
										stroke={step >= i + 1 || isReduced ? ACCENT : DIM}
										strokeWidth={1.2}
										strokeLinecap="round"
										strokeLinejoin="round"
										fill="none"
										initial={false}
										animate={{
											opacity: step >= i + 1 || isReduced ? 1 : 0.4,
										}}
										transition={
											isReduced
												? { duration: 0 }
												: { duration: 0.15, delay: 0.1 }
										}
									/>
								</g>
							);
						})}

						{/* Nodes */}
						{steps.map((s, i) => {
							const x = nodeX(i);
							const isActive = step === i;

							return (
								<g
									key={`${pipeline}-${i}`}
									style={{ cursor: "pointer" }}
									onClick={() => handleNodeClick(i)}
								>
									<rect
										x={x}
										y={0}
										width={NODE_W}
										height={NODE_H}
										rx={3}
										fill={SURFACE}
										stroke="none"
									/>
									{isActive && !isReduced && (
										<motion.rect
											x={x - 1}
											y={-1}
											width={NODE_W + 2}
											height={NODE_H + 2}
											rx={4}
											fill="none"
											stroke={ACCENT}
											strokeWidth={1}
											initial={{ opacity: 0 }}
											animate={{ opacity: [0, 0.6, 0] }}
											transition={{
												duration: 1.5,
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
										fill={isActive ? TEXT_ON : TEXT_DIM}
										fontSize={10}
										fontFamily="var(--font-code), monospace"
										letterSpacing="0.04em"
									>
										{s.label}
									</text>
								</g>
							);
						})}
					</svg>
				</div>

				{/* Step description */}
				<div
					className="w-full max-w-[420px] mx-auto min-h-[48px] flex items-start gap-3 px-1"
					style={{ color: TEXT_DIM }}
				>
					<span
						className="mt-[2px] shrink-0 text-[11px] font-medium tabular-nums"
						style={{
							fontFamily: "var(--font-code), monospace",
							color: TEXT_ON,
							opacity: 0.5,
						}}
					>
						{step + 1}/{COUNT}
					</span>
					<AnimatePresence mode="wait">
						<motion.p
							key={`${pipeline}-${step}`}
							className="text-[13px] leading-[1.6]"
							initial={isReduced ? false : { opacity: 0, y: 4 }}
							animate={{ opacity: 1, y: 0 }}
							exit={isReduced ? undefined : { opacity: 0, y: -4 }}
							transition={
								isReduced
									? { duration: 0 }
									: { duration: 0.2, ease: "easeOut" }
							}
						>
							{steps[step].description}
						</motion.p>
					</AnimatePresence>
				</div>
			</div>
		</VisualWrapper>
	);
}
