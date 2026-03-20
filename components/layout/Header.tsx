"use client";

/* ─────────────────────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — Bottom Dock (C1 Terminal)
 *
 * Entrance (scroll up — show):
 *    0ms   Dock rises as single unit
 *          translateY(16px → 0), opacity(0 → 1), blur(4px → 0)
 *          280ms, ease-out: cubic-bezier(0.23, 1, 0.32, 1)
 *
 * Exit (scroll down — hide):
 *    0ms   Fast dissolve, all items leave together
 *          translateY(0 → 16px), opacity(1 → 0), blur(0 → 4px)
 *          180ms, ease-out-fast: cubic-bezier(0.4, 0, 0.2, 1)
 *
 * Active state transition:
 *    0ms   Color-only: icon + label brighten/dim
 *          180ms, ease-out. No background chip, no border.
 *
 * Per-icon hover (desktop only):
 *  home    bounce: translateY(-2px) scale(1.12), 320ms spring
 *  blog    tilt: rotate(-8° → 8° → 0), 350ms ease-out
 *  lab     shake: rotate(-10° → 8° → -4° → 0) + scale, 400ms ease-out
 *  theme   spin: rotate(0 → 45°), 450ms spring  |  rock: pendulum
 *
 * Reduced motion: no transforms, instant transitions
 * ───────────────────────────────────────────────────────────────────────── */

import { useEffect, useState, useRef } from "react";
import {
	motion,
	AnimatePresence,
	useScroll,
	useMotionValueEvent,
	useReducedMotion,
	useAnimate,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Home01Icon,
	News01Icon,
	TestTube01Icon,
	CourseIcon,
	Moon02Icon,
	Sun02Icon,
} from "@hugeicons/core-free-icons";
import { useFeature } from "@/lib/features";

/* ── Animation constants ─────────────────────────────────────────────── */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_OUT_FAST = [0.4, 0, 0.2, 1] as const;
const SPRING_BOUNCY = { type: "spring" as const, duration: 0.32, bounce: 0.35 };
const SCROLL_THRESHOLD = 80;

/* ── Timing ──────────────────────────────────────────────────────────── */
const ENTER_DURATION = 0.28;
const EXIT_DURATION = 0.18;
const COLOR_DURATION = 0.18;

/* ── Dock color tokens — CSS variables adapt to light/dark automatically */
const DOCK = {
	surface: "var(--dock-surface)",
	border: "var(--dock-border)",
	shadow: "var(--dock-shadow)",
	iconActive: "var(--dock-icon-active)",
	iconInactive: "var(--dock-icon-inactive)",
	iconHover: "var(--dock-icon-hover)",
	labelActive: "var(--dock-label-active)",
	labelInactive: "var(--dock-label-inactive)",
} as const;

/* ── Nav animation types ─────────────────────────────────────────────── */
type NavAnimation = "bounce" | "tilt" | "shake";

const BASE_LINKS = [
	{ text: "Home", url: "/", icon: Home01Icon, animation: "bounce" as NavAnimation },
	{ text: "Courses", url: "/courses", icon: CourseIcon, animation: "tilt" as NavAnimation },
	{ text: "Blog", url: "/blog", icon: News01Icon, animation: "tilt" as NavAnimation },
	{ text: "Lab", url: "/experiments", icon: TestTube01Icon, animation: "shake" as NavAnimation },
];

const MotionLink = motion.create(Link);

/* ─────────────────────────────────────────────────────────────────────────
 * NavLink — individual dock item with color-only active state
 * ───────────────────────────────────────────────────────────────────────── */
