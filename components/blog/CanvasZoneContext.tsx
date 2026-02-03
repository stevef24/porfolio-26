"use client";

/**
 * CanvasZone Context - State management for multi-step canvas zones
 *
 * Provides active step tracking within a CanvasZone. Steps report their
 * visibility via useInView, and the context tracks which step is active.
 * Also provides renderCanvasContent function for mobile inline rendering.
 */

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
	useId,
	useEffect,
	useRef,
	type ReactNode,
} from "react";

/** Canvas content can be static ReactNode or a render function receiving step index */
export type CanvasContentRenderer = ReactNode | ((stepIndex: number) => ReactNode);

interface CanvasZoneContextValue {
	/** Currently active step index */
	activeStepIndex: number;
	/** Update active step (clamped to valid range) */
	setActiveStepIndex: (index: number) => void;
	/** Register a step element for observation */
	registerStep: (index: number, element: HTMLElement) => void;
	/** Unregister a step element */
	unregisterStep: (index: number) => void;
	/** Navigate to next step (wraps to first) */
	goToNextStep: () => void;
	/** Navigate to previous step (wraps to last) */
	goToPrevStep: () => void;
	/** Total number of steps in this zone */
	totalSteps: number;
	/** Unique ID for this zone instance */
	zoneId: string;
	/** Render canvas content for a given step (for mobile inline rendering) */
	renderCanvasContent: (stepIndex: number) => ReactNode;
}

const CanvasZoneContext = createContext<CanvasZoneContextValue | null>(null);

/**
 * Hook to access canvas zone context.
 * Must be used within a CanvasZoneProvider.
 */
export function useCanvasZoneContext(): CanvasZoneContextValue {
	const context = useContext(CanvasZoneContext);
	if (!context) {
		throw new Error(
			"useCanvasZoneContext must be used within a CanvasZoneProvider"
		);
	}
	return context;
}

/**
 * Optional hook that returns null if outside provider.
 * Useful for components that may render outside canvas zone context.
 */
export function useCanvasZoneContextOptional(): CanvasZoneContextValue | null {
	return useContext(CanvasZoneContext);
}

interface CanvasZoneProviderProps {
	/** Total number of steps */
	totalSteps: number;
	/** Initial active index (default: 0) */
	initialIndex?: number;
	/** Canvas content renderer (static or function) */
	canvasContent?: CanvasContentRenderer;
	/** Children to render */
	children: ReactNode;
}

const CANVAS_STEP_ROOT_MARGIN = "-30% 0px -30% 0px";

/**
 * Multiple thresholds ensure callbacks fire during fast scroll.
 * Single threshold (0) only fires when visibility state CHANGES.
 * During fast scroll, steps pass through entirely between callback batches.
 */
const STEP_THRESHOLDS = [0, 0.1, 0.25, 0.5, 0.75, 1.0];

/** Velocity threshold (px/frame) above which we use position-based resolution
 *  Lower value = more responsive during fast scroll (was 100, now 50)
 */
const FAST_SCROLL_VELOCITY = 50;

/**
 * Provider component for canvas zone step tracking.
 *
 * @example
 * ```tsx
 * <CanvasZoneProvider totalSteps={3}>
 *   <CanvasStep index={0}>Step 1 content</CanvasStep>
 *   <CanvasStep index={1}>Step 2 content</CanvasStep>
 *   <CanvasStep index={2}>Step 3 content</CanvasStep>
 * </CanvasZoneProvider>
 * ```
 */
