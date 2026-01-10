"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useScrollyDrawerOptional } from "@/components/ui/scrolly/ScrollyDrawerContext";
import { springSmooth } from "@/lib/motion-variants";

interface TOCItem {
	title: string;
	url: string;
	depth: number;
}

interface RulerTOCProps {
	items: TOCItem[];
	className?: string;
}

/**
 * RulerTOC - iOS wheel-picker style table of contents
 * Fixed position on left side of screen, vertically centered
 * Default: shows horizontal bars with main sections bolder
 * Hover: expands to show section names in wheel picker style with magnetic effect
 *
 * Features:
 * - Slides out when scrolly drawer is active (prevents overlap)
 * - Main sections (h2) appear bolder than subsections (h3+)
 * - Magnetic hover effect: nearby items react to cursor proximity
 */
export function RulerTOC({ items, className }: RulerTOCProps) {
	const [activeId, setActiveId] = useState<string>("");
	const [isHovered, setIsHovered] = useState(false);
	const [scrollProgress, setScrollProgress] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();

	// Magnetic hover state - track mouse Y position
	const [mouseY, setMouseY] = useState<number | null>(null);
	const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

	// Check if scrolly drawer is active (optional - may be null if no scrolly on page)
	const drawerContext = useScrollyDrawerOptional();
	const isScrollyActive = drawerContext?.isDrawerOpen ?? false;

	// Number of visible items (above + active + below)
	const VISIBLE_ITEMS = 5;

	// Track active heading via Intersection Observer
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

	// Track overall scroll progress
	useEffect(() => {
		const handleScroll = () => {
			const scrollHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
			setScrollProgress(Math.min(1, Math.max(0, progress)));
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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

	// Handle mouse move for magnetic effect
	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		if (containerRef.current) {
			setMouseY(e.clientY);
		}
	}, []);

	// Reset magnetic effect on mouse leave
	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
		setMouseY(null);
	}, []);

	// Calculate magnetic transform for an item based on cursor distance
	const getMagneticTransform = useCallback(
		(itemUrl: string) => {
			if (!mouseY || prefersReducedMotion) {
				return { y: 0, scale: 1 };
			}

			const itemRef = itemRefs.current.get(itemUrl);
			if (!itemRef) return { y: 0, scale: 1 };

			const rect = itemRef.getBoundingClientRect();
			const itemCenter = rect.top + rect.height / 2;
			const distance = Math.abs(mouseY - itemCenter);
			const maxDistance = 80; // pixels - items within this range react

			if (distance > maxDistance) {
				return { y: 0, scale: 1 };
			}

			// Calculate proximity (1 = closest, 0 = at max distance)
			const proximity = 1 - distance / maxDistance;

			return {
				y: -proximity * 4, // Raise up to 4px
				scale: 1 + proximity * 0.15, // Scale up to 1.15x
			};
		},
		[mouseY, prefersReducedMotion]
	);

	// Calculate which item index is active
	const activeIndex = useMemo(
		() => items.findIndex((item) => item.url.replace("#", "") === activeId),
		[items, activeId]
	);

	// Calculate visible items for wheel picker (centered on active)
	const visibleItems = useMemo(() => {
		const half = Math.floor(VISIBLE_ITEMS / 2);
		const start = Math.max(0, activeIndex - half);
		const end = Math.min(items.length, start + VISIBLE_ITEMS);
		const adjustedStart = Math.max(0, end - VISIBLE_ITEMS);

		return items.slice(adjustedStart, end).map((item, idx) => ({
			...item,
			originalIndex: adjustedStart + idx,
			distanceFromActive: adjustedStart + idx - activeIndex,
		}));
	}, [items, activeIndex]);

	if (!items?.length) return null;

	// Helper to determine bar background color based on state
	function getBarBackground(isActive: boolean, isPast: boolean, isMainSection: boolean): string {
		if (isActive) return "bg-foreground";
		if (isPast) return isMainSection ? "bg-foreground/60" : "bg-foreground/40";
		return isMainSection ? "bg-foreground/30" : "bg-foreground/15";
	}

	// Helper to determine bar width based on state
	function getBarWidth(isActive: boolean, isMainSection: boolean, isNested: boolean): number {
		if (isActive) return 28;
		if (isMainSection) return 20;
		if (isNested) return 12;
		return 16;
	}

	return (
		<motion.div
			ref={containerRef}
			className={cn(
				"fixed left-6 top-1/2 -translate-y-1/2 z-40",
				"hidden lg:block",
				className
			)}
			// Slide out when scrolly drawer is active
			animate={{
				x: isScrollyActive ? -100 : 0,
				opacity: isScrollyActive ? 0 : 1,
			}}
			transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
		>
			<nav aria-label="Article progress">
				<AnimatePresence mode="wait">
					{!isHovered ? (
						/* Collapsed state - horizontal bars */
						<motion.div
							key="bars"
							className="flex flex-col items-start gap-3"
							initial={{ opacity: 0, filter: "blur(8px)" }}
							animate={{ opacity: 1, filter: "blur(0px)" }}
							exit={{ opacity: 0, filter: "blur(8px)" }}
							transition={
								prefersReducedMotion
									? { duration: 0 }
									: { duration: 0.25, ease: "easeOut" }
							}
						>
							{items.map((item, index) => {
								const isActive = activeId === item.url.replace("#", "");
								const isPast = activeIndex > index;
								const isNested = item.depth > 2;
								const isMainSection = item.depth === 2; // h2 = main section

								// Get magnetic transform for this item
								const magneticTransform = getMagneticTransform(item.url);

								return (
									<motion.button
										key={item.url}
										ref={(el) => {
											if (el) itemRefs.current.set(item.url, el);
										}}
										onClick={() => handleClick(item.url)}
										className={cn(
											"cursor-pointer transition-all duration-300",
											"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm",
											isNested && "ml-2"
										)}
										aria-label={`Jump to ${item.title}`}
										aria-current={isActive ? "location" : undefined}
										// Magnetic hover effect
										animate={{
											y: magneticTransform.y,
											scale: magneticTransform.scale,
										}}
										transition={
											prefersReducedMotion
												? { duration: 0 }
												: { type: "spring", stiffness: 400, damping: 30 }
										}
									>
										<motion.div
											className={cn(
												"rounded-full transition-colors duration-300",
												getBarBackground(isActive, isPast, isMainSection)
											)}
											initial={false}
											animate={{
												width: getBarWidth(isActive, isMainSection, isNested),
												height: isActive ? 3 : isMainSection ? 2.5 : 2,
											}}
											transition={
												prefersReducedMotion
													? { duration: 0 }
													: { type: "spring", stiffness: 400, damping: 30 }
											}
										/>
									</motion.button>
								);
							})}

							{/* Scroll progress indicator */}
							<div className="mt-4 w-7 h-px bg-border/30 relative overflow-hidden rounded-full">
								<motion.div
									className="absolute left-0 top-0 h-full bg-primary/60 rounded-full"
									style={{ width: `${scrollProgress * 100}%` }}
									transition={
										prefersReducedMotion
											? { duration: 0 }
											: { type: "spring", stiffness: 100, damping: 20 }
									}
								/>
							</div>
						</motion.div>
					) : (
						/* Expanded state - wheel picker with section names */
						<motion.div
							key="wheel"
							className={cn(
								"flex flex-col items-start",
								"bg-background/80 backdrop-blur-md",
								"border border-border/30 rounded-lg",
								"py-3 px-4",
								"shadow-lg shadow-black/5"
							)}
							initial={
								prefersReducedMotion
									? { opacity: 1 }
									: { opacity: 0, x: -12, filter: "blur(8px)" }
							}
							animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
							exit={
								prefersReducedMotion
									? { opacity: 0 }
									: { opacity: 0, x: -12, filter: "blur(8px)" }
							}
							transition={
								prefersReducedMotion
									? { duration: 0 }
									: { duration: 0.25, ease: "easeOut" }
							}
						>
							{/* Wheel picker items */}
							<div className="flex flex-col gap-0.5">
								{visibleItems.map((item) => {
									const isActive = item.originalIndex === activeIndex;
									const distance = Math.abs(item.distanceFromActive);
									const isMainSection = item.depth === 2;

									// Calculate opacity based on distance from active
									const opacity = isActive
										? 1
										: Math.max(0.2, 1 - distance * 0.3);
									// Calculate scale based on distance
									const scale = isActive
										? 1
										: Math.max(0.85, 1 - distance * 0.05);

									// Get magnetic transform
									const magneticTransform = getMagneticTransform(item.url);

									return (
										<motion.button
											key={item.url}
											ref={(el) => {
												if (el) itemRefs.current.set(item.url, el);
											}}
											onClick={() => handleClick(item.url)}
											className={cn(
												"text-left py-1.5 px-2 -mx-2 rounded-md cursor-pointer",
												"transition-colors duration-200",
												"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
												isActive
													? "text-foreground"
													: "text-muted-foreground hover:text-foreground/80 hover:bg-foreground/5",
												// Main sections bolder in expanded view
												isActive && isMainSection && "font-semibold",
												isActive && !isMainSection && "font-medium",
												!isActive && isMainSection && "font-medium"
											)}
											style={{ opacity }}
											initial={false}
											animate={{
												scale: scale + magneticTransform.scale - 1,
												y: magneticTransform.y,
											}}
											transition={
												prefersReducedMotion
													? { duration: 0 }
													: { type: "spring", stiffness: 400, damping: 30 }
											}
											aria-label={`Jump to ${item.title}`}
											aria-current={isActive ? "location" : undefined}
										>
											<span className="text-sm whitespace-nowrap max-w-[200px] truncate block">
												{item.title}
											</span>
										</motion.button>
									);
								})}
							</div>

							{/* Section counter */}
							<div className="mt-3 pt-3 border-t border-border/30 w-full">
								<span className="text-xs text-muted-foreground">
									{activeIndex + 1} / {items.length}
								</span>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</nav>
		</motion.div>
	);
}

export default RulerTOC;
