"use client";

/**
 * ReadingBlock - Paragraph wrapper with focus highlighting
 *
 * Wraps content and animates opacity based on whether it's in the
 * viewport's "reading zone" (center ~20%). Active blocks appear at
 * full opacity, inactive blocks are faded.
 *
 * Works automatically with ReadingZoneProvider context. If used outside
 * a provider, renders children at full opacity (no animation).
 *
 * @example
 * ```tsx
 * <ReadingZoneProvider>
 *   <ReadingBlock><p>This paragraph will highlight when scrolled into center.</p></ReadingBlock>
 * </ReadingZoneProvider>
 * ```
 */

import { useRef, useEffect, useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReadingZoneOptional } from "./ReadingZoneProvider";

// ============================================================================
// Types
// ============================================================================

interface ReadingBlockProps {
	/** Block content */
	children?: ReactNode;
	/** Optional explicit ID (auto-generated if not provided) */
	id?: string;
	/** Additional CSS classes */
	className?: string;
	/** HTML element to render as (default: "div") */
	as?: "div" | "p" | "span" | "section" | "article";
	/** Opacity when active (in reading zone). Default: 1 */
	activeOpacity?: number;
	/** Opacity when inactive. Default: 0.4 */
	inactiveOpacity?: number;
	/** Pass through additional props to the wrapper element */
	style?: React.CSSProperties;
}

// ============================================================================
// Constants
// ============================================================================

/** CSS transition for smooth opacity changes */
const OPACITY_TRANSITION = "opacity 350ms ease-out";

// ============================================================================
// Component
// ============================================================================

export function ReadingBlock({
	children,
	id: providedId,
	className,
	as = "div",
	activeOpacity = 1,
	inactiveOpacity = 0.4,
	style,
}: ReadingBlockProps): JSX.Element {
	const generatedId = useId();
	const blockId = providedId ?? generatedId;
	const ref = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();

	// Get context (may be null if outside provider)
	const context = useReadingZoneOptional();

	// Register/unregister with provider
	useEffect(() => {
		if (!context || !ref.current) return;

		context.registerBlock(blockId, ref.current);

		return () => {
			context.unregisterBlock(blockId);
		};
	}, [context, blockId]);

	// Determine if this block is active
	const isActive = context ? context.activeBlockId === blockId : true;

	// Calculate opacity
	// If no context (outside provider), always full opacity
	// If reduced motion preferred, always full opacity
	let opacity = activeOpacity;
	if (context && !prefersReducedMotion && !isActive) {
		opacity = inactiveOpacity;
	}

	// Use the appropriate HTML element
	const Component = as;

	return (
		<Component
			ref={ref as React.RefObject<HTMLDivElement & HTMLParagraphElement>}
			className={cn("reading-block", className)}
			data-reading-block
			data-reading-active={isActive}
			style={{
				opacity,
				transition: prefersReducedMotion ? "none" : OPACITY_TRANSITION,
				...style,
			}}
		>
			{children}
		</Component>
	);
}

/**
 * Paragraph-specific ReadingBlock variant.
 * Renders as <p> element with proper prose styling.
 */
export function ReadingParagraph({
	children,
	className,
	...props
}: Omit<ReadingBlockProps, "as">): JSX.Element {
	return (
		<ReadingBlock as="p" className={className} {...props}>
			{children}
		</ReadingBlock>
	);
}

/**
 * Motion-enhanced ReadingBlock with spring animations.
 * Use this for more fluid, bouncy transitions.
 */
export function ReadingBlockMotion({
	children,
	id: providedId,
	className,
	activeOpacity = 1,
	inactiveOpacity = 0.4,
}: ReadingBlockProps): JSX.Element {
	const generatedId = useId();
	const blockId = providedId ?? generatedId;
	const ref = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();

	const context = useReadingZoneOptional();

	useEffect(() => {
		if (!context || !ref.current) return;
		context.registerBlock(blockId, ref.current);
		return () => context.unregisterBlock(blockId);
	}, [context, blockId]);

	const isActive = context ? context.activeBlockId === blockId : true;
	let opacity = activeOpacity;
	if (context && !prefersReducedMotion && !isActive) {
		opacity = inactiveOpacity;
	}

	return (
		<motion.div
			ref={ref}
			className={cn("reading-block", className)}
			data-reading-block
			data-reading-active={isActive}
			animate={{ opacity }}
			transition={
				prefersReducedMotion
					? { duration: 0 }
					: { type: "spring", stiffness: 200, damping: 25 }
			}
		>
			{children}
		</motion.div>
	);
}
