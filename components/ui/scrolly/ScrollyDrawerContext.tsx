"use client";

/**
 * ScrollyDrawerContext - State management for the sliding drawer canvas
 *
 * Manages the open/close state of the scrolly drawer, which slides in from
 * the right edge of the viewport when entering a scrolly section.
 *
 * Usage:
 * - Wrap ScrollyCoding in ScrollyDrawerProvider
 * - Use useScrollyDrawer() for components that need drawer state
 * - Use useScrollyDrawerOptional() for components that may not have a drawer (e.g., RulerTOC)
 */

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
	type ReactNode,
} from "react";

interface ScrollyDrawerContextValue {
	/** Whether drawer is currently open (scrolly section is in viewport) */
	isDrawerOpen: boolean;
	/** Open the drawer (called when scrolly enters viewport) */
	openDrawer: () => void;
	/** Close the drawer (called when scrolly exits viewport) */
	closeDrawer: () => void;
	/** Toggle drawer state */
	toggleDrawer: () => void;
}

const ScrollyDrawerContext = createContext<ScrollyDrawerContextValue | null>(
	null
);

/**
 * Hook to access drawer state. Throws if used outside ScrollyDrawerProvider.
 */
export function useScrollyDrawer(): ScrollyDrawerContextValue {
	const context = useContext(ScrollyDrawerContext);
	if (!context) {
		throw new Error(
			"useScrollyDrawer must be used within ScrollyDrawerProvider"
		);
	}
	return context;
}

/**
 * Hook to optionally access drawer state.
 * Returns null if no ScrollyDrawerProvider exists (safe for RulerTOC on non-scrolly pages).
 */
export function useScrollyDrawerOptional(): ScrollyDrawerContextValue | null {
	return useContext(ScrollyDrawerContext);
}

interface ScrollyDrawerProviderProps {
	children: ReactNode;
}

/**
 * Provider for scrolly drawer state.
 * Wraps ScrollyCoding to enable drawer animations.
 */
export function ScrollyDrawerProvider({
	children,
}: ScrollyDrawerProviderProps) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
	const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
	const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

	const value = useMemo(
		() => ({
			isDrawerOpen,
			openDrawer,
			closeDrawer,
			toggleDrawer,
		}),
		[isDrawerOpen, openDrawer, closeDrawer, toggleDrawer]
	);

	return (
		<ScrollyDrawerContext.Provider value={value}>
			{children}
		</ScrollyDrawerContext.Provider>
	);
}
