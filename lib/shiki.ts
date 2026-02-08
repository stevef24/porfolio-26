/**
 * Shiki syntax highlighter with dual-theme support and transformers
 *
 * Features:
 * - Dual-theme (light + dark) with instant CSS switching
 * - Diff notation: // [!code ++] and // [!code --]
 * - Highlight notation: // [!code highlight]
 * - Focus notation: // [!code focus]
 * - Line numbers via data-line attribute
 */

import { codeToHtml, type BundledLanguage, type BundledTheme } from "shiki";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
} from "@shikijs/transformers";

export interface HighlightOptions {
  code: string;
  lang: string;
  focusLines?: number[];
}

/**
 * Highlight code with dual themes and transformer support.
 *
 * Returns HTML with:
 * - Dual theme tokens (CSS-based switching)
 * - `data-line` attribute on each line (1-indexed)
 * - `data-focus` on focused lines (from focusLines array)
 * - `.diff.add` / `.diff.remove` classes (from // [!code ++] / // [!code --])
 * - `.highlighted` class (from // [!code highlight])
 * - `.focused` class (from // [!code focus])
 *
 * Notation is automatically removed from the rendered output.
 */
export async function highlightCode(options: HighlightOptions): Promise<string> {
  const { code, lang, focusLines = [] } = options;

  const shikiLang = normalizeLanguage(lang);

  const html = await codeToHtml(code, {
    lang: shikiLang as BundledLanguage,
    themes: {
      light: "github-light" as BundledTheme,
      dark: "github-dark" as BundledTheme,
    },
    defaultColor: false,
    transformers: [
      // Process // [!code ++] and // [!code --] notation
      transformerNotationDiff(),
      // Process // [!code highlight] notation
      transformerNotationHighlight(),
      // Process // [!code focus] notation
      transformerNotationFocus(),
      // Custom: Add line numbers and focus from focusLines array
      {
        line(node, line) {
          node.properties["data-line"] = line;
          if (focusLines.includes(line)) {
            node.properties["data-focus"] = "true";
          }
        },
      },
    ],
  });

  return html;
}

/**
 * Normalize language identifier for Shiki compatibility
 */
function normalizeLanguage(lang: string): string {
  const langMap: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    sh: "bash",
    shell: "bash",
    yml: "yaml",
    py: "python",
  };

  return langMap[lang.toLowerCase()] || lang.toLowerCase();
}

export type { BundledLanguage, BundledTheme };