export function CanvasZoneProvider({
	totalSteps,
	initialIndex = 0,
	canvasContent,
	children,
}: CanvasZoneProviderProps): JSX.Element {
	const [activeStepIndex, setActiveStepIndexState] = useState(initialIndex);
	const zoneId = useId();
	const stepElementsRef = useRef<Map<number, HTMLElement>>(new Map());
	const intersectingRef = useRef<Set<number>>(new Set());
	const stepEntryRef = useRef<Map<number, IntersectionObserverEntry>>(new Map());
	const observerRef = useRef<IntersectionObserver | null>(null);

	// Sequential visit tracking - marks steps that have been scrolled past
	const visitedStepsRef = useRef<Set<number>>(new Set());

	const setActiveStepIndex = useCallback(
		function setActiveStepIndex(index: number): void {
			// Clamp to valid range
			const clampedIndex = Math.max(0, Math.min(index, totalSteps - 1));
			setActiveStepIndexState(clampedIndex);
		},
		[totalSteps]
	);

	const goToNextStep = useCallback(function goToNextStep(): void {
		setActiveStepIndexState((prev) =>
			prev < totalSteps - 1 ? prev + 1 : 0
		);
	}, [totalSteps]);

	const goToPrevStep = useCallback(function goToPrevStep(): void {
		setActiveStepIndexState((prev) =>
			prev > 0 ? prev - 1 : totalSteps - 1
		);
	}, [totalSteps]);

	/**
	 * Position-based step resolution using getBoundingClientRect().
	 * This is the fallback during fast scroll when IntersectionObserver
	 * may not fire callbacks fast enough.
	 */
	const resolveActiveStepByPosition = useCallback(function resolveActiveStepByPosition(): void {
		const readingLine = window.innerHeight * 0.35;
		let activeStep: number | null = null;
		let closestDistance = Infinity;

		// Check all registered steps by their current position
		for (const [index, element] of stepElementsRef.current) {
			const rect = element.getBoundingClientRect();

			// Mark step as visited if its top has scrolled past reading line
			if (rect.top < readingLine) {
				visitedStepsRef.current.add(index);
			}

			// Find step whose top is closest to (but not far below) reading line
			// Active step = highest visited step still in viewport
			const distance = Math.abs(rect.top - readingLine);

			// Prefer steps at or above reading line (negative = above)
			const adjustment = rect.top > readingLine ? distance * 1.5 : distance;

			if (adjustment < closestDistance && rect.bottom > 0 && rect.top < window.innerHeight) {
				closestDistance = adjustment;
				activeStep = index;
			}
		}

		if (activeStep !== null) {
			setActiveStepIndex(activeStep);
		}
	}, [setActiveStepIndex]);

	const resolveActiveStep = useCallback(function resolveActiveStep(): void {
		if (intersectingRef.current.size === 0) return;

		if (intersectingRef.current.size === 1) {
			const [only] = intersectingRef.current;
			setActiveStepIndex(only);
			return;
		}

		// Use reading position (35% from top) instead of center.
		// This matches where eyes naturally track when scrolling.
		const readingLine = window.innerHeight * 0.35;
		let closest: { index: number; distance: number } | null = null;

		for (const index of intersectingRef.current) {
			const entry = stepEntryRef.current.get(index);
			if (!entry) continue;
			const rect = entry.boundingClientRect;
			// Measure from TOP of element to reading line
			// This activates the step when its heading reaches reading position
			const distance = Math.abs(rect.top - readingLine);
			if (!closest || distance < closest.distance) {
				closest = { index, distance };
			}
		}

		if (closest) {
			setActiveStepIndex(closest.index);
		}
	}, [setActiveStepIndex]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const indexAttr = entry.target.getAttribute("data-canvas-step-index");
					if (!indexAttr) continue;
					const index = Number(indexAttr);
					if (Number.isNaN(index)) continue;

					stepEntryRef.current.set(index, entry);
					if (entry.isIntersecting) {
						intersectingRef.current.add(index);
					} else {
						intersectingRef.current.delete(index);
					}
				}

				resolveActiveStep();
			},
			{
				rootMargin: CANVAS_STEP_ROOT_MARGIN,
				threshold: STEP_THRESHOLDS,
			}
		);

		observerRef.current = observer;

		for (const element of stepElementsRef.current.values()) {
			observer.observe(element);
		}

		return () => {
			observer.disconnect();
			observerRef.current = null;
		};
	}, [resolveActiveStep]);

	/**
	 * Scroll velocity detection with RAF throttling.
	 * During fast scroll (>100px/frame), IntersectionObserver may miss steps.
	 * This uses position-based resolution as a fallback.
	 */
	useEffect(() => {
		let lastScrollY = window.scrollY;
		let lastTime = performance.now();
		let rafId: number | null = null;

		const handleScroll = () => {
			// Cancel any pending RAF
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}

			// Schedule position check on next frame
			rafId = requestAnimationFrame(() => {
				const currentY = window.scrollY;
				const currentTime = performance.now();
				const deltaY = Math.abs(currentY - lastScrollY);
				const deltaTime = currentTime - lastTime;

				// Calculate velocity (px per 16.67ms frame)
				const velocity = deltaTime > 0 ? (deltaY / deltaTime) * 16.67 : 0;

				// Store for next comparison
				lastScrollY = currentY;
				lastTime = currentTime;

				// During fast scroll, use position-based resolution
				if (velocity > FAST_SCROLL_VELOCITY) {
					resolveActiveStepByPosition();
				}

				rafId = null;
			});
		};

		// Passive listener for better scroll performance
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}
		};
	}, [resolveActiveStepByPosition]);

	const registerStep = useCallback(function registerStep(
		index: number,
		element: HTMLElement
	): void {
		stepElementsRef.current.set(index, element);
		element.setAttribute("data-canvas-step-index", String(index));

		if (observerRef.current) {
			observerRef.current.observe(element);
		}
	}, []);

	const unregisterStep = useCallback(function unregisterStep(index: number): void {
		const element = stepElementsRef.current.get(index);
		if (element && observerRef.current) {
			observerRef.current.unobserve(element);
		}
		stepElementsRef.current.delete(index);
		intersectingRef.current.delete(index);
		stepEntryRef.current.delete(index);
	}, []);

	// Render canvas content for a given step index
	const renderCanvasContent = useCallback(
		function renderCanvasContent(stepIndex: number): ReactNode {
			if (!canvasContent) return null;
			if (typeof canvasContent === "function") {
				return canvasContent(stepIndex);
			}
			return canvasContent;
		},
		[canvasContent]
	);

	const value = useMemo<CanvasZoneContextValue>(
		() => ({
			activeStepIndex,
			setActiveStepIndex,
			registerStep,
			unregisterStep,
			goToNextStep,
			goToPrevStep,
			totalSteps,
			zoneId,
			renderCanvasContent,
		}),
		[
			activeStepIndex,
			setActiveStepIndex,
			registerStep,
			unregisterStep,
			goToNextStep,
			goToPrevStep,
			totalSteps,
			zoneId,
			renderCanvasContent,
		]
	);

	return (
		<CanvasZoneContext.Provider value={value}>
			{children}
		</CanvasZoneContext.Provider>
	);
}

export { CanvasZoneContext };
