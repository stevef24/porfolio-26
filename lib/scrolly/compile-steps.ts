/**
 * Server-side Shiki Magic Move Compiler
 *
 * Compiles ScrollyCodeStep[] into precompiled tokens for client-side rendering.
 * This module is server-only - never import in client components.
 *
 * @example
 * ```tsx
 * // In a Server Component
 * import { compileScrollySteps } from "@/lib/scrolly/compile-steps";
 *
 * const compiledSteps = await compileScrollySteps(steps);
 * return <ScrollyCoding steps={steps} compiledSteps={compiledSteps} />;
 * ```
 */
import "server-only";

import { createHighlighter, type HighlighterGeneric, type BundledLanguage, type BundledTheme } from "shiki";
import { codeToKeyedTokens, type KeyedTokensInfo } from "shiki-magic-move/core";
import type { ScrollyCodeStep, ScrollyCodeDoc } from "./types";
import { SCROLLY_DEFAULTS } from "./types";
import type { CompiledStep, CompilationResult } from "./utils";

// Re-export types for convenience
export type { CompiledStep, CompilationResult } from "./utils";
export {
	getTokensForTheme,
	extractTokensForPrecompiled,
	hasCompilationErrors,
	isStepCompiled,
} from "./utils";

/**
 * Compilation options.
 */
export type CompileOptions = {
	/** Theme pair for dual-theme support */
	themes?: { light: string; dark: string };
	/** Show line numbers in output */
	lineNumbers?: boolean;
};

/**
 * Cached highlighter instance (per-process singleton).
 * Avoids re-initializing Shiki for every compilation.
 */
let highlighterPromise: Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> | null = null;

/**
 * Default languages to load in the highlighter.
 * Add languages here as needed for your blog content.
 */
const DEFAULT_LANGUAGES: BundledLanguage[] = [
	"typescript",
	"tsx",
	"javascript",
	"jsx",
	"css",
	"html",
	"json",
	"yaml",
	"markdown",
	"mdx",
	"python",
	"rust",
	"go",
	"sql",
	"bash",
	"shell",
];

/**
 * Initialize or return cached highlighter.
 */
async function getHighlighter(
	themes: { light: string; dark: string } = SCROLLY_DEFAULTS.theme
): Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: [themes.light, themes.dark] as BundledTheme[],
			langs: DEFAULT_LANGUAGES,
		});
	}
	return highlighterPromise;
}

/**
 * Compile a single step's code into Magic Move tokens.
 */
async function compileStep(
	highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>,
	step: ScrollyCodeStep,
	index: number,
	theme: string,
	options: { lineNumbers?: boolean } = {}
): Promise<CompiledStep> {
	const { lineNumbers = step.magicMove?.lineNumbers ?? SCROLLY_DEFAULTS.magicMove.lineNumbers } = options;

	const tokens = codeToKeyedTokens(highlighter, step.code, {
		lang: step.lang as BundledLanguage,
		theme: theme as BundledTheme,
	}, lineNumbers);

	return {
		index,
		id: step.id,
		tokens,
		theme,
		lang: step.lang,
	};
}

/**
 * Compile all steps for a scrolly code document.
 *
 * Generates precompiled tokens for both light and dark themes,
 * enabling instant theme switching without re-compilation.
 *
 * @param steps - Array of ScrollyCodeStep definitions
 * @param doc - Optional document-level configuration
 * @param options - Compilation options
 * @returns Compiled tokens for client-side rendering
 *
 * @example
 * ```tsx
 * const result = await compileScrollySteps(steps, {
 *   themes: { light: "github-light", dark: "github-dark" }
 * });
 * ```
 */
export async function compileScrollySteps(
	steps: ScrollyCodeStep[],
	doc?: Omit<ScrollyCodeDoc, "steps">,
	options: CompileOptions = {}
): Promise<CompilationResult> {
	const themes = options.themes ?? doc?.theme ?? SCROLLY_DEFAULTS.theme;
	const errors: Array<{ stepId: string; message: string }> = [];

	// Initialize highlighter
	const highlighter = await getHighlighter(themes);

	// Load any additional languages needed
	const requiredLangs = new Set(steps.map((s) => s.lang));
	const loadedLangs = new Set(highlighter.getLoadedLanguages());

	for (const lang of requiredLangs) {
		if (!loadedLangs.has(lang)) {
			try {
				await highlighter.loadLanguage(lang as BundledLanguage);
			} catch (e) {
				errors.push({
					stepId: `lang:${lang}`,
					message: `Failed to load language '${lang}': ${e instanceof Error ? e.message : String(e)}`,
				});
			}
		}
	}

	// Compile steps for both themes in parallel
	const [stepsLight, stepsDark] = await Promise.all([
		Promise.all(
			steps.map((step, index) =>
				compileStep(highlighter, step, index, themes.light, {
					lineNumbers: options.lineNumbers,
				}).catch((e) => {
					errors.push({
						stepId: step.id,
						message: `Light theme compilation failed: ${e instanceof Error ? e.message : String(e)}`,
					});
					// Return fallback with empty tokens
					return {
						index,
						id: step.id,
						tokens: null as unknown as KeyedTokensInfo,
						theme: themes.light,
						lang: step.lang,
					};
				})
			)
		),
		Promise.all(
			steps.map((step, index) =>
				compileStep(highlighter, step, index, themes.dark, {
					lineNumbers: options.lineNumbers,
				}).catch((e) => {
					errors.push({
						stepId: step.id,
						message: `Dark theme compilation failed: ${e instanceof Error ? e.message : String(e)}`,
					});
					// Return fallback with empty tokens
					return {
						index,
						id: step.id,
						tokens: null as unknown as KeyedTokensInfo,
						theme: themes.dark,
						lang: step.lang,
					};
				})
			)
		),
	]);

	// Default to dark theme for main steps (can be switched client-side)
	return {
		steps: stepsDark,
		stepsLight,
		stepsDark,
		errors,
	};
}

