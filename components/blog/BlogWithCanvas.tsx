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
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import {
	transitionCanvasSlide,
	springCanvasStretch,
	canvasContentReveal,
} from "@/lib/motion-variants";

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
		observeElement: HTMLElement,
		config: CanvasZoneConfig,
		zoneRootElement?: HTMLElement
	) => () => void;
	/** Update a registered CanvasZone's config without re-registering */
	updateZoneConfig: (
		id: string,
		config: CanvasZoneConfig
	) => void;
	/** Register a sentinel element that should close the canvas */
	registerSentinel: (
		id: string,
		element: HTMLElement,
		kind: CanvasSentinelKind
	) => () => void;
}

const CanvasLayoutContext = createContext<CanvasLayoutContextValue | null>(
	null
);

type CanvasSentinelKind = "gap" | "end";

interface CanvasZoneConfig {
	content: ReactNode;
	deactivateDelay?: number;
}

/**
 * Hook to access canvas layout state from child components.
 * Must be used within a BlogWithCanvas provider.
 */
export function useCanvasLayout(): CanvasLayoutContextValue {
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
	/** Horizontal shift applied to content when canvas is active. */
	activeShiftX?: string | number;
	/** Canvas rail width when active. */
	canvasWidth?: string | number;
	/** Render as full-bleed breakout layout. */
	fullBleed?: boolean;
	/** Optional class for the inner content width lock. */
	contentMaxWidthClassName?: string;
}

