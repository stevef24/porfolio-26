/**
 * Server-side code step compilation with Shiki Magic Move
 *
 * Compiles raw code steps into precompiled Magic Move tokens for animated
 * code transitions. Uses Shiki's dual-theme feature for instant CSS-based
 * theme switching.
 *
 * This runs at build time / request time on the server.
 */

import "server-only";
import { createHighlighter, type HighlighterGeneric, type BundledLanguage, type BundledTheme } from "shiki";
import { codeToKeyedTokens } from "shiki-magic-move/core";
import type { CodeStep, CompiledCodeStep } from "@/types/code-steps";

// Re-export types and constants for consumers
export { MAGIC_MOVE_DEFAULTS } from "@/types/code-steps";
export type {
  CodeFile,
  CompiledCodeFile,
  CodeStep,
  CompiledCodeStep,
  AnyCodeStep,
  KeyedTokensInfo,
} from "@/types/code-steps";

/**
 * Theme defaults for Shiki highlighter
 */
const THEME_DEFAULTS = {
  light: "github-light" as BundledTheme,
  dark: "github-dark" as BundledTheme,
};

/**
 * Default languages to load in the highlighter.
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
 * Cached highlighter instance (per-process singleton).
 */
let highlighterPromise: Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> | null = null;

async function getHighlighter(): Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME_DEFAULTS.light, THEME_DEFAULTS.dark],
      langs: DEFAULT_LANGUAGES,
    });
  }
  return highlighterPromise;
}

/**
 * Compile an array of code steps with Shiki Magic Move tokens.
 *
 * Each step's code is transformed into keyed tokens with:
 * - Dual-theme support (light + dark via CSS variables)
 * - Stable token keys for smooth morphing animations
 * - Original code preserved for clipboard operations
 *
 * Handles both single-file and multi-file step formats.
 */
export async function compileCodeSteps(
  steps: CodeStep[]
): Promise<CompiledCodeStep[]> {
  const highlighter = await getHighlighter();

  // Load any additional languages needed
  const requiredLangs = new Set(steps.map((s) => s.lang));
  const loadedLangs = new Set(highlighter.getLoadedLanguages());

  for (const lang of requiredLangs) {
    if (!loadedLangs.has(lang)) {
      try {
        await highlighter.loadLanguage(lang as BundledLanguage);
      } catch (e) {
        console.warn(`Failed to load language '${lang}':`, e);
      }
    }
  }

  const compiled = await Promise.all(
    steps.map(async (step) => {
      // Multi-file mode
      if (step.files && step.files.length > 0) {
        const compiledFiles = await Promise.all(
          step.files.map(async (file) => {
            const fileLang = (file.lang || step.lang) as BundledLanguage;
            const tokens = codeToKeyedTokens(highlighter, file.code, {
              lang: fileLang,
              themes: {
                light: THEME_DEFAULTS.light,
                dark: THEME_DEFAULTS.dark,
              },
            });
            return {
              name: file.name,
              tokens,
              rawCode: file.code,
              lang: fileLang,
              focusLines: file.focusLines,
            };
          })
        );

        return {
          id: step.id,
          title: step.title,
          lang: step.lang,
          files: compiledFiles,
        };
      }

      // Single-file mode (backward compatible)
      const code = step.code || "";
      const tokens = codeToKeyedTokens(highlighter, code, {
        lang: step.lang as BundledLanguage,
        themes: {
          light: THEME_DEFAULTS.light,
          dark: THEME_DEFAULTS.dark,
        },
      });

      return {
        id: step.id,
        title: step.title,
        tokens,
        rawCode: code,
        lang: step.lang,
        file: step.file,
        focusLines: step.focusLines,
      };
    })
  );

  return compiled;
}

/**
 * Type guard to check if a step is compiled (has tokens)
 */
export function isCompiledStep(
  step: CodeStep | CompiledCodeStep
): step is CompiledCodeStep {
  return "tokens" in step || ("files" in step && Array.isArray(step.files) && step.files.length > 0 && "tokens" in step.files[0]);
}
