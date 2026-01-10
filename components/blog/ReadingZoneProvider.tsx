"use client";

/**
 * ReadingZoneProvider - Context for paragraph focus highlighting
 *
 * Tracks which paragraph/block is in the "reading zone" (center ~20% of viewport)
 * and provides that state to child components. Uses a single IntersectionObserver
 * for performance - all blocks share one observer instance.
 *
 * The reading zone is defined by a -40% margin from top and bottom, creating a
 * center zone where elements are considered "active" for reading.
 *
 * @example
 * ```tsx
 * <ReadingZoneProvider>
 *   <article>
 *     <ReadingBlock id="p1"><p>First paragraph...</p></ReadingBlock>
 *     <ReadingBlock id="p2"><p>Second paragraph...</p></ReadingBlock>
 *   </article>
 * </ReadingZoneProvider>
 * ```
 */

import {
	createContext,
	useContext,
	useCallback,
	useRef,
	useState,
	useEffect,
	useMemo,
	type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

// ============================================================================
// Types
// ============================================================================

interface ReadingZoneContextValue {
	/** ID of the currently active (focused) block */
	activeBlockId: string | null;
	/** Whether animations are enabled (respects prefers-reduced-motion) */
	animationsEnabled: boolean;
	/** Register a block element for observation */
	registerBlock: (id: string, element: HTMLElement) => void;
	/** Unregister a block element */
	unregisterBlock: (id: string) => void;
}

interface ReadingZoneProviderProps {
	children: ReactNode;
	/**
	 * Whether the reading zone effect is enabled.
	 * When false, all blocks appear at full opacity.
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * IntersectionObserver margin for center zone detection.
	 * Format: "top right bottom left" (CSS-like)
	 * Default: "-40% 0px -40% 0px" creates a center ~20% zone
	 */
	rootMargin?: string;
}

// ============================================================================
// Context
// ============================================================================

const ReadingZoneContext = createContext<ReadingZoneContextValue | null>(null);

/**
 * Hook to access reading zone context.
 * Must be used within a ReadingZoneProvider.
 */
export function useReadingZone(): ReadingZoneContextValue {
	const context = useContext(ReadingZoneContext);
	if (!context) {
		throw new Error(
			"useReadingZone must be used within a ReadingZoneProvider"
		);
	}
	return context;
}

/**
 * Optional hook that returns null if outside provider.
 * Useful for components that work with or without the provider.
 */
export function useReadingZoneOptional(): ReadingZoneContextValue | null {
	return useContext(ReadingZoneContext);
}

// ============================================================================
// Provider Component
// ============================================================================

export function ReadingZoneProvider({
	children,
	enabled = true,
	rootMargin = "-40% 0px -40% 0px",
}: ReadingZoneProviderProps) {
	const prefersReducedMotion = useReducedMotion();
	const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

	// Map of block IDs to their DOM elements
	const blocksRef = useRef<Map<string, HTMLElement>>(new Map());

	// Track which blocks are currently intersecting
	const intersectingRef = useRef<Set<string>>(new Set());

	// Single IntersectionObserver instance for all blocks
	const observerRef = useRef<IntersectionObserver | null>(null);

	// Create/recreate observer when rootMargin changes
	useEffect(() => {
		if (!enabled) return;

		// Create observer that tracks blocks entering/leaving the center zone
		const observer = new IntersectionObserver(
			(entries) => {
				// Update intersecting set based on entries
				for (const entry of entries) {
					const id = entry.target.getAttribute("data-reading-block-id");
					if (!id) continue;

					if (entry.isIntersecting) {
						intersectingRef.current.add(id);
					} else {
						intersectingRef.current.delete(id);
					}
				}

				// Determine active block: the one closest to center
				// For simplicity, take the first intersecting block in document order
				if (intersectingRef.current.size === 0) {
					setActiveBlockId(null);
				} else if (intersectingRef.current.size === 1) {
					setActiveBlockId(Array.from(intersectingRef.current)[0]);
				} else {
					// Multiple blocks intersecting - find the one closest to center
					const viewportCenter = window.innerHeight / 2;
					let closest: { id: string; distance: number } | null = null;

					for (const id of intersectingRef.current) {
						const element = blocksRef.current.get(id);
						if (!element) continue;

						const rect = element.getBoundingClientRect();
						const elementCenter = rect.top + rect.height / 2;
						const distance = Math.abs(elementCenter - viewportCenter);

						if (!closest || distance < closest.distance) {
							closest = { id, distance };
						}
					}

					setActiveBlockId(closest?.id ?? null);
				}
			},
			{
				rootMargin,
				threshold: 0,
			}
		);

		observerRef.current = observer;

		// Observe all currently registered blocks
		for (const [id, element] of blocksRef.current) {
			element.setAttribute("data-reading-block-id", id);
			observer.observe(element);
		}

		return () => {
			observer.disconnect();
			observerRef.current = null;
		};
	}, [enabled, rootMargin]);

	// Register a block for observation
	const registerBlock = useCallback((id: string, element: HTMLElement) => {
		blocksRef.current.set(id, element);
		element.setAttribute("data-reading-block-id", id);

		// Start observing if observer exists
		if (observerRef.current) {
			observerRef.current.observe(element);
		}
	}, []);

	// Unregister a block
	const unregisterBlock = useCallback((id: string) => {
		const element = blocksRef.current.get(id);
		if (element && observerRef.current) {
			observerRef.current.unobserve(element);
		}
		blocksRef.current.delete(id);
		intersectingRef.current.delete(id);
	}, []);

	// Context value
	const value = useMemo<ReadingZoneContextValue>(
		() => ({
			activeBlockId: enabled ? activeBlockId : null,
			animationsEnabled: !prefersReducedMotion,
			registerBlock,
			unregisterBlock,
		}),
		[activeBlockId, enabled, prefersReducedMotion, registerBlock, unregisterBlock]
	);

	return (
		<ReadingZoneContext.Provider value={value}>
			{children}
		</ReadingZoneContext.Provider>
	);
}
