"use client";

import { useEffect, useRef } from "react";

interface UseTabVisibilityOptions {
	awayMessage?: string;
	originalTitle?: string;
	enabled?: boolean;
}

export function useTabVisibility({
	awayMessage = "Come back on board",
	originalTitle,
	enabled = true,
}: UseTabVisibilityOptions = {}) {
	const originalTitleRef = useRef<string>("");

	useEffect(() => {
		if (!enabled || typeof document === "undefined") return;

		const handleVisibilityChange = () => {
			if (document.hidden) {
				// Capture the current route title before showing away message.
				originalTitleRef.current = originalTitle || document.title;
				document.title = awayMessage;
			} else {
				// Restore the last active route title.
				document.title = originalTitleRef.current || originalTitle || document.title;
			}
		};

		// Initialize with the current page title.
		originalTitleRef.current = originalTitle || document.title;
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			document.title = originalTitleRef.current || document.title;
		};
	}, [awayMessage, originalTitle, enabled]);
}
