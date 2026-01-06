/**
 * Client-safe Scrolly Utilities
 *
 * Pure functions for working with compiled scrolly data.
 * Safe to import in both server and client components.
 */

import type { KeyedTokensInfo } from "shiki-magic-move/core";

/**
 * Compiled step output structure (mirrored from compile-steps for client use).
 */
export type CompiledStep = {
	/** Step index */
	index: number;
	/** Step ID for keying */
	id: string;
	/** Precompiled Magic Move tokens */
	tokens: KeyedTokensInfo;
	/** Theme used for compilation */
	theme: string;
	/** Language used */
	lang: string;
};

/**
 * Compilation result with metadata.
 */
export type CompilationResult = {
	/** Compiled steps array */
	steps: CompiledStep[];
	/** Light theme tokens (for dual-theme support) */
	stepsLight: CompiledStep[];
	/** Dark theme tokens */
	stepsDark: CompiledStep[];
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
 * Get tokens for a specific theme from compilation result.
 */
export function getTokensForTheme(
	result: CompilationResult,
	theme: "light" | "dark"
): KeyedTokensInfo[] {
	const steps = theme === "light" ? result.stepsLight : result.stepsDark;
	return extractTokensForPrecompiled(steps);
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
