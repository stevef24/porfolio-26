"use client";

/**
 * AgentCodeWalkthrough - Stepped code walkthrough for the Agent SDK tutorial
 *
 * This component wraps CanvasZone in stepped mode with CanvasCodeStage
 * to display code examples as the user scrolls through steps.
 *
 * Supports:
 * - Raw CodeStep (plain text)
 * - CompiledCodeStep (Shiki HTML with diff/highlight notation)
 */

import type { ReactNode } from "react";
import { CanvasZone } from "./CanvasZone";
import { CanvasCodeStage, type AnyCodeStep } from "./CanvasCodeStage";

interface AgentCodeWalkthroughProps {
  /** Code steps to display in the canvas (raw or compiled HTML) */
  steps: AnyCodeStep[];
  /** Step content (CanvasStep components) */
  children: ReactNode;
}

/**
 * Walkthrough component that renders code in the canvas sidebar
 * as the user scrolls through step explanations.
 */
export function AgentCodeWalkthrough({
  steps,
  children,
}: AgentCodeWalkthroughProps): JSX.Element {
  function renderCanvasContent(index: number): ReactNode {
    return <CanvasCodeStage steps={steps} activeIndex={index} />;
  }

  return (
    <CanvasZone
      mode="stepped"
      totalSteps={steps.length}
      canvasContent={renderCanvasContent}
    >
      {children}
    </CanvasZone>
  );
}

// Also export as client version for server wrapper
export { AgentCodeWalkthrough as AgentCodeWalkthroughClient };
