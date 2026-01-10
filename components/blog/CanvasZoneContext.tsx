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

const CANVAS_STEP_ROOT_MARGIN = "-40% 0px -40% 0px";

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
}: CanvasZoneProviderProps) {
	const [activeStepIndex, setActiveStepIndexState] = useState(initialIndex);
	const zoneId = useId();
	const stepElementsRef = useRef<Map<number, HTMLElement>>(new Map());
	const intersectingRef = useRef<Set<number>>(new Set());
	const stepEntryRef = useRef<Map<number, IntersectionObserverEntry>>(new Map());
	const observerRef = useRef<IntersectionObserver | null>(null);

	const setActiveStepIndex = useCallback(
		(index: number) => {
			// Clamp to valid range
			const clampedIndex = Math.max(0, Math.min(index, totalSteps - 1));
			setActiveStepIndexState(clampedIndex);
		},
		[totalSteps]
	);

	const goToNextStep = useCallback(() => {
		setActiveStepIndexState((prev) =>
			prev < totalSteps - 1 ? prev + 1 : 0
		);
	}, [totalSteps]);

	const goToPrevStep = useCallback(() => {
		setActiveStepIndexState((prev) =>
			prev > 0 ? prev - 1 : totalSteps - 1
		);
	}, [totalSteps]);

	const resolveActiveStep = useCallback(() => {
		if (intersectingRef.current.size === 0) return;

		if (intersectingRef.current.size === 1) {
			const [only] = intersectingRef.current;
			setActiveStepIndex(only);
			return;
		}

		const viewportCenter = window.innerHeight / 2;
		let closest: { index: number; distance: number } | null = null;

		for (const index of intersectingRef.current) {
			const entry = stepEntryRef.current.get(index);
			if (!entry) continue;
			const rect = entry.boundingClientRect;
			const center = rect.top + rect.height / 2;
			const distance = Math.abs(center - viewportCenter);
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
				threshold: 0,
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

	const registerStep = useCallback((index: number, element: HTMLElement) => {
		stepElementsRef.current.set(index, element);
		element.setAttribute("data-canvas-step-index", String(index));

		if (observerRef.current) {
			observerRef.current.observe(element);
		}
	}, []);

	const unregisterStep = useCallback((index: number) => {
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
		(stepIndex: number): ReactNode => {
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
