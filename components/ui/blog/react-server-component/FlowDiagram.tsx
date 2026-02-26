"use client";

/*
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  RSC Render Flow — Swiss-minimal SVG diagram                    │
 * │                                                                 │
 * │  Three zones: Client → Server → Client                         │
 * │                                                                 │
 * │  ┌─ CLIENT ──────────────────────────────────────┐             │
 * │  │  Component Request                             │             │
 * │  └────────────────────┬───────────────────────────┘             │
 * │                       │                                         │
 * │                       ▼                                         │
 * │  ┌─ SERVER ──────────────────────────────────────┐             │
 * │  │  SSR ──→ Data Fetch ──→ Serialize              │             │
 * │  └────────────────────┬───────────────────────────┘             │
 * │                       │                                         │
 * │                       ▼                                         │
 * │  ┌─ CLIENT ──────────────────────────────────────┐             │
 * │  │  Integration ──→ Interactive DOM               │             │
 * │  └───────────────────────────────────────────────┘             │
 * │                                                                 │
 * │  Auto-plays through 6 steps, highlights active node.           │
 * └─────────────────────────────────────────────────────────────────┘
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "motion/react";
import { VisualWrapper } from "@/components/visuals/VisualWrapper";

/* ── Timing ────────────────────────────────────────────────────── */
const STEP_INTERVAL = 2200;
const TOTAL_STEPS = 6;

/* ── Colours (CSS vars from design system) ─────────────────────── */
const ACCENT = "var(--va-fg)";
const TEXT_PRIMARY = "var(--sf-text-primary)";
const TEXT_DIM = "var(--sf-text-tertiary)";
const SURFACE = "var(--sf-bg-surface)";
const ZONE_BG = "var(--sf-bg-subtle)";
const BORDER = "var(--sf-border-subtle)";

/* ── SVG layout constants ──────────────────────────────────────── */
const SVG_W = 440;
const SVG_H = 264;
const NODE_W = 96;
const NODE_H = 34;
const NODE_R = 3;

/* ── Step data ─────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Request",       zone: "client-initial" },
  { id: 2, label: "SSR",           zone: "server" },
  { id: 3, label: "Data Fetch",    zone: "server" },
  { id: 4, label: "Serialize",     zone: "server" },
  { id: 5, label: "Integration",   zone: "client-final" },
  { id: 6, label: "Interactive",   zone: "client-final" },
] as const;

const EXPLANATIONS: Record<number, { title: string; desc: string }> = {
  1: { title: "Component Request",    desc: "The client initiates a request for a React Server Component during page load or navigation." },
  2: { title: "Server-Side Rendering", desc: "The server receives the request and begins executing the server component code." },
  3: { title: "Data Fetching",         desc: "The component directly accesses databases, APIs, or other data sources on the server." },
  4: { title: "Serialization",         desc: "The server serializes the rendered output into a format that can be streamed to the client." },
  5: { title: "Client Integration",    desc: "The client receives the serialized output and begins integrating it into the page." },
  6: { title: "Interactive DOM",       desc: "The server component is fully integrated into the DOM and becomes interactive." },
};

/* ── Node positions (pre-computed) ─────────────────────────────── */
// Zone 1: Client Initial — single centered node
const Z1_Y = 30;
const Z1_H = 54;
const NODE_1 = { x: (SVG_W - NODE_W) / 2, y: Z1_Y + (Z1_H - NODE_H) / 2 };

// Zone 2: Server — three nodes in a row
const Z2_Y = 114;
const Z2_H = 54;
const SERVER_GAP = 28;
const SERVER_TOTAL = NODE_W * 3 + SERVER_GAP * 2;
const SERVER_X0 = (SVG_W - SERVER_TOTAL) / 2;
const NODE_2 = { x: SERVER_X0, y: Z2_Y + (Z2_H - NODE_H) / 2 };
const NODE_3 = { x: SERVER_X0 + NODE_W + SERVER_GAP, y: Z2_Y + (Z2_H - NODE_H) / 2 };
const NODE_4 = { x: SERVER_X0 + 2 * (NODE_W + SERVER_GAP), y: Z2_Y + (Z2_H - NODE_H) / 2 };