function NavLink({
	href,
	icon,
	animation,
	isActive,
	text,
}: {
	href: string;
	icon: typeof Home01Icon;
	animation: NavAnimation;
	isActive: boolean;
	text: string;
}) {
	const [scope, animate] = useAnimate();
	const prefersReducedMotion = useReducedMotion();

	const handleMouseEnter = () => {
		if (prefersReducedMotion || !scope.current) return;
		switch (animation) {
			case "bounce":
				animate(
					scope.current,
					{ y: [0, -2, 0], scale: [1, 1.12, 1] },
					{ duration: 0.32, ease: "easeOut" }
				);
				break;
			case "tilt":
				animate(
					scope.current,
					{ rotate: [0, -8, 8, 0] },
					{ duration: 0.35, ease: "easeOut" }
				);
				break;
			case "shake":
				animate(
					scope.current,
					{ rotate: [0, -10, 8, -4, 0], scale: [1, 1.08, 1.05, 1, 1] },
					{ duration: 0.4, ease: "easeOut" }
				);
				break;
		}
	};

	const resetTransform = () => {
		if (!scope.current) return;
		animate(
			scope.current,
			{ y: 0, rotate: 0, scale: 1 },
			{ duration: 0.2, ease: "easeOut" }
		);
	};

	return (
		<MotionLink
			href={href}
			aria-current={isActive ? "page" : undefined}
			aria-label={text}
			className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] outline-none"
			style={{
				transition: `color ${COLOR_DURATION * 1000}ms cubic-bezier(${EASE_OUT.join(",")})`,
			}}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={resetTransform}
			onClick={resetTransform}
		>
			<motion.span
				ref={scope}
				className="inline-flex items-center justify-center"
				style={{ transformOrigin: "center" }}
			>
				<HugeiconsIcon
					icon={icon}
					size={14}
					strokeWidth={1.5}
					aria-hidden="true"
					style={{
						color: isActive ? DOCK.iconActive : DOCK.iconInactive,
						transition: `color ${COLOR_DURATION * 1000}ms cubic-bezier(${EASE_OUT.join(",")})`,
					}}
				/>
			</motion.span>
			<span
				className="font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] leading-none"
				style={{
					color: isActive ? DOCK.labelActive : DOCK.labelInactive,
					transition: `color ${COLOR_DURATION * 1000}ms cubic-bezier(${EASE_OUT.join(",")})`,
				}}
				aria-hidden="true"
			>
				{text}
			</span>
		</MotionLink>
	);
}

/* ─────────────────────────────────────────────────────────────────────────
 * ThemeToggleButton — spin (sun) or rock (moon)
 * ───────────────────────────────────────────────────────────────────────── */
function ThemeToggleButton({
	isDark,
	onToggle,
	mounted,
}: {
	isDark: boolean;
	onToggle: () => void;
	mounted: boolean;
}) {
	const [scope, animate] = useAnimate();
	const prefersReducedMotion = useReducedMotion();

	const handleMouseEnter = () => {
		if (prefersReducedMotion || !scope.current) return;
		if (isDark) {
			animate(
				scope.current,
				{ rotate: 45 },
				{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }
			);
		} else {
			animate(
				scope.current,
				{ rotate: [0, -20, 5, 0] },
				{ duration: 0.45, ease: "easeOut" }
			);
		}
	};

	const handleMouseLeave = () => {
		if (prefersReducedMotion || !scope.current) return;
		animate(
			scope.current,
			{ rotate: 0 },
			{ duration: 0.25, ease: "easeOut" }
		);
	};

	if (!mounted) return <div className="min-w-[40px] min-h-[40px]" />;

	return (
		<motion.button
			onClick={onToggle}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			type="button"
			className="relative flex items-center justify-center px-2.5 py-2 rounded-[4px] cursor-pointer outline-none will-change-transform"
			aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
		>
			<motion.span
				ref={scope}
				className="inline-flex items-center justify-center"
				style={{ transformOrigin: "center" }}
			>
				<AnimatePresence mode="wait" initial={false}>
					{isDark ? (
						<motion.span
							key="sun"
							initial={{ opacity: 0, filter: "blur(6px)" }}
							animate={{ opacity: 1, filter: "blur(0px)" }}
							exit={{ opacity: 0, filter: "blur(6px)" }}
							transition={{ duration: 0.25, ease: "easeOut" }}
							className="flex items-center justify-center"
						>
							<HugeiconsIcon
								icon={Sun02Icon}
								size={14}
								strokeWidth={1.5}
								aria-hidden="true"
								style={{ color: DOCK.iconInactive }}
							/>
						</motion.span>
					) : (
						<motion.span
							key="moon"
							initial={{ opacity: 0, filter: "blur(6px)" }}
							animate={{ opacity: 1, filter: "blur(0px)" }}
							exit={{ opacity: 0, filter: "blur(6px)" }}
							transition={{ duration: 0.25, ease: "easeOut" }}
							className="flex items-center justify-center"
						>
							<HugeiconsIcon
								icon={Moon02Icon}
								size={14}
								strokeWidth={1.5}
								aria-hidden="true"
								style={{ color: DOCK.iconInactive }}
							/>
						</motion.span>
					)}
				</AnimatePresence>
			</motion.span>
		</motion.button>
	);
}

