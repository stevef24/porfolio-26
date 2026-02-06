"use client";

/**
 * MagicMoveCode - Standalone Shiki Magic Move renderer
 *
 * A reusable component for animated code transitions using Shiki Magic Move.
 * Extracted from ScrollyStage for use in CanvasCodeStage and other contexts.
 *
 * Features:
 * - Animated token transitions between code steps
 * - Dual-theme support (CSS-based instant switching)
 * - Precompiled tokens for optimal performance
 * - Reduced motion support
 */

import { useMemo, useCallback, useEffect, useState, memo } from "react";
import { ShikiMagicMoveRenderer } from "shiki-magic-move/react";
import { syncTokenKeys, toKeyedTokens } from "shiki-magic-move/core";
import type {
  MagicMoveDifferOptions,
  MagicMoveRenderOptions,
} from "shiki-magic-move/types";
import { cn } from "@/lib/utils";
import {
  MAGIC_MOVE_DEFAULTS,
  dedupeTokenKeys,
  type KeyedTokensInfo,
} from "@/types/code-steps";

/**
 * Combined options for Magic Move differ and renderer
 */
export type MagicMoveOptions = MagicMoveRenderOptions & MagicMoveDifferOptions;

// Re-export for backward compatibility
export { MAGIC_MOVE_DEFAULTS };

/**
 * Empty tokens placeholder for initial state
 */
const EMPTY_TOKENS = toKeyedTokens("", []);

export interface MagicMoveCodeProps {
  /**
   * Array of precompiled token steps from server-side compilation.
   * Each step should be a KeyedTokensInfo object from codeToKeyedTokens().
   */
  steps: KeyedTokensInfo[];
  /**
   * Current active step index (0-based)
   */
  activeIndex: number;
  /**
   * Enable/disable animations (set false for reduced motion)
   * @default true
   */
  animate?: boolean;
  /**
   * Animation options for Magic Move
   */
  options?: MagicMoveOptions;
  /**
   * Callback fired when animation starts
   */
  onAnimationStart?: () => void;
  /**
   * Callback fired when animation ends
   */
  onAnimationEnd?: () => void;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * MagicMoveCode - Animated code transitions with Shiki Magic Move
 *
 * This component renders precompiled Shiki tokens with smooth animations
 * between steps. It handles token key synchronization and deduplication
 * internally.
 *
 * @example
 * ```tsx
 * // Basic usage with precompiled tokens
 * <MagicMoveCode
 *   steps={compiledTokens}
 *   activeIndex={currentStep}
 * />
 *
 * // With animation callbacks
 * <MagicMoveCode
 *   steps={compiledTokens}
 *   activeIndex={currentStep}
 *   onAnimationStart={() => setAnimating(true)}
 *   onAnimationEnd={() => setAnimating(false)}
 * />
 *
 * // With custom options
 * <MagicMoveCode
 *   steps={compiledTokens}
 *   activeIndex={currentStep}
 *   options={{ duration: 300, stagger: 2 }}
 * />
 * ```
 */
export const MagicMoveCode = memo(function MagicMoveCode({
  steps,
  activeIndex,
  animate = true,
  options,
  onAnimationStart,
  onAnimationEnd,
  className,
}: MagicMoveCodeProps) {
  const [previousTokens, setPreviousTokens] =
    useState<KeyedTokensInfo>(EMPTY_TOKENS);

  // Merge default options with provided options
  const mergedOptions = useMemo(
    () => ({
      duration: MAGIC_MOVE_DEFAULTS.duration,
      stagger: MAGIC_MOVE_DEFAULTS.stagger,
      ...options,
    }),
    [options]
  );

  const currentTokens = useMemo(() => {
    if (steps.length === 0) return EMPTY_TOKENS;
    const clampedIndex = Math.max(0, Math.min(activeIndex, steps.length - 1));
    return steps[clampedIndex];
  }, [steps, activeIndex]);

  useEffect(() => {
    setPreviousTokens(currentTokens);
  }, [currentTokens]);

  const result = useMemo(() => {
    if (steps.length === 0) {
      return { from: EMPTY_TOKENS, to: EMPTY_TOKENS };
    }

    const synced = syncTokenKeys(previousTokens, currentTokens, mergedOptions);
    return {
      from: dedupeTokenKeys(synced.from),
      to: dedupeTokenKeys(synced.to),
    };
  }, [steps.length, previousTokens, currentTokens, mergedOptions]);

  // Stable callback refs
  const handleStart = useCallback(() => {
    onAnimationStart?.();
  }, [onAnimationStart]);

  const handleEnd = useCallback(() => {
    onAnimationEnd?.();
  }, [onAnimationEnd]);

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className={cn("shiki-magic-move-container", className)}>
      <ShikiMagicMoveRenderer
        tokens={result.to}
        previous={result.from}
        options={mergedOptions}
        animate={animate}
        onStart={handleStart}
        onEnd={handleEnd}
      />
    </div>
  );
});

/**
 * Utility to extract tokens array from compilation result.
 * Useful for converting TokenCompilationResult to MagicMoveCode props.
 */
export function extractTokensFromSteps(
  compiledSteps: Array<{ tokens?: KeyedTokensInfo }>
): KeyedTokensInfo[] {
  return compiledSteps
    .map((step) => step.tokens)
    .filter((tokens): tokens is KeyedTokensInfo => tokens != null);
}
