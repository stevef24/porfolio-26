"use client";

/**
 * MidCard — Blog post card with animated mesh-gradient thumbnail.
 *
 * Shader palette is RANDOMISED per card (deterministic from href so it's
 * stable across renders). Only the icon reflects the topic.
 *
 * Accepts isHovered / onHoverChange for the parent-controlled layoutId
 * hover highlight that slides between cards.
 */

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ViewTransition, useState, useEffect, type CSSProperties } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";
import { springSmooth } from "@/lib/motion-variants";

/* ─────────────────────────────────────────────────────────────────────────────
 * Inline SVG topic icons
 * ───────────────────────────────────────────────────────────────────────────── */

function ReactIcon({ className, style }: { className?: string; style?: CSSProperties }) {
	return (
		<svg viewBox="0 0 24 24" className={className} style={style} fill="none" aria-hidden>
			<circle cx="12" cy="12" r="2" fill="currentColor" />
			<ellipse cx="12" cy="12" rx="9.5" ry="3.5" stroke="currentColor" strokeWidth="1.4" />
			<ellipse cx="12" cy="12" rx="9.5" ry="3.5" stroke="currentColor" strokeWidth="1.4" transform="rotate(60 12 12)" />
			<ellipse cx="12" cy="12" rx="9.5" ry="3.5" stroke="currentColor" strokeWidth="1.4" transform="rotate(120 12 12)" />
		</svg>
	);
}

function CodexIcon({ className, style }: { className?: string; style?: CSSProperties }) {
	return (
		<svg viewBox="0 0 24 24" className={className} style={style} fill="none" aria-hidden>
			<path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
			<path d="M12 6.5L16.5 9.25V14.75L12 17.5L7.5 14.75V9.25L12 6.5Z" fill="currentColor" opacity="0.85" />
		</svg>
	);
}

function AgentsIcon({ className, style }: { className?: string; style?: CSSProperties }) {
	return (
		<svg viewBox="0 0 24 24" className={className} style={style} fill="none" aria-hidden>
			<circle cx="12" cy="12" r="2.4" fill="currentColor" />
			<circle cx="4.5"  cy="7"  r="1.6" fill="currentColor" opacity="0.75" />
			<circle cx="19.5" cy="7"  r="1.6" fill="currentColor" opacity="0.75" />
			<circle cx="4.5"  cy="17" r="1.6" fill="currentColor" opacity="0.75" />
			<circle cx="19.5" cy="17" r="1.6" fill="currentColor" opacity="0.75" />
			<line x1="6"  y1="8"  x2="10.2" y2="11"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			<line x1="18" y1="8"  x2="13.8" y2="11"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			<line x1="6"  y1="16" x2="10.2" y2="13"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
			<line x1="18" y1="16" x2="13.8" y2="13"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
		</svg>
	);
}

