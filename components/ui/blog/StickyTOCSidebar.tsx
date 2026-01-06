"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import {
	springGentle,
	tocItem,
	getReducedMotionTransition,
} from "@/lib/motion-variants";

interface TOCItem {
	title: string;
	url: string;
	depth: number;
}

interface StickyTOCSidebarProps {
	/** Array of table of contents items from Fumadocs */
	items: TOCItem[];
	/** Additional CSS classes */
	className?: string;
}

/**
 * StickyTOCSidebar - Premium table of contents with animated vertical bar indicator.
 * Inspired by animations.dev design patterns with spring physics.
 */
export function StickyTOCSidebar({ items, className }: StickyTOCSidebarProps) {
	const [activeId, setActiveId] = useState<string>("");
	const [hasMounted, setHasMounted] = useState(false);
	const prefersReducedMotion = useReducedMotion();

	// Track mount state for entrance animations
	useEffect(() => {
		setHasMounted(true);
	}, []);

	// Intersection Observer to track active heading
	useEffect(() => {
		if (!items?.length) return;

		const headingIds = items.map((item) => item.url.replace("#", ""));

		const observer = new IntersectionObserver(
			(entries) => {
				const intersecting = entries.find((entry) => entry.isIntersecting);
				if (intersecting) {
					setActiveId(intersecting.target.id);
				}
			},
			{
				rootMargin: "-20% 0% -60% 0%",
				threshold: 0,
			}
		);

		headingIds.forEach((id) => {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	}, [items]);

	// Handle smooth scroll to heading
	const handleClick = useCallback(
		(url: string) => {
			const id = url.replace("#", "");
			const element = document.getElementById(id);
			if (element) {
				element.scrollIntoView({
					behavior: prefersReducedMotion ? "auto" : "smooth",
					block: "start",
				});
			}
		},
		[prefersReducedMotion]
	);

	if (!items?.length) return null;

	// Get transition based on reduced motion preference
	const indicatorTransition = getReducedMotionTransition(
		springGentle,
		prefersReducedMotion
	);

	return (
		<nav
			className={cn(
				"hidden lg:block sticky top-[calc(var(--navbar-height)+1.5rem)]",
				"self-start",
				className
			)}
			aria-label="On this page"
		>
			{/* Header with icon */}
			<motion.header
				className="flex items-center gap-2 text-muted-foreground mb-4"
				initial={prefersReducedMotion ? false : { opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.2 }}
			>
				<HugeiconsIcon icon={Menu01Icon} size={14} strokeWidth={2} />
				<span className="text-sm font-medium">On this page</span>
			</motion.header>

			{/* TOC list with vertical bar indicator */}
			<ol className="relative space-y-1">
				{items.map((item, index) => {
					const isActive = activeId === item.url.replace("#", "");
					const isNested = item.depth > 2;

					return (
						<motion.li
							key={item.url}
							className={cn("relative", isNested && "pl-3")}
							custom={index}
							initial={hasMounted || prefersReducedMotion ? false : "hidden"}
							animate="visible"
							variants={tocItem}
						>
							{/* Vertical indicator bar - animates with spring physics */}
							<motion.div
								className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-primary"
								initial={{ scaleY: 0 }}
								animate={{ scaleY: isActive ? 1 : 0 }}
								transition={indicatorTransition}
								style={{ originY: 0 }}
							/>

							{/* TOC item button */}
							<button
								onClick={() => handleClick(item.url)}
								className={cn(
									"w-full text-left pl-3 py-1 text-sm leading-relaxed transition-colors cursor-pointer",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm",
									isActive
										? "text-foreground font-medium"
										: "text-muted-foreground hover:text-foreground"
								)}
								title={item.title}
								aria-label={`Jump to ${item.title}`}
								aria-current={isActive ? "location" : undefined}
							>
								{item.title}
							</button>
						</motion.li>
					);
				})}
			</ol>
		</nav>
	);
}

export default StickyTOCSidebar;