// Zone 3: Client Final — two nodes
const Z3_Y = 198;
const Z3_H = 54;
const CLIENT_GAP = 28;
const CLIENT_TOTAL = NODE_W * 2 + CLIENT_GAP;
const CLIENT_X0 = (SVG_W - CLIENT_TOTAL) / 2;
const NODE_5 = { x: CLIENT_X0, y: Z3_Y + (Z3_H - NODE_H) / 2 };
const NODE_6 = { x: CLIENT_X0 + NODE_W + CLIENT_GAP, y: Z3_Y + (Z3_H - NODE_H) / 2 };

const NODE_POSITIONS = [NODE_1, NODE_2, NODE_3, NODE_4, NODE_5, NODE_6];

/* ── Component ─────────────────────────────────────────────────── */
const FlowDiagram: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [step, setStep] = useState(prefersReducedMotion ? 1 : 0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(!!prefersReducedMotion);

  const runSequence = useCallback(() => {
    if (prefersReducedMotion) return;
    setStep(1);
    setHasPlayed(true);
    setIsPlaying(true);
  }, [prefersReducedMotion]);

  // Auto-start on view
  useEffect(() => {
    if (isInView && !hasPlayed) {
      const t = setTimeout(runSequence, 300);
      return () => clearTimeout(t);
    }
  }, [isInView, hasPlayed, runSequence]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying || !hasPlayed) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev % TOTAL_STEPS) + 1);
    }, STEP_INTERVAL);
    return () => clearInterval(interval);
  }, [isPlaying, hasPlayed]);

  const handleNodeClick = (s: number) => {
    setStep(s);
    setIsPlaying(false);
    setHasPlayed(true);
  };

  const handleReplay = () => {
    setStep(1);
    setIsPlaying(true);
    setHasPlayed(true);
  };

  const isReduced = !!prefersReducedMotion;
  const activeStep = step || 1;

  return (
    <VisualWrapper
      label="React Server Component render flow"
      tone="neutral"
      onReplay={handleReplay}
      showReplay={hasPlayed && !isReduced}
    >
      <div ref={ref} className="flex flex-col items-center gap-5">
        {/* Play/pause + step counter */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="font-mono text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 rounded transition-colors"
            style={{
              color: TEXT_DIM,
              backgroundColor: ZONE_BG,
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <span
            className="font-mono text-[10px] tracking-wide"
            style={{ color: TEXT_DIM }}
          >
            Step {activeStep} / {TOTAL_STEPS}
          </span>
        </div>

        {/* SVG diagram */}
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="block w-full max-w-[480px]"
          fill="none"
          role="img"
          aria-label="RSC render flow: Request, SSR, Data Fetch, Serialize, Integration, Interactive DOM"
        >
          {/* Zone backgrounds */}
          <Zone y={Z1_Y} h={Z1_H} label="CLIENT" labelX={14} />
          <Zone y={Z2_Y} h={Z2_H} label="SERVER" labelX={14} />
          <Zone y={Z3_Y} h={Z3_H} label="CLIENT" labelX={14} />

          {/* Vertical arrows between zones */}
          <VerticalArrow
            x={SVG_W / 2}
            y1={Z1_Y + Z1_H}
            y2={Z2_Y}
            active={activeStep >= 2}
            reduced={isReduced}
          />
          <VerticalArrow
            x={SVG_W / 2}
            y1={Z2_Y + Z2_H}
            y2={Z3_Y}
            active={activeStep >= 5}
            reduced={isReduced}
          />

          {/* Horizontal arrows within server zone */}
          <HorizontalArrow
            x1={NODE_2.x + NODE_W}
            x2={NODE_3.x}
            y={NODE_2.y + NODE_H / 2}
            active={activeStep >= 3}
            reduced={isReduced}
          />
          <HorizontalArrow
            x1={NODE_3.x + NODE_W}
            x2={NODE_4.x}
            y={NODE_3.y + NODE_H / 2}
            active={activeStep >= 4}
            reduced={isReduced}
          />

          {/* Horizontal arrow within client-final zone */}
          <HorizontalArrow
            x1={NODE_5.x + NODE_W}
            x2={NODE_6.x}
            y={NODE_5.y + NODE_H / 2}
            active={activeStep >= 6}
            reduced={isReduced}
          />

          {/* Nodes */}
          {STEPS.map((s, i) => (
            <FlowNode
              key={s.id}
              x={NODE_POSITIONS[i].x}
              y={NODE_POSITIONS[i].y}
              label={s.label}
              active={activeStep === s.id}
              visible={isReduced || hasPlayed}
              delay={isReduced ? 0 : i * 0.08}
              reduced={isReduced}
              onClick={() => handleNodeClick(s.id)}
            />
          ))}
        </svg>

        {/* Step explanation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={isReduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReduced ? undefined : { opacity: 0, y: -6 }}
            transition={isReduced ? { duration: 0 } : { duration: 0.15, ease: "easeOut" }}
            className="w-full max-w-[480px] text-center"
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.1em] mb-1"
              style={{ color: TEXT_PRIMARY }}
            >
              {EXPLANATIONS[activeStep].title}
            </p>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: TEXT_DIM }}
            >
              {EXPLANATIONS[activeStep].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Flow summary */}
        <p
          className="font-mono text-[9px] uppercase tracking-[0.12em]"
          style={{ color: TEXT_DIM }}
        >
          Request → SSR → Data → Serialize → Integrate → DOM
        </p>
      </div>
    </VisualWrapper>
  );
};

export default FlowDiagram;

/* ── Sub-components ────────────────────────────────────────────── */

function Zone({ y, h, label, labelX }: { y: number; h: number; label: string; labelX: number }) {
  return (
    <g>
      <rect
        x={8}
        y={y}
        width={SVG_W - 16}
        height={h}
        rx={4}
        fill={ZONE_BG}
        stroke={BORDER}
        strokeWidth={0.5}
      />
      <text
        x={labelX}
        y={y - 6}
        fontSize={8}
        fontFamily="var(--font-code), monospace"
        letterSpacing="0.12em"
        fill={TEXT_DIM}
      >
        {label}
      </text>
    </g>
  );
}

function FlowNode({
  x,
  y,
  label,
  active,
  visible,
  delay,
  reduced,
  onClick,
}: {
  x: number;
  y: number;
  label: string;
  active: boolean;
  visible: boolean;
  delay: number;
  reduced: boolean;
  onClick: () => void;
}) {
  return (
    <motion.g
      initial={reduced ? undefined : { opacity: 0, y: 4 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
      transition={
        reduced
          ? { duration: 0 }
          : { delay, type: "spring", visualDuration: 0.3, bounce: 0.1 }
      }
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <rect
        x={x}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx={NODE_R}
        fill={SURFACE}
        stroke={active ? ACCENT : "transparent"}
        strokeWidth={active ? 1 : 0}
      />
      {active && (
        <motion.rect
          x={x - 1}
          y={y - 1}
          width={NODE_W + 2}
          height={NODE_H + 2}
          rx={NODE_R + 1}
          fill="none"
          stroke={ACCENT}
          strokeWidth={0.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <text
        x={x + NODE_W / 2}
        y={y + NODE_H / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontFamily="var(--font-code), monospace"
        letterSpacing="0.03em"
        fill={active ? TEXT_PRIMARY : TEXT_DIM}
      >
        {label}
      </text>
    </motion.g>
  );
}

function HorizontalArrow({
  x1,
  x2,
  y,
  active,
  reduced,
}: {
  x1: number;
  x2: number;
  y: number;
  active: boolean;
  reduced: boolean;
}) {
  return (
    <g>
      <motion.line
        x1={x1 + 4}
        y1={y}
        x2={x2 - 8}
        y2={y}
        stroke={ACCENT}
        strokeWidth={1}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
      />
      <motion.polyline
        points={`${x2 - 12},${y - 3} ${x2 - 6},${y} ${x2 - 12},${y + 3}`}
        stroke={ACCENT}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 0.5 } : { opacity: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.15, delay: 0.15 }}
      />
    </g>
  );
}

function VerticalArrow({
  x,
  y1,
  y2,
  active,
  reduced,
}: {
  x: number;
  y1: number;
  y2: number;
  active: boolean;
  reduced: boolean;
}) {
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <motion.line
        x1={x}
        y1={y1 + 4}
        x2={x}
        y2={y2 - 8}
        stroke={ACCENT}
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray="3 2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
      />
      <motion.polyline
        points={`${x - 3},${y2 - 10} ${x},${y2 - 4} ${x + 3},${y2 - 10}`}
        stroke={ACCENT}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 0.4 } : { opacity: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.15, delay: 0.2 }}
      />
    </g>
  );
}
