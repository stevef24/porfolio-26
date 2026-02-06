/**
 * AgentCodeWalkthroughServer - Server-side wrapper for code walkthrough
 *
 * Compiles code steps with Shiki Magic Move tokens server-side,
 * then passes the compiled tokens to the client component for
 * animated code transitions between steps.
 */

import "server-only";
import type { ReactNode } from "react";
import { compileCodeSteps, type CodeStep } from "@/lib/compile-code-steps";
import { AgentCodeWalkthroughClient } from "./AgentCodeWalkthrough";

interface AgentCodeWalkthroughServerProps {
  /** Raw code steps to compile */
  steps: CodeStep[];
  /** Step content (CanvasStep components) */
  children: ReactNode;
}

/**
 * Server component that compiles code steps with Shiki Magic Move tokens.
 * Enables animated token transitions between code steps.
 */
export async function AgentCodeWalkthroughServer({
  steps,
  children,
}: AgentCodeWalkthroughServerProps): Promise<JSX.Element> {
  const compiledSteps = await compileCodeSteps(steps);

  return (
    <AgentCodeWalkthroughClient steps={compiledSteps}>
      {children}
    </AgentCodeWalkthroughClient>
  );
}