const FRAME_TIME_MS = 16.67;
const FAST_SCROLL_VELOCITY_PX_PER_FRAME = 80;
const SCROLL_IDLE_TIMEOUT_MS = 150;
const READING_LINE_RATIO = 0.35;
const BOTTOM_MARGIN_RATIO = 0.65;
const UP_SCROLL_CLOSE_OFFSET_MIN_PX = 24;
const UP_SCROLL_CLOSE_OFFSET_MAX_PX = 96;
const WILL_CHANGE_TRAIL_MS = 300;

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
	// Wider band at center of viewport - triggers earlier for snappier response
	// -35% from top and bottom = observe middle 30% of viewport
	activationRootMargin = "-35% 0px -35% 0px",
	// Low threshold - just needs to enter the center band
	minIntersectionRatio = 0.01,
	deactivateDelay = 100,
	activeShiftX = "-25vw",
	canvasWidth = "50vw",
	fullBleed = true,
	contentMaxWidthClassName = "max-w-[var(--blog-content-width,680px)]",
}: BlogWithCanvasProps): JSX.Element {
	const [hasActiveZone, setHasActiveZone] = useState(false);
	const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
	const [canvasContent, setCanvasContent] = useState<ReactNode | null>(null);
	const [isHydrated, setIsHydrated] = useState(false);
	const [willChangeTransform, setWillChangeTransform] = useState(false);
	const prefersReducedMotion = useReducedMotion();

	const hasActiveZoneRef = useRef(hasActiveZone);
	const activeZoneIdRef = useRef(activeZoneId);
	const canvasContentRef = useRef(canvasContent);
	const scrollDirectionRef = useRef<"up" | "down">("down");
	const observerRef = useRef<IntersectionObserver | null>(null);
	const zoneConfigRef = useRef(new Map<string, CanvasZoneConfig>());
	const zoneRootElementsRef = useRef(new Map<string, HTMLElement>());
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
	const pendingResolveRef = useRef(false);
	const resolveActiveZoneRef = useRef<(() => void) | null>(null);
	const checkPositionBasedClosureRef = useRef<(() => boolean) | null>(null);
	const scheduleCloseRef = useRef<(() => void) | null>(null);
	const scrollIdleTimerRef = useRef<NodeJS.Timeout | null>(null);
	const willChangeTimerRef = useRef<NodeJS.Timeout | null>(null);

	const getUpScrollCloseOffset = useCallback(function getUpScrollCloseOffset(
		rect: DOMRect
	): number {
		const readingLine = window.innerHeight * READING_LINE_RATIO;
		const available = Math.max(0, rect.bottom - readingLine);
		const scaled = available * 0.18;
		return Math.min(
			UP_SCROLL_CLOSE_OFFSET_MAX_PX,
			Math.max(UP_SCROLL_CLOSE_OFFSET_MIN_PX, scaled)
		);
	}, []);

	// Delay observer setup to prevent false triggers on page load/refresh
	useEffect(() => {
		const timer = setTimeout(() => setIsHydrated(true), 100);
		return () => clearTimeout(timer);
	}, []);

	// Track scroll direction with velocity-aware fallback resolution
	// During fast scroll, IntersectionObserver may not fire fast enough
	useEffect(() => {
		let lastY = window.scrollY;
		let lastTime = performance.now();
		let rafId: number | null = null;

		const handleScroll = () => {
			// Cancel pending RAF
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}

			// Clear existing idle timer - will be reset after processing
			if (scrollIdleTimerRef.current) {
				clearTimeout(scrollIdleTimerRef.current);
				scrollIdleTimerRef.current = null;
			}

			rafId = requestAnimationFrame(() => {
				const currentY = window.scrollY;
				const currentTime = performance.now();
				const deltaY = currentY - lastY;
				const deltaTime = currentTime - lastTime;

				// Update direction
				scrollDirectionRef.current = deltaY >= 0 ? "down" : "up";

				// Calculate velocity (px per 16.67ms frame)
				const velocity = deltaTime > 0 ? (Math.abs(deltaY) / deltaTime) * FRAME_TIME_MS : 0;

				lastY = currentY;
				lastTime = currentTime;

				// During fast scroll (above threshold), trigger immediate resolution
				// This ensures canvas opens/closes responsively during fast scrolling
				if (velocity > FAST_SCROLL_VELOCITY_PX_PER_FRAME) {
					resolveActiveZoneRef.current?.();

					// Position-based closure during fast scroll down
					// Handles case where IntersectionObserver misses the sentinel
					if (scrollDirectionRef.current === "down" && hasActiveZoneRef.current) {
						if (checkPositionBasedClosureRef.current?.()) {
							scheduleCloseRef.current?.();
						}
					}
				}

				if (hasActiveZoneRef.current) {
					// Set idle timer to verify canvas state when scrolling stops
					// This catches any missed observer events during rapid scrolling
					scrollIdleTimerRef.current = setTimeout(() => {
						if (hasActiveZoneRef.current && checkPositionBasedClosureRef.current?.()) {
							scheduleCloseRef.current?.();
						}
					}, SCROLL_IDLE_TIMEOUT_MS);
				}

				rafId = null;
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}
			if (scrollIdleTimerRef.current) {
				clearTimeout(scrollIdleTimerRef.current);
				scrollIdleTimerRef.current = null;
			}
		};
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

	// Keep transform layer warm briefly after close to reduce rapid
	// open/close promotion thrash while users scroll through adjacent zones.
	useEffect(() => {
		if (hasActiveZone) {
			if (willChangeTimerRef.current) {
				clearTimeout(willChangeTimerRef.current);
				willChangeTimerRef.current = null;
			}
			setWillChangeTransform(true);
			return;
		}

		willChangeTimerRef.current = setTimeout(() => {
			willChangeTimerRef.current = null;
			setWillChangeTransform(false);
		}, WILL_CHANGE_TRAIL_MS);

		return () => {
			if (willChangeTimerRef.current) {
				clearTimeout(willChangeTimerRef.current);
				willChangeTimerRef.current = null;
			}
		};
	}, [hasActiveZone]);

	// Expose canvas active state globally for components outside the context tree
	// (e.g., SectionIndicator at page level needs to shift with the blog column)
	useEffect(() => {
		document.documentElement.dataset.canvasActive = hasActiveZone ? "true" : "false";
		return () => {
			delete document.documentElement.dataset.canvasActive;
		};
	}, [hasActiveZone]);

	// Stable setter references for context consumers
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

	const clearCloseTimer = useCallback(function clearCloseTimer(): void {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
	}, []);

	const getDeactivateDelay = useCallback(function getDeactivateDelay(): number {
		const activeId = activeZoneIdRef.current;
		const config = activeId ? zoneConfigRef.current.get(activeId) : null;
		return config?.deactivateDelay ?? deactivateDelay;
	}, [deactivateDelay]);

	// Start transition lock to prevent observer feedback loops during animation
	const startTransitionLock = useCallback(function startTransitionLock(): void {
		isTransitioningRef.current = true;
		pendingResolveRef.current = false;
		if (transitionTimerRef.current) {
			clearTimeout(transitionTimerRef.current);
		}
		// Release lock after animation completes (100ms for snappier feel)
		transitionTimerRef.current = setTimeout(() => {
			isTransitioningRef.current = false;
			if (pendingResolveRef.current) {
				pendingResolveRef.current = false;
				resolveActiveZoneRef.current?.();
			}
		}, 100);
	}, []);

	const closeCanvas = useCallback(function closeCanvas(): void {
		if (!hasActiveZoneRef.current) return;
		startTransitionLock();
		handleSetHasActiveZone(false);
		handleSetActiveZoneId(null);
		handleSetCanvasContent(null);
	}, [handleSetActiveZoneId, handleSetCanvasContent, handleSetHasActiveZone, startTransitionLock]);

	const scheduleClose = useCallback(function scheduleClose(): void {
		if (!hasActiveZoneRef.current) return;
		if (closeTimerRef.current) return;
		const delay = getDeactivateDelay();
		closeTimerRef.current = setTimeout(() => {
			closeTimerRef.current = null;
			closeCanvas();
		}, delay);
	}, [closeCanvas, getDeactivateDelay]);

	// Position-based closure check: returns true if no zones intersect the reading band
	// This works independently of IntersectionObserver for fast-scroll scenarios
	const checkPositionBasedClosure = useCallback(function checkPositionBasedClosure(): boolean {
		const readingLine = window.innerHeight * READING_LINE_RATIO;
		const bottomMargin = window.innerHeight * BOTTOM_MARGIN_RATIO;
		const activeZoneId = activeZoneIdRef.current;

		if (activeZoneId) {
			const activeElement = zoneRootElementsRef.current.get(activeZoneId);
			if (activeElement) {
				const rect = activeElement.getBoundingClientRect();
				if (rect.bottom > readingLine && rect.top < bottomMargin) {
					return false; // Active zone still visible
				}
			}
		}

		for (const [id, element] of zoneRootElementsRef.current) {
			if (id === activeZoneId) continue;
			const rect = element.getBoundingClientRect();
			// Zone is visible if bottom is below reading line AND top is above exit zone
			if (rect.bottom > readingLine && rect.top < bottomMargin) {
				return false; // Zone still visible
			}
		}
		return true; // No zones intersect the reading band
	}, []);

	useEffect(() => {
		checkPositionBasedClosureRef.current = checkPositionBasedClosure;
	}, [checkPositionBasedClosure]);

	useEffect(() => {
		scheduleCloseRef.current = scheduleClose;
	}, [scheduleClose]);

	// Select best zone candidate based on intersection ratio and scroll direction
	function selectBestCandidate(
		candidates: Array<{ id: string; entry: IntersectionObserverEntry }>,
		direction: "up" | "down"
	): string {
		if (candidates.length === 1) return candidates[0].id;

		// Filter to candidates with highest ratio (within epsilon tolerance)
		const maxRatio = Math.max(...candidates.map((c) => c.entry.intersectionRatio));
		const topCandidates = candidates.filter(
			(c) => c.entry.intersectionRatio >= maxRatio - 0.02
		);

		if (topCandidates.length === 1) return topCandidates[0].id;

		// Multiple candidates with similar ratio - pick based on scroll direction
		const sorted = [...topCandidates].sort((a, b) =>
			direction === "up"
				? a.entry.boundingClientRect.bottom - b.entry.boundingClientRect.bottom
				: b.entry.boundingClientRect.top - a.entry.boundingClientRect.top
		);

		return sorted[0].id;
	}

	const activateZone = useCallback(
		function activateZone(zoneId: string): void {
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

	const resolveActiveZone = useCallback(function resolveActiveZone(): void {
		// Collect zones meeting activation threshold (checked before transition lock
		// so scroll-up can re-activate zones even during closing animation)
		const candidates: Array<{ id: string; entry: IntersectionObserverEntry }> = [];
		zoneEntryRef.current.forEach((entry, id) => {
			if (entry.isIntersecting && entry.intersectionRatio >= effectiveMinRatio) {
				candidates.push({ id, entry });
			}
		});

		if (candidates.length > 0) {
			clearCloseTimer();
			activateZone(selectBestCandidate(candidates, scrollDirectionRef.current));
			return;
		}

		// No zone candidates - defer close logic during transitions to prevent feedback loops
		if (isTransitioningRef.current) {
			pendingResolveRef.current = true;
			return;
		}

		// Close if any sentinel (end or gap) is visible in the center band
		const allSentinelIds = [
			...endSentinelIdsRef.current,
			...gapSentinelIdsRef.current,
		];
		const anySentinelVisible = allSentinelIds.some(
			(id) => sentinelEntryRef.current.get(id)?.isIntersecting
		);
		if (anySentinelVisible) {
			clearCloseTimer();
			closeCanvas();
			return;
		}

		// Position-based closure: if scrolling UP and the active zone's top
		// has scrolled BELOW the reading line (35% from top), close the canvas.
		// This handles the case where there's no sentinel above the zone.
		// Use fresh getBoundingClientRect() for accurate position during fast scroll.
		if (scrollDirectionRef.current === "up" && hasActiveZoneRef.current && activeZoneIdRef.current) {
			const zoneElement = zoneRootElementsRef.current.get(activeZoneIdRef.current) ?? null;

			if (zoneElement) {
				const rect = zoneElement.getBoundingClientRect();
				const readingLine = window.innerHeight * READING_LINE_RATIO;
				const closeOffset = getUpScrollCloseOffset(rect);
				// Zone top is below reading line = user scrolled past it going up
				if (rect.top > readingLine + closeOffset) {
					scheduleClose();
					return;
				}
			}
		}

		// Asymmetric hysteresis: scrolling down through zone content keeps canvas open
		// UNLESS position-based check indicates no zones intersect the reading band
		if (scrollDirectionRef.current === "down" && hasActiveZoneRef.current) {
			// Allow closing if position check indicates no zones intersect the reading band
			if (!checkPositionBasedClosure()) {
				return; // Keep open - still in zone content
			}
			// Fall through to scheduleClose()
		}

		scheduleClose();
	}, [
		activateZone,
		checkPositionBasedClosure,
		clearCloseTimer,
		closeCanvas,
		effectiveMinRatio,
		getUpScrollCloseOffset,
		scheduleClose,
	]);

	useEffect(() => {
		resolveActiveZoneRef.current = resolveActiveZone;
	}, [resolveActiveZone]);

	const enqueueEntries = useCallback(
		function enqueueEntries(entries: IntersectionObserverEntry[]): void {
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
		function registerZone(
			id: string,
			observeElement: HTMLElement,
			config: CanvasZoneConfig,
			zoneRootElement?: HTMLElement
		): () => void {
			zoneConfigRef.current.set(id, config);
			zoneRootElementsRef.current.set(id, zoneRootElement ?? observeElement);
			elementMetaRef.current.set(observeElement, { id, kind: "zone" });

			if (observerRef.current) {
				observerRef.current.observe(observeElement);
			}

			return () => {
				if (observerRef.current) {
					observerRef.current.unobserve(observeElement);
				}
				elementMetaRef.current.delete(observeElement);
				zoneConfigRef.current.delete(id);
				zoneRootElementsRef.current.delete(id);
				zoneEntryRef.current.delete(id);
			};
		},
		[]
	);

	const updateZoneConfig = useCallback(
		function updateZoneConfig(id: string, config: CanvasZoneConfig): void {
			zoneConfigRef.current.set(id, config);
			if (activeZoneIdRef.current === id) {
				handleSetCanvasContent(config.content ?? null);
			}
		},
		[handleSetCanvasContent]
	);

	const registerSentinel = useCallback(
		function registerSentinel(
			id: string,
			element: HTMLElement,
			kind: CanvasSentinelKind
		): () => void {
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
			if (scrollIdleTimerRef.current) {
				clearTimeout(scrollIdleTimerRef.current);
				scrollIdleTimerRef.current = null;
			}
			if (willChangeTimerRef.current) {
				clearTimeout(willChangeTimerRef.current);
				willChangeTimerRef.current = null;
			}
		};
	}, [clearCloseTimer]);

	// Smooth cubic-bezier transition (Devouring Details timing) - instant if reduced motion
	const transition = prefersReducedMotion ? { duration: 0 } : transitionCanvasSlide;

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
			{/*
			 * Full-bleed container: breaks out of parent constraints
			 * Uses 100vw width with negative margin to escape container
			 * This allows marginRight animation to work relative to viewport
			 */}
			<div
				className={cn(
					"relative min-h-screen",
					fullBleed
						? "w-screen -ml-[calc((100vw-100%)/2)]"
						: "w-full",
					className
				)}
				data-canvas-layout
				data-active={hasActiveZone}
			>
				{/* Blog Column - slides left when canvas is active */}
				<motion.div
					className="relative"
					data-blog-column
					animate={{
						x: hasActiveZone ? activeShiftX : 0,
					}}
					transition={prefersReducedMotion ? { duration: 0 } : transition}
					style={{ willChange: willChangeTransform ? "transform" : "auto" }}
				>
					{/* Content lock - max width for readability, centered */}
					<div className={cn(contentMaxWidthClassName, "mx-auto px-4 md:px-6")}>
						{children}
						<div
							ref={endSentinelRef}
							data-canvas-sentinel="end"
							className="h-px w-full"
							aria-hidden="true"
						/>
					</div>
				</motion.div>

				{/* Canvas Column - fixed overlay that stretches from right edge */}
				<AnimatePresence mode="sync">
					{hasActiveZone && (
						<motion.div
							className={cn(
								// Fixed positioning - stays in viewport while scrolling
								"fixed top-0 right-0 h-screen",
								// NO fixed width - animated from 0 to 50vw
								// Hidden on mobile
								"hidden md:flex",
								// Visual styling
								"p-4 items-center justify-center",
								// High z-index to overlay content
								"z-40",
								// Clip content during width expansion
								"overflow-hidden"
							)}
							data-canvas-column
							// Width stretch instead of x slide
							initial={{ width: 0 }}
							animate={{ width: canvasWidth }}
							exit={{ width: 0 }}
							transition={prefersReducedMotion ? { duration: 0 } : springCanvasStretch}
							style={{ willChange: "width" }}
						>
							{/* Content wrapper with delayed fade-in after container expands */}
							<motion.div
								className="w-full h-full"
								initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
								transition={prefersReducedMotion ? { duration: 0 } : canvasContentReveal}
							>
								{canvasContent || (
									<div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm bg-muted rounded-2xl">
										Canvas Active
									</div>
								)}
							</motion.div>
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
export function CanvasToggleButton(): JSX.Element {
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
