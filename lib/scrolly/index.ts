/**
 * Scrolly Coding Module
 *
 * Server-safe exports for the scrolly coding system.
 *
 * NOTE: compile-steps.ts is server-only and must be imported directly:
 * ```tsx
 * import { compileScrollySteps } from "@/lib/scrolly/compile-steps";
 * ```
 */

export * from "./types";

// Re-export compile-steps types (not the functions - those are server-only)
export type {
	CompiledStep,
	CompilationResult,
	CompileOptions,
} from "./compile-steps";
