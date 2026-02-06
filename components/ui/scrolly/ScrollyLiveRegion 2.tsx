"use client";

/**
 * ScrollyLiveRegion - Announces step changes to screen readers
 *
 * Uses aria-live="polite" to announce when the active step changes,
 * without interrupting the user's current action.
 */

import { useEffect, useState } from "react";
import { useScrollyContext } from "./ScrollyContext";
import type { ScrollyCodeStep } from "@/lib/scrolly/types";

interface ScrollyLiveRegionProps {
	/** Steps array for title lookup */
	steps: Pick<ScrollyCodeStep, "title">[];
}

/**
 * Invisible live region that announces step changes to assistive technology.
 *
 * @example
 * ```tsx
 * <ScrollyLiveRegion steps={steps} />
 * // Screen reader announces: "Step 2 of 4: Creating the store"
 * ```
 */
export function ScrollyLiveRegion({ steps }: ScrollyLiveRegionProps) {
	const { activeIndex, totalSteps } = useScrollyContext();
	const [previousIndex, setPreviousIndex] = useState(activeIndex);

	// Only announce when index actually changes (not on initial render)
	const shouldAnnounce = previousIndex !== activeIndex;

	useEffect(() => {
		setPreviousIndex(activeIndex);
	}, [activeIndex]);

	const currentStep = steps[activeIndex];
	const announcement = currentStep
		? `Step ${activeIndex + 1} of ${totalSteps}: ${currentStep.title}`
		: "";

	return (
		<div
			role="status"
			aria-live="polite"
			aria-atomic="true"
			className="sr-only"
		>
			{shouldAnnounce && announcement}
		</div>
	);
}
