"use client";

/**
 * Scrolly Context - State management for scrolly code walkthroughs
 *
 * Provides active step tracking across the ScrollyCoding component tree.
 * Steps report their visibility via useInView, context determines active step.
 */

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
	useId,
	type ReactNode,
} from "react";
import type { ScrollyContextValue } from "@/lib/scrolly/types";

// Extended context with navigation and accessibility helpers
interface ExtendedScrollyContextValue extends ScrollyContextValue {
	/** Go to next step (clamped) */
	goToNextStep: () => void;
	/** Go to previous step (clamped) */
	goToPrevStep: () => void;
	/** Unique ID prefix for ARIA relationships */
	scrollyId: string;
}

const ScrollyContext = createContext<ExtendedScrollyContextValue | null>(null);

/**
 * Hook to access scrolly context.
 * Must be used within a ScrollyProvider.
 */
export function useScrollyContext(): ExtendedScrollyContextValue {
	const context = useContext(ScrollyContext);
	if (!context) {
		throw new Error("useScrollyContext must be used within a ScrollyProvider");
	}
	return context;
}

/**
 * Optional hook that returns null if outside provider.
 * Useful for components that may render outside scrolly context.
 */
export function useScrollyContextOptional(): ExtendedScrollyContextValue | null {
	return useContext(ScrollyContext);
}

interface ScrollyProviderProps {
	/** Total number of steps */
	totalSteps: number;
	/** Initial active index (default: 0) */
	initialIndex?: number;
	/** Children to render */
	children: ReactNode;
}

/**
 * Provider component for scrolly state.
 *
 * @example
 * ```tsx
 * <ScrollyProvider totalSteps={steps.length}>
 *   <ScrollySteps />
 *   <ScrollyStage />
 * </ScrollyProvider>
 * ```
 */
export function ScrollyProvider({
	totalSteps,
	initialIndex = 0,
	children,
}: ScrollyProviderProps) {
	const [activeIndex, setActiveIndexState] = useState(initialIndex);
	const scrollyId = useId();

	const setActiveIndex = useCallback(
		(index: number) => {
			// Clamp to valid range
			const clampedIndex = Math.max(0, Math.min(index, totalSteps - 1));
			setActiveIndexState(clampedIndex);
		},
		[totalSteps]
	);

	const goToNextStep = useCallback(() => {
		setActiveIndexState((prev) => Math.min(prev + 1, totalSteps - 1));
	}, [totalSteps]);

	const goToPrevStep = useCallback(() => {
		setActiveIndexState((prev) => Math.max(prev - 1, 0));
	}, []);

	const value = useMemo<ExtendedScrollyContextValue>(
		() => ({
			activeIndex,
			setActiveIndex,
			totalSteps,
			goToNextStep,
			goToPrevStep,
			scrollyId,
		}),
		[activeIndex, setActiveIndex, totalSteps, goToNextStep, goToPrevStep, scrollyId]
	);

	return (
		<ScrollyContext.Provider value={value}>{children}</ScrollyContext.Provider>
	);
}

export { ScrollyContext };
