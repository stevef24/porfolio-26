"use client";

/**
 * ReadingProseWrapper - Client wrapper for MDX prose with reading focus
 *
 * Wraps MDX content with ReadingZoneProvider to enable paragraph focus
 * highlighting. Paragraphs automatically fade in/out based on scroll
 * position when this wrapper is present.
 *
 * @example
 * ```tsx
 * <ReadingProseWrapper enabled={true}>
 *   <Mdx components={customComponents} />
 * </ReadingProseWrapper>
 * ```
 */

import { type ReactNode } from "react";
import { ReadingZoneProvider } from "./ReadingZoneProvider";
import { cn } from "@/lib/utils";

interface ReadingProseWrapperProps {
	children: ReactNode;
	/**
	 * Whether reading focus highlighting is enabled.
	 * When false, all paragraphs appear at full opacity.
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * Additional CSS classes for the wrapper div.
	 */
	className?: string;
	/**
	 * IntersectionObserver margin for center zone detection.
	 * Default: "-40% 0px -40% 0px" creates a center ~20% zone.
	 */
	rootMargin?: string;
}

export function ReadingProseWrapper({
	children,
	enabled = true,
	className,
	rootMargin,
}: ReadingProseWrapperProps) {
	return (
		<ReadingZoneProvider enabled={enabled} rootMargin={rootMargin}>
			<div className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}>
				{children}
			</div>
		</ReadingZoneProvider>
	);
}
