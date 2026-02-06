"use client";

/**
 * RenderCanvas - Step-based canvas content renderer
 *
 * Displays one step at a time from an array of React components.
 * Transitions between steps are instant (no animation).
 *
 * @example
 * ```tsx
 * <CanvasZone
 *   mode="stepped"
 *   totalSteps={3}
 *   canvasContent={(index) => (
 *     <RenderCanvas
 *       steps={[<Demo0 />, <Demo1 />, <Demo2 />]}
 *       activeStep={index}
 *     />
 *   )}
 * >
 *   <CanvasStep index={0}>Step 1</CanvasStep>
 *   <CanvasStep index={1}>Step 2</CanvasStep>
 *   <CanvasStep index={2}>Step 3</CanvasStep>
 * </CanvasZone>
 * ```
 */

import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RenderCanvasProps {
  /** Array of React components, one per step */
  steps: ReactNode[];
  /** Currently active step index */
  activeStep: number;
  /** Additional class names for the container */
  className?: string;
}

/**
 * RenderCanvas renders a single step from the steps array.
 * Step transitions are instant - no fade animation.
 */
export function RenderCanvas({
  steps,
  activeStep,
  className,
}: RenderCanvasProps): JSX.Element {
  // Clamp activeStep to valid range
  const clampedStep = useMemo(() => {
    if (steps.length === 0) return 0;
    return Math.max(0, Math.min(activeStep, steps.length - 1));
  }, [activeStep, steps.length]);

  // Get current step content
  const currentContent = steps[clampedStep] ?? null;

  return (
    <div className={cn("relative w-full h-full min-h-0", className)}>
      {currentContent}
    </div>
  );
}

export default RenderCanvas;
