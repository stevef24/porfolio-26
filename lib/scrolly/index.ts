/**
 * Scrolly Coding Module
 *
 * Client-safe exports for the scrolly coding system.
 *
 * NOTE: compileScrollySteps() is server-only and must be imported directly:
 * ```tsx
 * import { compileScrollySteps } from "@/lib/scrolly/compile-steps";
 * ```
 */

export * from "./types";

// Client-safe utilities and types
export {
	getTokensForTheme,
	extractTokensForPrecompiled,
	hasCompilationErrors,
	isStepCompiled,
	type CompiledStep,
	type CompilationResult,
} from "./utils";
