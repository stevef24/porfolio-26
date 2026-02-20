"use client";

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
	Sun01Icon,
} from "@hugeicons/core-free-icons";
import { useFeature } from "@/lib/features";

/* ─────────────────────────────────────────────────────────────────────────
 * Per-icon animation personalities
 *
 *  bounce  → Home:        quick upward pop + scale (friendly, inviting)
 *  tilt    → Blog/Course: wobble left-right (like flipping a page)
 *  shake   → Experiments: test-tube shake (excited, lab-energy)
 *  spin    → Sun (dark):  quarter clockwise spin (sun rotating)
 *  rock    → Moon (light): pendulum rock (moon swaying)
 * ───────────────────────────────────────────────────────────────────────── */
type NavAnimation = "bounce" | "tilt" | "shake";

const BASE_LINKS = [
	{ text: "Home", url: "/", icon: Home01Icon, animation: "bounce" as NavAnimation },
	{ text: "Courses", url: "/courses", icon: CourseIcon, animation: "tilt" as NavAnimation },
	{ text: "Blog", url: "/blog", icon: News01Icon, animation: "tilt" as NavAnimation },
	{ text: "Experiments", url: "/experiments", icon: TestTube01Icon, animation: "shake" as NavAnimation },
];

/* ─────────────────────────────────────────────────────────────────────────
 * NavLink — individual link with icon hover animation
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
					{ y: [0, -4, 0], scale: [1, 1.2, 1] },
					{ duration: 0.32, ease: "easeOut" }
				);
				break;
			case "tilt":
				animate(
					scope.current,
					{ rotate: [0, -12, 12, 0] },
					{ duration: 0.4, ease: "easeInOut" }
				);
				break;
			case "shake":
				animate(
					scope.current,
					{ rotate: [0, -15, 15, -10, 10, 0] },
					{ duration: 0.5, ease: "easeInOut" }
				);
				break;
		}
	};

	const handleMouseLeave = () => {
		if (prefersReducedMotion || !scope.current) return;
		animate(
			scope.current,
			{ y: 0, rotate: 0, scale: 1 },
			{ duration: 0.2, ease: "easeOut" }
		);
	};

	return (
		<Link
			href={href}
			aria-current={isActive ? "page" : undefined}
			aria-label={text}
			title={text}
			className={cn(
				"flex items-center justify-center w-8 h-8 rounded-full",
				"transition-colors duration-150",
				isActive
					? "text-foreground"
					: "text-foreground/50 hover:text-foreground"
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<motion.span
				ref={scope}
				className="inline-flex items-center justify-center"
				style={{ transformOrigin: "center" }}
			>
				<HugeiconsIcon
					icon={icon}
					size={16}
					strokeWidth={isActive ? 2.5 : 2}
					aria-hidden="true"
				/>
			</motion.span>
		</Link>
	);
}

/* ─────────────────────────────────────────────────────────────────────────
 * ThemeToggleButton — hover spin (sun) or rock (moon) + existing blur swap
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
			// Sun: spin clockwise — hints "switching to daytime"
			animate(
				scope.current,
				{ rotate: 45 },
				{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }
			);
		} else {
			// Moon: gentle pendulum rock
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

	if (!mounted) return <div className="w-8 h-8" />;

	return (
		<button
			onClick={onToggle}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			type="button"
			className={cn(
				"relative flex items-center justify-center w-8 h-8 rounded-full",
				"text-foreground/50 transition-colors duration-150 cursor-pointer",
				"hover:text-foreground",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
			)}
			aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
			title={`Switch to ${isDark ? "light" : "dark"} mode`}
		>
			{/* Outer wrapper handles hover rotation; inner AnimatePresence handles theme swap */}
			<motion.span
				ref={scope}
				className="inline-flex items-center justify-center"
				style={{ transformOrigin: "center" }}
			>
				<AnimatePresence mode="wait" initial={false}>
					{isDark ? (
						<motion.span
							key="sun"
							initial={{ opacity: 0, filter: "blur(4px)", scale: 0.8 }}
							animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
							exit={{ opacity: 0, filter: "blur(4px)", scale: 0.8 }}
							transition={{ duration: 0.18, ease: "easeInOut" }}
							className="flex items-center justify-center"
						>
							<HugeiconsIcon icon={Sun01Icon} size={15} strokeWidth={2} aria-hidden="true" />
						</motion.span>
					) : (
						<motion.span
							key="moon"
							initial={{ opacity: 0, filter: "blur(4px)", scale: 0.8 }}
							animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
							exit={{ opacity: 0, filter: "blur(4px)", scale: 0.8 }}
							transition={{ duration: 0.18, ease: "easeInOut" }}
							className="flex items-center justify-center"
						>
							<HugeiconsIcon icon={Moon02Icon} size={15} strokeWidth={2} aria-hidden="true" />
						</motion.span>
					)}
				</AnimatePresence>
			</motion.span>
		</button>
	);
}

/* ─────────────────────────────────────────────────────────────────────────
 * Header
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
	const links = coursesEnabled
		? BASE_LINKS
		: BASE_LINKS.filter((link) => link.url !== "/courses");

	const isDark = mounted ? resolvedTheme === "dark" : false;

	/* Hide navbar entirely on experiment detail pages (back arrow provides nav) */
	const isExperimentDetail =
		pathname.startsWith("/experiments/") && pathname !== "/experiments";
	const shouldShow = isExperimentDetail ? false : isVisible;

	const toggleTheme = () => {
		setTheme(isDark ? "light" : "dark");
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	useMotionValueEvent(scrollY, "change", (latest) => {
		if (shouldReduceMotion) return;
		const previous = lastScrollY.current;
		const direction = latest > previous ? "down" : "up";

		if (direction === "down" && latest > 100) {
			setIsVisible(false);
		} else if (direction === "up") {
			setIsVisible(true);
		}

		lastScrollY.current = latest;
	});

	return (
		<motion.header
			className="fixed bottom-11 left-0 right-0 z-50 flex justify-center px-4"
			initial={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
			animate={{
				y: shouldReduceMotion ? 0 : shouldShow ? 0 : 80,
				opacity: shouldReduceMotion ? 1 : shouldShow ? 1 : 0,
				scale: shouldReduceMotion ? 1 : shouldShow ? 1 : 0.92,
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
						? { type: "spring", stiffness: 400, damping: 35 }
						: { duration: 0.22, ease: [0.4, 0, 1, 1] }
			}
		>
			<div
				className={cn(
					"flex items-center justify-between",
					"py-3 px-5",
					"rounded-full",
					"bg-background/90 backdrop-blur-2xl",
					"border border-border",
					"shadow-sm dark:shadow-none"
				)}
			>
				{/* Navigation Links */}
				<nav className="flex items-center gap-0.5">
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
				</nav>

				{/* Separator */}
				<div className="w-px h-4 bg-border mx-3" />

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
