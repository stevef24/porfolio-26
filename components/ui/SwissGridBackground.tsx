"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * OatmealBackground - Clean, smooth background
 *
 * Design Philosophy:
 * - No canvas noise or grain
 * - Warm cream (light) / deep charcoal (dark)
 * - Optional subtle depth gradient
 * - Respects prefers-reduced-motion
 */
export function SwissGridBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundColor: isDark ? "#0e0e0c" : "#f8f6ef",
      }}
    >
      {/* Subtle depth gradient - adds dimension without noise */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.15) 100%)"
            : "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.02) 100%)",
        }}
      />

      {/* Optional: Very subtle radial vignette for focus */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0, 0, 0, 0.2) 100%)"
            : "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0, 0, 0, 0.03) 100%)",
        }}
      />
    </div>
  );
}

export default SwissGridBackground;