function RAGIcon({ className, style }: { className?: string; style?: CSSProperties }) {
	return (
		<svg viewBox="0 0 24 24" className={className} style={style} fill="none" aria-hidden>
			<ellipse cx="12" cy="6"  rx="7" ry="2.5" stroke="currentColor" strokeWidth="1.4" />
			<path d="M5 6v5c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V6" stroke="currentColor" strokeWidth="1.4" />
			<path d="M5 11v5c0 1.38 3.13 2.5 7 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
			<circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.4" />
			<line x1="20" y1="20" x2="22" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

function CodeIcon({ className, style }: { className?: string; style?: CSSProperties }) {
	return (
		<svg viewBox="0 0 24 24" className={className} style={style} fill="none" aria-hidden>
			<path d="M7.5 6L2.5 12L7.5 18"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M16.5 6L21.5 12L16.5 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M13.5 4.5L10.5 19.5"    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Palette pool — randomised per card, stable via href hash
 * ───────────────────────────────────────────────────────────────────────────── */

type Mesh4 = [string, string, string, string];

const PALETTES: Mesh4[] = [
	["#bfdbfe", "#93c5fd", "#dbeafe", "#eff6ff"],   // sky blue
	["#ddd6fe", "#c4b5fd", "#ede9fe", "#f5f3ff"],   // soft violet
	["#fde68a", "#fcd34d", "#fef3c7", "#fed7aa"],   // warm honey
	["#a7f3d0", "#6ee7b7", "#d1fae5", "#99f6e4"],   // sage mint
	["#fecdd3", "#fda4af", "#ffe4e6", "#f9a8d4"],   // editorial rose
	["#fed7aa", "#fdba74", "#ffedd5", "#fde68a"],   // warm peach
	["#a5f3fc", "#67e8f9", "#cffafe", "#7dd3fc"],   // seafoam
	["#c7d2fe", "#a5b4fc", "#e0e7ff", "#ddd6fe"],   // periwinkle
	["#e9d5ff", "#d8b4fe", "#f3e8ff", "#c4b5fd"],   // lilac
	["#fef9c3", "#fef08a", "#fefce8", "#fde68a"],   // cream gold
	["#f9a8d4", "#f472b6", "#fce7f3", "#fecdd3"],   // blush pink
	["#7dd3fc", "#38bdf8", "#bae6fd", "#93c5fd"],   // deep sky
	["#bbf7d0", "#86efac", "#dcfce7", "#a7f3d0"],   // fresh green
	["#e7e5e4", "#d6d3d1", "#f5f5f4", "#fafaf9"],   // warm stone
	["#fcd34d", "#fbbf24", "#fef3c7", "#fed7aa"],   // golden amber
];

function hashStr(s: string): number {
	let h = 5381;
	for (let i = 0; i < s.length; i++) {
		h = ((h << 5) + h) ^ s.charCodeAt(i);
	}
	return Math.abs(h);
}

function getPalette(href: string): Mesh4 {
	return PALETTES[hashStr(href) % PALETTES.length];
}

function slugFromHref(href: string): string {
	const parts = href.split("/").filter(Boolean);
	return parts[parts.length - 1] ?? "post";
}

/** Slightly vary speed/distortion per card for extra visual variety */
function getShaderParams(href: string) {
	const h = hashStr(href);
	return {
		speed:      0.55 + (h % 8) * 0.09,       // 0.55–1.18 — visibly animated
		distortion: 0.65 + (h % 5) * 0.08,       // 0.65–0.97 — rich movement
		swirl:      0.55 + (h % 4) * 0.1,        // 0.55–0.85 — expressive swirl
	};
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Topic → icon mapping (colours are randomised; only icon reflects topic)
 * ───────────────────────────────────────────────────────────────────────────── */

type TopicKey = "react" | "codex" | "agents" | "rag" | "nextjs" | "default";

const TOPIC_ICON: Record<TopicKey, React.ComponentType<{ className?: string; style?: CSSProperties }>> = {
	react:   ReactIcon,
	codex:   CodexIcon,
	agents:  AgentsIcon,
	rag:     RAGIcon,
	nextjs:  CodeIcon,
	default: CodeIcon,
};

function deriveTopic(href: string): TopicKey {
	const s = href.toLowerCase();
	if (s.includes("codex") || s.includes("claude") || s.includes("anthropic")) return "codex";
	if (s.includes("react")) return "react";
	if (s.includes("agent") || s.includes("orchestrat") || s.includes("sdk")) return "agents";
	if (s.includes("rag") || s.includes("retrieval") || s.includes("vector")) return "rag";
	if (s.includes("next")) return "nextjs";
	return "default";
}

/* ─────────────────────────────────────────────────────────────────────────────
 * MidCard
 * ───────────────────────────────────────────────────────────────────────────── */

interface MidCardProps {
	title: string;
	description: string;
	href?: string;
	className?: string;
	titleStyle?: CSSProperties;
	/** Controlled by parent BlogPostsList for shared layoutId hover highlight */
	isHovered?: boolean;
	onHoverChange?: (hovered: boolean) => void;
}

export function MidCard({
	title,
	description,
	href = "#",
	className,
	titleStyle,
	isHovered = false,
	onHoverChange,
}: MidCardProps): JSX.Element {
	const prefersReducedMotion = useReducedMotion();
	const [mounted, setMounted] = useState(false);

	useEffect(() => { setMounted(true); }, []);

	const Icon   = TOPIC_ICON[deriveTopic(href)];
	const mesh   = getPalette(href);
	const params = getShaderParams(href);
	const slug   = slugFromHref(href);
	const fallback = `linear-gradient(135deg, ${mesh[0]}, ${mesh[2]})`;

	return (
		/* Outer wrapper owns the -mx-4 margin and relative stacking context */
		<div
			className={cn("relative -mx-4", className)}
			onMouseEnter={() => onHoverChange?.(true)}
			onMouseLeave={() => onHoverChange?.(false)}
		>
			{/* ── Shared layoutId hover highlight ── */}
			<AnimatePresence>
				{isHovered && (
					<motion.div
						layoutId="midcard-hover-bg"
						className="absolute inset-0 rounded-[6px]"
						style={{ backgroundColor: "var(--sf-bg-subtle)" }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
					/>
				)}
			</AnimatePresence>

			{/* ── Actual link row ── */}
			<Link
				href={href}
				className={cn(
					"group flex items-center gap-4 py-4 px-4",
					"rounded-[6px] relative z-10",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				)}
			>
				{/* ── Animated mesh-gradient thumbnail ── */}
				<div className="post-thumbnail-gradient flex-shrink-0 relative w-[88px] h-[88px] rounded-[10px] overflow-hidden">
					{/* Static fallback (SSR / pre-mount) */}
					{!mounted && (
						<div className="absolute inset-0" style={{ background: fallback }} />
					)}

					{/* Animated mesh (client-only) */}
					{mounted && (
						<MeshGradient
							colors={mesh}
							speed={prefersReducedMotion ? 0 : params.speed}
							distortion={params.distortion}
							swirl={params.swirl}
							style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
						/>
					)}

					{/* Inner vignette for icon contrast */}
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background:
								"radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.3) 100%)",
						}}
					/>

					{/* Hover shimmer */}
					<div
						className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
						style={{
							background:
								"radial-gradient(circle at 28% 28%, rgba(255,255,255,0.3) 0%, transparent 60%)",
						}}
					/>

					{/* Topic icon */}
					<div className="relative z-10 flex items-center justify-center w-full h-full">
						<Icon
							className="w-[30px] h-[30px]"
							style={{ color: "rgba(255,255,255,0.95)" }}
						/>
					</div>
				</div>

				{/* ── Text + arrow ── */}
				<article className="flex-1 min-w-0 flex items-center justify-between gap-4">
					<div className="flex-1 min-w-0">
						<ViewTransition name={`blog-title-${slug}`}>
							<h3
								className="text-swiss-body text-foreground font-medium group-hover:text-foreground/70 transition-colors duration-150 line-clamp-1"
								style={titleStyle}
							>
								{title}
							</h3>
						</ViewTransition>
						<ViewTransition name={`blog-description-${slug}`}>
							<p className="text-swiss-body text-foreground/50 line-clamp-1 mt-0.5">
								{description}
							</p>
						</ViewTransition>
					</div>

					<span
						className={cn(
							"flex-shrink-0 text-foreground/30",
							"group-hover:text-foreground/60",
							"transition-colors duration-150"
						)}
					>
						<HugeiconsIcon
							icon={ArrowUpRight01Icon}
							size={16}
							className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							aria-hidden={true}
						/>
					</span>
				</article>
			</Link>
		</div>
	);
}