/* ─────────────────────────────────────────────────────────────────────────
 * Header — iOS-style dock, flush to bottom, glassmorphic
 * ───────────────────────────────────────────────────────────────────────── */
export function Header() {
	const { scrollY } = useScroll();
	const [isVisible, setIsVisible] = useState(true);
	const [mounted, setMounted] = useState(false);
	const lastScrollY = useRef(0);
	const { setTheme, resolvedTheme } = useTheme();
	const pathname = usePathname();
	const shouldReduceMotion = useReducedMotion();
	const coursesEnabled = useFeature("courses");
	const experimentsEnabled = useFeature("experiments");

	const links = BASE_LINKS.filter((link) => {
		if (link.url === "/courses" && !coursesEnabled) return false;
		if (link.url === "/experiments" && !experimentsEnabled) return false;
		return true;
	});

	const isDark = mounted ? resolvedTheme === "dark" : false;

	/* Hide navbar on experiment detail pages */
	const isExperimentDetail =
		pathname.startsWith("/experiments/") && pathname !== "/experiments";
	const shouldShow = isExperimentDetail ? false : isVisible;

	const toggleTheme = () => setTheme(isDark ? "light" : "dark");

	useEffect(() => { setMounted(true); }, []);

	/* Scroll-based show/hide — intent-based */
	useMotionValueEvent(scrollY, "change", (latest) => {
		if (shouldReduceMotion) return;
		const previous = lastScrollY.current;

		// Always show at top of page
		if (latest <= SCROLL_THRESHOLD) {
			setIsVisible(true);
			lastScrollY.current = latest;
			return;
		}

		if (latest > previous) {
			setIsVisible(false);
		} else if (latest < previous) {
			setIsVisible(true);
		}

		lastScrollY.current = latest;
	});

	return (
		<motion.header
			role="navigation"
			aria-label="Main navigation"
			className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4"
			style={{
				paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))",
			}}
			initial={{ y: 0, opacity: 1, filter: "blur(0px)" }}
			animate={{
				y: shouldReduceMotion ? 0 : shouldShow ? 0 : 16,
				opacity: shouldReduceMotion ? 1 : shouldShow ? 1 : 0,
				filter: shouldReduceMotion
					? "blur(0px)"
					: shouldShow
						? "blur(0px)"
						: "blur(4px)",
			}}
			transition={
				shouldReduceMotion
					? { duration: 0 }
					: shouldShow
						? { duration: ENTER_DURATION, ease: EASE_OUT }
						: { duration: EXIT_DURATION, ease: EASE_OUT_FAST }
			}
		>
			<div
				className="flex items-center gap-0.5 py-1.5 px-2.5 rounded-[10px]"
				style={{
					background: DOCK.surface,
					backdropFilter: "saturate(1.0) blur(40px)",
					WebkitBackdropFilter: "saturate(1.0) blur(40px)",
					border: `1px solid ${DOCK.border}`,
					boxShadow: DOCK.shadow,
				}}
			>
				{/* Navigation Links */}
				{links.map((link) => {
					const isActive =
						link.url === "/"
							? pathname === "/"
							: pathname.startsWith(link.url);
					return (
						<NavLink
							key={link.url}
							href={link.url}
							icon={link.icon}
							animation={link.animation}
							isActive={isActive}
							text={link.text}
						/>
					);
				})}

				{/* Theme Toggle */}
				<ThemeToggleButton
					isDark={isDark}
					onToggle={toggleTheme}
					mounted={mounted}
				/>
			</div>
		</motion.header>
	);
}
