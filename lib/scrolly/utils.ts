/**
 * Client-safe Scrolly Utilities
 *
 * Pure functions for working with compiled scrolly data.
 * Safe to import in both server and client components.
 */

import type { KeyedTokensInfo } from "shiki-magic-move/core";

/**
 * Compiled step output structure (mirrored from compile-steps for client use).
 *
 * With dual-theme compilation, each token contains both theme colors:
 * - `color`: Light theme color (default)
 * - `--shiki-dark`: Dark theme color (CSS variable)
 */
export type CompiledStep = {
	/** Step index */
	index: number;
	/** Step ID for keying */
	id: string;
	/** Precompiled Magic Move tokens with dual-theme colors */
	tokens: KeyedTokensInfo;
	/** Language used */
	lang: string;
};

/**
 * Compilation result with metadata.
 *
 * Uses single compilation with dual-theme tokens for instant CSS-based theme switching.
 */
export type CompilationResult = {
	/** Compiled steps array with dual-theme tokens */
	steps: CompiledStep[];
	/** Any compilation errors (non-fatal) */
	errors: Array<{ stepId: string; message: string }>;
};

/**
 * Extract just the tokens array for ShikiMagicMovePrecompiled.
 *
 * The ShikiMagicMovePrecompiled component expects an array of KeyedTokensInfo.
 * This helper extracts just the tokens from our compiled steps.
 *
 * @param compiledSteps - Array of CompiledStep
 * @returns Array of KeyedTokensInfo for the precompiled component
 */
export function extractTokensForPrecompiled(compiledSteps: CompiledStep[]): KeyedTokensInfo[] {
	return compiledSteps.map((step) => step.tokens);
}

/**
 * Validate that all steps compiled successfully.
 */
export function hasCompilationErrors(result: CompilationResult): boolean {
	return result.errors.length > 0;
}

/**
 * Check if a specific step has valid tokens.
 */
export function isStepCompiled(step: CompiledStep): boolean {
	return step.tokens !== null;
}
