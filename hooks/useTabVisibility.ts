"use client";

import { useEffect, useRef } from "react";

interface UseTabVisibilityOptions {
	awayMessage?: string;
	originalTitle?: string;
	enabled?: boolean;
}

export function useTabVisibility({
	awayMessage = "Come back - I'm bored",
	originalTitle,
	enabled = true,
}: UseTabVisibilityOptions = {}) {
	const originalTitleRef = useRef<string>("");

	useEffect(() => {
		if (!enabled || typeof document === "undefined") return;

		// Store the original title
		originalTitleRef.current = originalTitle || document.title;

		const handleVisibilityChange = () => {
			if (document.hidden) {
				// User switched away from tab
				document.title = awayMessage;
			} else {
				// User returned to tab
				document.title = originalTitleRef.current;
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			// Restore original title on cleanup
			document.title = originalTitleRef.current;
		};
	}, [awayMessage, originalTitle, enabled]);
}
