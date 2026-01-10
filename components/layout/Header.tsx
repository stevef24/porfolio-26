"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MoonIcon from "@/components/ui/moon-icon";
import BrightnessDownIcon from "@/components/ui/brightness-down-icon";

/**
 * Minimal Glass Header
 *
 * - Consistent width matching main content (--content-width: 840px)
 * - Scroll direction aware: hides on scroll down, shows on scroll up
 * - Minimal design: just links + theme toggle
 * - Glass effect when scrolled
 * - ItsHover animated icons for theme toggle
 */

const links = [
	{ text: "Home", url: "/" },
	{ text: "Blog", url: "/blog" },
];

export function Header() {
	const { scrollY } = useScroll();
	const [isVisible, setIsVisible] = useState(true);
	const [hasScrolled, setHasScrolled] = useState(false);
	const [mounted, setMounted] = useState(false);
	const lastScrollY = useRef(0);
	const { setTheme, resolvedTheme } = useTheme();
	const pathname = usePathname();

	const isDark = mounted ? resolvedTheme === "dark" : false;

	const toggleTheme = () => {
		setTheme(isDark ? "light" : "dark");
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	// Scroll direction detection
	useMotionValueEvent(scrollY, "change", (latest) => {
		const previous = lastScrollY.current;
		const direction = latest > previous ? "down" : "up";

		// Show/hide based on scroll direction
		if (direction === "down" && latest > 100) {
			setIsVisible(false);
		} else {
			setIsVisible(true);
		}

		// Track if we've scrolled past the threshold for glass effect
		setHasScrolled(latest > 20);
		lastScrollY.current = latest;
	});

	return (
		<motion.header
			className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 lg:px-6"
			initial={{ y: 0 }}
			animate={{
				y: isVisible ? 0 : -100,
			}}
			transition={{
				duration: 0.3,
				ease: [0.25, 0.1, 0.25, 1],
			}}
		>
			<motion.div
				className={cn(
					"w-full flex items-center justify-between",
					"py-4",
					"max-w-[var(--content-width)]"
				)}
				initial={false}
				animate={{
					backgroundColor: hasScrolled
						? isDark
							? "rgba(14, 14, 12, 0.85)"
							: "rgba(248, 246, 239, 0.85)"
						: "rgba(0, 0, 0, 0)",
					backdropFilter: hasScrolled ? "blur(12px)" : "blur(0px)",
					borderRadius: hasScrolled ? 9999 : 0,
					marginTop: hasScrolled ? 16 : 0,
					paddingLeft: hasScrolled ? 24 : 0,
					paddingRight: hasScrolled ? 24 : 0,
					boxShadow: hasScrolled
						? isDark
							? "0 1px 0 0 rgba(255,255,255,0.05), 0 4px 20px -4px rgba(0,0,0,0.3)"
							: "0 1px 0 0 rgba(0,0,0,0.03), 0 4px 20px -4px rgba(0,0,0,0.08)"
						: "0 0 0 0 rgba(0,0,0,0)",
				}}
				transition={{
					duration: 0.35,
					ease: [0.4, 0, 0.2, 1],
				}}
			>
				{/* Navigation Links */}
				<nav className="flex items-center gap-8">
					{links.map((link) => {
						const isActive = pathname === link.url;
						return (
							<Link
								key={link.url}
								href={link.url}
								className={cn(
									"relative text-sm font-medium tracking-wide transition-colors duration-200",
									isActive
										? "text-foreground"
										: "text-muted-foreground hover:text-foreground"
								)}
							>
								{link.text}
								{isActive && (
									<motion.div
										layoutId="nav-indicator"
										className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
										transition={{ type: "spring", stiffness: 500, damping: 30 }}
									/>
								)}
							</Link>
						);
					})}
				</nav>

				{/* Theme Toggle */}
				{!mounted ? (
					<div className="w-8 h-8 rounded-full bg-muted/50" />
				) : (
					<button
						onClick={toggleTheme}
						className={cn(
							"relative flex items-center justify-center w-8 h-8 rounded-full",
							"transition-colors duration-200 cursor-pointer",
							"hover:bg-muted"
						)}
						aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
					>
						<motion.div
							className="absolute inset-0 flex items-center justify-center"
							initial={false}
							animate={{
								scale: isDark ? 1 : 0,
								opacity: isDark ? 1 : 0,
								rotate: isDark ? 0 : -90,
							}}
							transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
						>
							<BrightnessDownIcon size={18} strokeWidth={1.5} />
						</motion.div>
						<motion.div
							className="absolute inset-0 flex items-center justify-center"
							initial={false}
							animate={{
								scale: isDark ? 0 : 1,
								opacity: isDark ? 0 : 1,
								rotate: isDark ? 90 : 0,
							}}
							transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
						>
							<MoonIcon size={18} strokeWidth={1.5} />
						</motion.div>
					</button>
				)}
			</motion.div>
		</motion.header>
	);
}
