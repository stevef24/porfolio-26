/**
 * Code Step Types
 *
 * Shared type definitions for the Magic Move code animation system.
 * These types are used by both server-side compilation and client-side rendering.
 */

import type { KeyedTokensInfo } from "shiki-magic-move/types";

/**
 * Animation defaults for Magic Move transitions
 * Single source of truth for consistent animation timing
 */
export const MAGIC_MOVE_DEFAULTS = {
  duration: 300,
  stagger: 1.5,
} as const;

/**
 * Single file within a code step
 */
export interface CodeFile {
  name: string;
  code: string;
  lang?: string;
  focusLines?: number[];
}

/**
 * Compiled file with Magic Move tokens
 */
export interface CompiledCodeFile {
  name: string;
  tokens: KeyedTokensInfo;
  rawCode: string;
  lang: string;
  focusLines?: number[];
}

/**
 * Raw code step definition (before compilation)
 * Supports both single-file (code/file) and multi-file (files[]) modes
 */
export interface CodeStep {
  id: string;
  title: string;
  /** Single file code (use this OR files[], not both) */
  code?: string;
  lang: string;
  /** Single file name */
  file?: string;
  /** Focus lines for single-file mode */
  focusLines?: number[];
  /** Multi-file mode: array of files */
  files?: CodeFile[];
}

/**
 * Compiled code step with Magic Move tokens
 * Supports both single-file and multi-file modes
 */
export interface CompiledCodeStep {
  id: string;
  title: string;
  lang: string;
  /** Single-file mode: Magic Move tokens */
  tokens?: KeyedTokensInfo;
  /** Single-file mode: original code for clipboard */
  rawCode?: string;
  /** Single-file mode: file name */
  file?: string;
  /** Single-file mode: focus lines */
  focusLines?: number[];
  /** Multi-file mode: compiled files array */
  files?: CompiledCodeFile[];
}

/**
 * Union type for either raw or compiled code steps
 */
export type AnyCodeStep = CodeStep | CompiledCodeStep;

/**
 * Global file tracking for multi-step navigation
 */
export interface GlobalFile {
  name: string;
  stepIndices: number[];
  isActiveInStep: boolean;
}

// Re-export token type for consumers
export type { KeyedTokensInfo };

/**
 * Deduplicate token keys to prevent React key conflicts.
 * Magic Move sometimes generates duplicate keys which causes rendering issues.
 */
export function dedupeTokenKeys(tokensInfo: KeyedTokensInfo): KeyedTokensInfo {
  const seen = new Map<string, number>();
  let hasDuplicates = false;

  const dedupedTokens = tokensInfo.tokens.map((token) => {
    const count = seen.get(token.key) ?? 0;
    seen.set(token.key, count + 1);

    if (count === 0) return token;

    hasDuplicates = true;
    return { ...token, key: `${token.key}-${count}` };
  });

  return hasDuplicates ? { ...tokensInfo, tokens: dedupedTokens } : tokensInfo;
}
