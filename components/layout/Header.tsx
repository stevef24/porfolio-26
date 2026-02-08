"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MoonIcon from "@/components/ui/moon-icon";
import BrightnessDownIcon from "@/components/ui/brightness-down-icon";

/**
 * Floating Pill Header
 *
 * - Always a floating pill with glass effect
 * - No morphing - consistent appearance
 * - Scroll down = hide, scroll up = show
 * - Simple and clean
 */

const links = [
	{ text: "Home", url: "/" },
	{ text: "Courses", url: "/courses" },
	{ text: "Blog", url: "/blog" },
];

export function Header() {
	const { scrollY } = useScroll();
	const [isVisible, setIsVisible] = useState(true);
	const [mounted, setMounted] = useState(false);
	const lastScrollY = useRef(0);
	const { setTheme, resolvedTheme } = useTheme();
	const pathname = usePathname();
	const shouldReduceMotion = useReducedMotion();

	const isDark = mounted ? resolvedTheme === "dark" : false;

	const toggleTheme = () => {
		setTheme(isDark ? "light" : "dark");
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	// Simple scroll direction detection
	useMotionValueEvent(scrollY, "change", (latest) => {
		if (shouldReduceMotion) return;
		const previous = lastScrollY.current;
		const direction = latest > previous ? "down" : "up";

		// Hide when scrolling down past threshold, show when scrolling up
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
			initial={{ y: 0, opacity: 1 }}
			animate={{
				y: shouldReduceMotion ? 0 : isVisible ? 0 : 80,
				opacity: shouldReduceMotion ? 1 : isVisible ? 1 : 0,
			}}
			transition={{
				duration: shouldReduceMotion ? 0 : 0.2,
				ease: [0.25, 0.1, 0.25, 1],
			}}
		>
			{/* Always a floating pill */}
			<div
				className={cn(
					"flex items-center justify-between",
					"py-3 px-6",
					"rounded-full",
					"bg-background/85 backdrop-blur-md",
					"border border-border",
					"shadow-sm dark:shadow-none"
				)}
			>
				{/* Navigation Links */}
				<nav className="flex items-center gap-6">
					{links.map((link) => {
						const isActive = pathname === link.url;
						return (
							<Link
								key={link.url}
								href={link.url}
								aria-current={isActive ? "page" : undefined}
								className={cn(
									"text-swiss-body font-medium transition-colors duration-150",
									isActive
										? "text-foreground"
										: "text-foreground/60 hover:text-foreground"
								)}
							>
								{link.text}
							</Link>
						);
					})}
				</nav>

				{/* Separator */}
				<div className="w-px h-4 bg-border mx-4" />

				{/* Theme Toggle */}
				{!mounted ? (
					<div className="w-8 h-8 rounded-full bg-muted/50" />
				) : (
					<button
						onClick={toggleTheme}
						type="button"
						className={cn(
							"relative flex items-center justify-center w-9 h-9 rounded-full",
							"border border-[var(--btn-outline-border)]",
							"bg-[var(--btn-subtle-bg)] text-[var(--btn-subtle-fg)]",
							"transition-colors duration-150 cursor-pointer",
							"hover:bg-[var(--btn-subtle-bg-hover)] hover:text-foreground",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
						)}
						aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
					>
						{isDark ? (
							<BrightnessDownIcon size={16} strokeWidth={1.5} aria-hidden="true" />
						) : (
							<MoonIcon size={16} strokeWidth={1.5} aria-hidden="true" />
						)}
					</button>
				)}
			</div>
		</motion.header>
	);
}
