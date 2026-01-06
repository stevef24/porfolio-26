"use client";

import { motion, useSpring } from "motion/react";
import { useEffect, useState, useRef } from "react";

interface ScrollingDotProps {
	sections: string[];
}

export function ScrollingDot({ sections }: ScrollingDotProps) {
	// Start at index 1 (About section) since hero doesn't have a section-title
	const [activeIndex, setActiveIndex] = useState(1);
	const [isMounted, setIsMounted] = useState(false);
	const dotRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number | null>(null);
	const sectionsRef = useRef(sections);

	// Spring animation for smooth movement
	const x = useSpring(0, { stiffness: 300, damping: 30 });
	const y = useSpring(0, { stiffness: 300, damping: 30 });

	// Keep sections ref updated
	useEffect(() => {
		sectionsRef.current = sections;
	}, [sections]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Update dot position when active section changes
	useEffect(() => {
		if (!isMounted) return;

		const updateDotPosition = () => {
			const sectionId = sectionsRef.current[activeIndex];
			const sectionElement = document.getElementById(sectionId);
			if (!sectionElement) return;

			const titleElement = sectionElement.querySelector(".section-title");
			if (!titleElement) return;

			const rect = titleElement.getBoundingClientRect();
			const scrollY = window.scrollY;

			// Get dot size from ref for accurate positioning
			const dotElement = dotRef.current;
			const dotSize = dotElement ? dotElement.offsetWidth : 14;

			// Position the dot to the left of the section title
			const offsetX = Math.max(0, Math.min(24, rect.left - 8));
			x.set(rect.left - offsetX);
			y.set(rect.top + scrollY + rect.height / 2 - dotSize / 2);
		};

		// Use requestAnimationFrame for smoother updates
		const handleScroll = () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
			rafRef.current = requestAnimationFrame(updateDotPosition);
		};

		updateDotPosition();
		window.addEventListener("resize", updateDotPosition);
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("resize", updateDotPosition);
			window.removeEventListener("scroll", handleScroll);
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [activeIndex, isMounted, x, y]);

	// Intersection Observer to track active section (skip hero at index 0)
	useEffect(() => {
		if (!isMounted) return;

		// Track which section's title is closest to the top of the viewport
		const handleScroll = () => {
			let closestSection = 1; // Default to About
			let closestDistance = Infinity;

			sections.slice(1).forEach((sectionId, index) => {
				const element = document.getElementById(sectionId);
				if (!element) return;

				const titleElement = element.querySelector(".section-title");
				if (!titleElement) return;

				const rect = titleElement.getBoundingClientRect();
				// Distance from top of viewport (aim for title being near top third of screen)
				const targetY = window.innerHeight * 0.25;
				const distance = Math.abs(rect.top - targetY);

				// Only consider sections that are in view or slightly above
				if (rect.top < window.innerHeight * 0.6 && rect.top > -100) {
					if (distance < closestDistance) {
						closestDistance = distance;
						closestSection = index + 1;
					}
				}
			});

			setActiveIndex(closestSection);
		};

		// Initial check
		handleScroll();

		// Throttled scroll handler
		let ticking = false;
		const scrollHandler = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", scrollHandler, { passive: true });

		return () => {
			window.removeEventListener("scroll", scrollHandler);
		};
	}, [sections, isMounted]);

	// Don't render until mounted
	if (!isMounted) {
		return null;
	}

	return (
		<motion.div
			ref={dotRef}
			className="fixed w-2 h-2 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-primary z-30 pointer-events-none"
			style={{
				x,
				y,
				position: "absolute",
				top: 0,
				left: 0,
			}}
		/>
	);
}
