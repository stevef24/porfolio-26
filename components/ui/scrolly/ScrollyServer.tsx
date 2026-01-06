/**
 * ScrollyServer - Server Component wrapper for MDX integration
 *
 * This async server component handles Shiki compilation and passes
 * compiled tokens to the client-side ScrollyCoding component.
 *
 * @example
 * ```mdx
 * import { steps } from "./my-post.steps";
 * <Scrolly steps={steps} />
 * ```
 */

import { compileScrollySteps } from "@/lib/scrolly/compile-steps";
import { ScrollyCoding } from "./ScrollyCoding";
import type { ScrollyCodeStep, ScrollyCodeDoc } from "@/lib/scrolly/types";

export interface ScrollyProps {
	/** Array of step definitions */
	steps: ScrollyCodeStep[];
	/** Optional document-level configuration */
	doc?: Omit<ScrollyCodeDoc, "steps">;
	/** Additional class names */
	className?: string;
}

/**
 * Async server component for ScrollyCoding.
 *
 * Compiles Shiki tokens server-side and hydrates the client component.
 * Automatically handles dual-theme compilation (light/dark).
 */
export async function Scrolly({ steps, doc, className }: ScrollyProps) {
	// Server-side compilation (runs at build/request time)
	const compiledSteps = await compileScrollySteps(steps, doc);

	// Log any compilation errors in dev
	if (process.env.NODE_ENV === "development" && compiledSteps.errors.length > 0) {
		console.warn("[Scrolly] Compilation errors:", compiledSteps.errors);
	}

	return (
		<ScrollyCoding
			steps={steps}
			compiledSteps={compiledSteps}
			doc={doc}
			className={className}
		/>
	);
}

/**
 * Re-export types for convenience
 */
export type { ScrollyCodeStep, ScrollyCodeDoc } from "@/lib/scrolly/types";
