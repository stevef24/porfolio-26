"use client";

/**
 * BlogWithCanvas - Motion-powered layout orchestrator
 *
 * Creates a two-column layout where:
 * - Blog column: Full width when inactive, shifts left when canvas active
 * - Canvas column: Slides in from right when zone active, fixed position
 *
 * Uses Motion.js for smooth spring animations instead of CSS transitions.
 * The canvas is rendered in a fixed position overlay to avoid sticky issues.
 */

import {
	useState,
	useEffect,
	createContext,
	useContext,
	ReactNode,
	useCallback,
	useMemo,
	useRef,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springGentle } from "@/lib/motion-variants";

// ============================================================================
// Context
// ============================================================================

interface CanvasLayoutContextValue {
	/** Whether any CanvasZone is currently in view */
	hasActiveZone: boolean;
	/** Set the active zone state (called by CanvasZone components) */
	setHasActiveZone: (active: boolean) => void;
	/** ID of the currently active zone (for multi-zone support) */
	activeZoneId: string | null;
	/** Set the active zone ID */
	setActiveZoneId: (id: string | null) => void;
	/** Canvas content to render (set by active CanvasZone) */
	canvasContent: ReactNode | null;
	/** Set the canvas content */
	setCanvasContent: (content: ReactNode | null) => void;
	/** Register a CanvasZone element for intersection tracking */
	registerZone: (
		id: string,
		element: HTMLElement,
		config: { content: ReactNode; deactivateDelay?: number }
	) => () => void;
	/** Update a registered CanvasZone's config without re-registering */
	updateZoneConfig: (
		id: string,
		config: { content: ReactNode; deactivateDelay?: number }
	) => void;
	/** Register a sentinel element that should close the canvas */
	registerSentinel: (
		id: string,
		element: HTMLElement,
		kind: "gap" | "end"
	) => () => void;
}

const CanvasLayoutContext = createContext<CanvasLayoutContextValue | null>(
	null
);

/**
 * Hook to access canvas layout state from child components.
 * Must be used within a BlogWithCanvas provider.
 */
export function useCanvasLayout() {
	const ctx = useContext(CanvasLayoutContext);
	if (!ctx) {
		throw new Error("useCanvasLayout must be used within BlogWithCanvas");
	}
	return ctx;
}

// ============================================================================
// Component
// ============================================================================

interface BlogWithCanvasProps {
	children: ReactNode;
	className?: string;
	/** Root margin for the shared observer (defines the active band). */
	activationRootMargin?: string;
	/** Minimum intersection ratio before a zone can activate. */
	minIntersectionRatio?: number;
	/** Default close delay (ms) after leaving all zones. */
	deactivateDelay?: number;
}

/**
 * Main layout component for blog posts with canvas support.
 *
 * Wrap your blog content with this component to enable the
 * Motion-powered layout animation when CanvasZone components
 * come into view.
 */
