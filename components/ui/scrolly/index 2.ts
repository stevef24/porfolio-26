/**
 * Scrolly Coding Components
 *
 * Interactive code walkthrough system with scroll-based activation.
 *
 * @example
 * ```tsx
 * // In a Server Component
 * import { compileScrollySteps } from "@/lib/scrolly/compile-steps";
 * import { ScrollyCoding } from "@/components/ui/scrolly";
 *
 * const compiledSteps = await compileScrollySteps(steps);
 * return <ScrollyCoding steps={steps} compiledSteps={compiledSteps} />;
 * ```
 */

// Main components
export { ScrollyCoding } from "./ScrollyCoding";
export { ScrollyStep } from "./ScrollyStep";
export { ScrollyStage } from "./ScrollyStage";
export { ScrollyStageMobile } from "./ScrollyStageMobile";
export { ScrollyLiveRegion } from "./ScrollyLiveRegion";
export { StageControls } from "./StageControls";
export { StageFullscreen } from "./StageFullscreen";

// Server component for MDX integration (async compilation)
export { Scrolly, type ScrollyProps } from "./ScrollyServer";

// Context and hooks
export {
	ScrollyProvider,
	useScrollyContext,
	useScrollyContextOptional,
	ScrollyContext,
} from "./ScrollyContext";

// Drawer context (for TOC coordination)
export {
	ScrollyDrawerProvider,
	useScrollyDrawer,
	useScrollyDrawerOptional,
} from "./ScrollyDrawerContext";