export function BlogWithCanvas({
	children,
	className,
	activationRootMargin = "-35% 0px -35% 0px",
	minIntersectionRatio = 0.1,
	deactivateDelay = 150,
}: BlogWithCanvasProps) {
	const [hasActiveZone, setHasActiveZone] = useState(false);
	const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
	const [canvasContent, setCanvasContent] = useState<ReactNode | null>(null);
	const [isDesktop, setIsDesktop] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);
	const prefersReducedMotion = useReducedMotion();

	const hasActiveZoneRef = useRef(hasActiveZone);
	const activeZoneIdRef = useRef(activeZoneId);
	const canvasContentRef = useRef(canvasContent);
	const scrollDirectionRef = useRef<"up" | "down">("down");
	const observerRef = useRef<IntersectionObserver | null>(null);
	const zoneConfigRef = useRef(
		new Map<string, { content: ReactNode; deactivateDelay?: number }>()
	);
	const zoneEntryRef = useRef(new Map<string, IntersectionObserverEntry>());
	const sentinelEntryRef = useRef(new Map<string, IntersectionObserverEntry>());
	const endSentinelIdsRef = useRef(new Set<string>());
	const gapSentinelIdsRef = useRef(new Set<string>());
	const elementMetaRef = useRef(
		new Map<Element, { id: string; kind: "zone" | "gap" | "end" }>()
	);
	const endSentinelRef = useRef<HTMLDivElement>(null);
	const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
	const rafIdRef = useRef<number | null>(null);
	const pendingEntriesRef = useRef<IntersectionObserverEntry[]>([]);
	const isTransitioningRef = useRef(false);
	const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Track desktop breakpoint (md: 768px) for margin animation
	// On mobile, content stays full width since canvas is shown inline
	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 768px)");
		setIsDesktop(mediaQuery.matches);

		const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	// Delay observer setup to prevent false triggers on page load/refresh
	useEffect(() => {
		const timer = setTimeout(() => setIsHydrated(true), 100);
		return () => clearTimeout(timer);
	}, []);

	// Track scroll direction for deterministic zone resolution
	useEffect(() => {
		let lastY = window.scrollY;
		const handleScroll = () => {
			const nextY = window.scrollY;
			scrollDirectionRef.current = nextY >= lastY ? "down" : "up";
			lastY = nextY;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		hasActiveZoneRef.current = hasActiveZone;
	}, [hasActiveZone]);

	useEffect(() => {
		activeZoneIdRef.current = activeZoneId;
	}, [activeZoneId]);

	useEffect(() => {
		canvasContentRef.current = canvasContent;
	}, [canvasContent]);

	// Memoize setters to prevent unnecessary re-renders
	const handleSetHasActiveZone = useCallback((active: boolean) => {
		setHasActiveZone(active);
	}, []);

	const handleSetActiveZoneId = useCallback((id: string | null) => {
		setActiveZoneId(id);
	}, []);

	const handleSetCanvasContent = useCallback((content: ReactNode | null) => {
		setCanvasContent(content);
	}, []);

	const effectiveMinRatio = useMemo(() => {
		return Math.min(Math.max(minIntersectionRatio, 0), 1);
	}, [minIntersectionRatio]);

	const observerThresholds = useMemo(() => {
		if (effectiveMinRatio <= 0) return [0];
		return [0, effectiveMinRatio];
	}, [effectiveMinRatio]);

	const clearCloseTimer = useCallback(() => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
	}, []);

	const getDeactivateDelay = useCallback(() => {
		const activeId = activeZoneIdRef.current;
		const config = activeId ? zoneConfigRef.current.get(activeId) : null;
		return config?.deactivateDelay ?? deactivateDelay;
	}, [deactivateDelay]);

	// Start transition lock to prevent observer feedback loops during animation
	const startTransitionLock = useCallback(() => {
		isTransitioningRef.current = true;
		if (transitionTimerRef.current) {
			clearTimeout(transitionTimerRef.current);
		}
		// Release lock after animation completes (400ms spring + buffer)
		transitionTimerRef.current = setTimeout(() => {
			isTransitioningRef.current = false;
		}, 500);
	}, []);

	const closeCanvas = useCallback(() => {
		if (!hasActiveZoneRef.current) return;
		startTransitionLock();
		handleSetHasActiveZone(false);
		handleSetActiveZoneId(null);
		handleSetCanvasContent(null);
	}, [handleSetActiveZoneId, handleSetCanvasContent, handleSetHasActiveZone, startTransitionLock]);

	const scheduleClose = useCallback(() => {
		if (!hasActiveZoneRef.current) return;
		if (closeTimerRef.current) return;
		const delay = getDeactivateDelay();
		closeTimerRef.current = setTimeout(() => {
			closeTimerRef.current = null;
			closeCanvas();
		}, delay);
	}, [closeCanvas, getDeactivateDelay]);

	const activateZone = useCallback(
		(zoneId: string) => {
			clearCloseTimer();
			const content = zoneConfigRef.current.get(zoneId)?.content ?? null;
			const wasInactive = !hasActiveZoneRef.current;

			if (activeZoneIdRef.current !== zoneId) {
				handleSetActiveZoneId(zoneId);
			}
			if (wasInactive) {
				// Starting fresh - lock during transition
				startTransitionLock();
				handleSetHasActiveZone(true);
			}
			if (canvasContentRef.current !== content) {
				handleSetCanvasContent(content);
			}
		},
		[
			clearCloseTimer,
			handleSetActiveZoneId,
			handleSetCanvasContent,
			handleSetHasActiveZone,
			startTransitionLock,
		]
	);

	const resolveActiveZone = useCallback(() => {
		// Skip processing during layout transitions to prevent feedback loops
		// This prevents observer updates from causing state thrash while animating
		if (isTransitioningRef.current) {
			return;
		}

		// Check end sentinels - if visible, close canvas
		const endSentinels = endSentinelIdsRef.current;
		for (const id of endSentinels) {
			if (sentinelEntryRef.current.get(id)?.isIntersecting) {
				scheduleClose();
				return;
			}
		}

		// Check gap sentinels - if a gap is strongly visible, close canvas
		// Gaps represent intentional breaks between zones where canvas should hide
		const gapSentinels = gapSentinelIdsRef.current;
		for (const id of gapSentinels) {
			const gapEntry = sentinelEntryRef.current.get(id);
			if (gapEntry?.isIntersecting && gapEntry.intersectionRatio > 0.2) {
				scheduleClose();
				return;
			}
		}

		const candidates: Array<{
			id: string;
			entry: IntersectionObserverEntry;
		}> = [];

		zoneEntryRef.current.forEach((entry, id) => {
			if (!entry.isIntersecting) return;
			if (entry.intersectionRatio < effectiveMinRatio) return;
			candidates.push({ id, entry });
		});

		if (candidates.length === 0) {
			scheduleClose();
			return;
		}

		clearCloseTimer();

		if (candidates.length === 1) {
			activateZone(candidates[0].id);
			return;
		}

		const maxRatio = Math.max(
			...candidates.map((candidate) => candidate.entry.intersectionRatio)
		);
		const ratioEpsilon = 0.02;
		const ratioCandidates = candidates.filter(
			(candidate) => candidate.entry.intersectionRatio >= maxRatio - ratioEpsilon
		);

		if (ratioCandidates.length === 1) {
			activateZone(ratioCandidates[0].id);
			return;
		}

		const direction = scrollDirectionRef.current;
		const next =
			direction === "up"
				? ratioCandidates.reduce((best, candidate) => {
						if (!best) return candidate;
						return candidate.entry.boundingClientRect.bottom <
							best.entry.boundingClientRect.bottom
							? candidate
							: best;
					}, null as typeof ratioCandidates[number] | null)
				: ratioCandidates.reduce((best, candidate) => {
						if (!best) return candidate;
						return candidate.entry.boundingClientRect.top >
							best.entry.boundingClientRect.top
							? candidate
							: best;
					}, null as typeof ratioCandidates[number] | null);

		if (next) {
			activateZone(next.id);
		}
	}, [
		activateZone,
		clearCloseTimer,
		effectiveMinRatio,
		scheduleClose,
	]);

	const enqueueEntries = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			pendingEntriesRef.current.push(...entries);
			if (rafIdRef.current !== null) return;
			rafIdRef.current = window.requestAnimationFrame(() => {
				rafIdRef.current = null;
				const batch = pendingEntriesRef.current;
				pendingEntriesRef.current = [];

				for (const entry of batch) {
					const meta = elementMetaRef.current.get(entry.target);
					if (!meta) continue;
					if (meta.kind === "zone") {
						zoneEntryRef.current.set(meta.id, entry);
					} else {
						sentinelEntryRef.current.set(meta.id, entry);
					}
				}

				resolveActiveZone();
			});
		},
		[resolveActiveZone]
	);

	const registerZone = useCallback(
		(
			id: string,
			element: HTMLElement,
			config: { content: ReactNode; deactivateDelay?: number }
		) => {
			zoneConfigRef.current.set(id, config);
			elementMetaRef.current.set(element, { id, kind: "zone" });

			if (observerRef.current) {
				observerRef.current.observe(element);
			}

			return () => {
				if (observerRef.current) {
					observerRef.current.unobserve(element);
				}
				elementMetaRef.current.delete(element);
				zoneConfigRef.current.delete(id);
				zoneEntryRef.current.delete(id);
			};
		},
		[]
	);

	const updateZoneConfig = useCallback(
		(
			id: string,
			config: { content: ReactNode; deactivateDelay?: number }
		) => {
			zoneConfigRef.current.set(id, config);
			if (activeZoneIdRef.current === id) {
				handleSetCanvasContent(config.content ?? null);
			}
		},
		[handleSetCanvasContent]
	);

	const registerSentinel = useCallback(
		(id: string, element: HTMLElement, kind: "gap" | "end") => {
			elementMetaRef.current.set(element, { id, kind });
			if (kind === "end") {
				endSentinelIdsRef.current.add(id);
			} else if (kind === "gap") {
				gapSentinelIdsRef.current.add(id);
			}

			if (observerRef.current) {
				observerRef.current.observe(element);
			}

			return () => {
				if (observerRef.current) {
					observerRef.current.unobserve(element);
				}
				elementMetaRef.current.delete(element);
				sentinelEntryRef.current.delete(id);
				endSentinelIdsRef.current.delete(id);
				gapSentinelIdsRef.current.delete(id);
			};
		},
		[]
	);

	useEffect(() => {
		const element = endSentinelRef.current;
		if (!element) return;
		return registerSentinel("canvas-end", element, "end");
	}, [registerSentinel]);

	useEffect(() => {
		if (!isHydrated) return;

		const observer = new IntersectionObserver(enqueueEntries, {
			threshold: observerThresholds,
			rootMargin: activationRootMargin,
		});

		observerRef.current = observer;

		elementMetaRef.current.forEach((_, element) => {
			observer.observe(element);
		});

		return () => {
			observer.disconnect();
			observerRef.current = null;
		};
	}, [activationRootMargin, enqueueEntries, isHydrated, observerThresholds]);

	useEffect(() => {
		return () => {
			clearCloseTimer();
			if (rafIdRef.current !== null) {
				window.cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			if (transitionTimerRef.current) {
				clearTimeout(transitionTimerRef.current);
				transitionTimerRef.current = null;
			}
		};
	}, [clearCloseTimer]);

	// Spring transition - disabled if user prefers reduced motion
	const transition = prefersReducedMotion ? { duration: 0 } : springGentle;

	return (
		<CanvasLayoutContext.Provider
			value={{
				hasActiveZone,
				setHasActiveZone: handleSetHasActiveZone,
				activeZoneId,
				setActiveZoneId: handleSetActiveZoneId,
				canvasContent,
				setCanvasContent: handleSetCanvasContent,
				registerZone,
				updateZoneConfig,
				registerSentinel,
			}}
		>
			<div
				className={cn("relative min-h-screen", className)}
				data-canvas-layout
				data-active={hasActiveZone}
			>
				{/* Blog Column - animates margin when canvas active */}
				<motion.div
					className="relative"
					animate={{
						// Desktop: shift left when canvas active
						// Mobile: stay full width (canvas shown inline via CanvasZone)
						marginRight: hasActiveZone && isDesktop ? "50vw" : "0vw",
					}}
					transition={transition}
					style={{ willChange: "margin" }}
				>
					{/* Content lock - max width for readability */}
					<div className="max-w-[var(--blog-content-width,680px)] mx-auto px-4 md:px-6">
						{children}
						<div
							ref={endSentinelRef}
							data-canvas-sentinel="end"
							className="h-px w-full"
							aria-hidden="true"
						/>
					</div>
				</motion.div>

				{/* Canvas Column - fixed position overlay that slides in */}
				<AnimatePresence mode="wait">
					{hasActiveZone && (
						<motion.div
							className={cn(
								// Fixed positioning - stays in viewport while scrolling
								"fixed top-0 right-0 h-screen",
								// Half width on desktop
								"w-1/2",
								// Hidden on mobile
								"hidden md:flex",
								// Visual styling
								"p-4 items-center justify-center",
								// High z-index to stay above content
								"z-40"
							)}
							data-canvas-column
							// Slide in from right
							initial={{ x: "100%" }}
							animate={{ x: "0%" }}
							exit={{ x: "100%" }}
							transition={transition}
							style={{ willChange: "transform" }}
						>
							{/* Canvas content area with background */}
							<div className="w-full h-full bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden">
								{canvasContent || (
									<div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
										Canvas Active
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</CanvasLayoutContext.Provider>
	);
}

// ============================================================================
// Development Helper
// ============================================================================

/**
 * Temporary toggle button for testing layout animation.
 * Remove after Phase 2 when CanvasZone handles activation.
 */
export function CanvasToggleButton() {
	const { hasActiveZone, setHasActiveZone } = useCanvasLayout();

	return (
		<button
			onClick={() => setHasActiveZone(!hasActiveZone)}
			className={cn(
				"px-4 py-2 rounded-md font-medium text-sm transition-colors",
				hasActiveZone
					? "bg-primary text-primary-foreground"
					: "bg-muted text-muted-foreground hover:bg-muted/80"
			)}
		>
			Canvas: {hasActiveZone ? "ON" : "OFF"}
		</button>
	);
}
