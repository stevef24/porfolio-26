/**
 * Scrolly Coding Type Definitions
 *
 * Typed API for scrollytelling code walkthroughs.
 * Designed for MDX authoring with incremental code changes.
 */

import type { ReactNode } from "react";

/**
 * A single step in a scrolly code walkthrough.
 *
 * @example
 * ```tsx
 * const step: ScrollyCodeStep = {
 *   id: "create-state",
 *   title: "Create state",
 *   body: <p>Start with a tiny state shape.</p>,
 *   code: `type State = { count: number }`,
 *   lang: "ts",
 *   file: "state.ts",
 *   focusLines: [1],
 * }
 * ```
 */
export type ScrollyCodeStep = {
	/** Unique identifier (kebab-case, stable across drafts) */
	id: string;
	/** Step title displayed above the body */
	title: string;
	/** Prose content - paragraphs, lists, inline code */
	body: ReactNode;
	/** Code string for this step */
	code: string;
	/** Shiki language identifier (e.g., "ts", "tsx", "css") */
	lang: string;
	/** Optional filename displayed in stage badge */
	file?: string;
	/** 1-based line numbers to highlight (must match code string) */
	focusLines?: number[];
	/** Optional annotations on specific lines */
	annotations?: Array<{
		/** 1-based line number */
		line: number;
		/** Annotation label text */
		label: string;
	}>;
	/** Optional Magic Move overrides for this step */
	magicMove?: {
		/** Transition duration in ms (default: 800) */
		duration?: number;
		/** Stagger delay between tokens in ms (default: 4) */
		stagger?: number;
		/** Show line numbers (default: true) */
		lineNumbers?: boolean;
	};
};

/**
 * Document-level configuration for a scrolly code post.
 */
export type ScrollyCodeDoc = {
	/** Array of steps in order */
	steps: ScrollyCodeStep[];
	/** Theme pair for syntax highlighting */
	theme?: {
		/** Light theme name (default: "vitesse-light") */
		light: string;
		/** Dark theme name (default: "vitesse-dark") */
		dark: string;
	};
	/** Stage container configuration */
	stage?: {
		/** Stage width (default: "100%") */
		width?: string;
		/** Sticky top offset in px (default: 80) */
		stickyTop?: number;
		/** Stage height (default: "auto") */
		height?: string;
	};
};

/**
 * Compiled step with precompiled Shiki Magic Move tokens.
 * Used for client-side rendering without server-side highlighting.
 */
export type CompiledScrollyStep = Omit<ScrollyCodeStep, "code"> & {
	/** Original code string (for fallback rendering) */
	code: string;
	/** Precompiled Magic Move tokens */
	tokens: unknown;
};

/**
 * Props for the main ScrollyCoding component.
 */
export type ScrollyCodingProps = {
	/** Original steps with code strings */
	steps: ScrollyCodeStep[];
	/** Server-compiled Magic Move steps */
	compiledSteps: unknown[];
	/** Document configuration */
	doc?: Omit<ScrollyCodeDoc, "steps">;
	/** Additional CSS classes */
	className?: string;
};

/**
 * Context value for scrolly state management.
 */
export type ScrollyContextValue = {
	/** Currently active step index */
	activeIndex: number;
	/** Set active step index */
	setActiveIndex: (index: number) => void;
	/** Total number of steps */
	totalSteps: number;
	/** Scroll progress within current step (0-1) */
	progress?: number;
};

/**
 * Default configuration values.
 */
export const SCROLLY_DEFAULTS = {
	theme: {
		light: "vitesse-light",
		dark: "vitesse-dark",
	},
	stage: {
		stickyTop: 80,
		width: "100%",
		height: "auto",
	},
	magicMove: {
		duration: 800,
		stagger: 4,
		lineNumbers: true,
	},
	/** Root margin for active step detection */
	inViewMargin: "-45% 0px -45% 0px",
} as const;

/**
 * Validation helpers for authoring.
 */
export const validateStep = (step: ScrollyCodeStep): string[] => {
	const errors: string[] = [];

	// Check required fields
	if (!step.id) errors.push("Step missing required 'id' field");
	if (!step.title) errors.push("Step missing required 'title' field");
	if (!step.code) errors.push("Step missing required 'code' field");
	if (!step.lang) errors.push("Step missing required 'lang' field");

	// Check id format
	if (step.id && !/^[a-z0-9-]+$/.test(step.id)) {
		errors.push(`Step id '${step.id}' must be kebab-case`);
	}

	// Check focusLines bounds
	if (step.focusLines && step.code) {
		const lineCount = step.code.split("\n").length;
		for (const line of step.focusLines) {
			if (line < 1 || line > lineCount) {
				errors.push(
					`focusLine ${line} is out of bounds (code has ${lineCount} lines)`
				);
			}
		}
	}

	// Check annotations bounds
	if (step.annotations && step.code) {
		const lineCount = step.code.split("\n").length;
		for (const annotation of step.annotations) {
			if (annotation.line < 1 || annotation.line > lineCount) {
				errors.push(
					`Annotation line ${annotation.line} is out of bounds (code has ${lineCount} lines)`
				);
			}
		}
	}

	return errors;
};

/**
 * Validate all steps in a document.
 */
export const validateSteps = (steps: ScrollyCodeStep[]): string[] => {
	const errors: string[] = [];

	// Check for unique ids
	const ids = new Set<string>();
	for (const step of steps) {
		if (ids.has(step.id)) {
			errors.push(`Duplicate step id: '${step.id}'`);
		}
		ids.add(step.id);

		// Validate individual step
		errors.push(...validateStep(step));
	}

	return errors;
};

/**
 * Helper to derive filename from language if not provided.
 */
export const deriveFilename = (step: ScrollyCodeStep): string => {
	if (step.file) return step.file;

	const extMap: Record<string, string> = {
		ts: "ts",
		tsx: "tsx",
		js: "js",
		jsx: "jsx",
		css: "css",
		html: "html",
		json: "json",
		yaml: "yaml",
		yml: "yml",
		md: "md",
		mdx: "mdx",
		py: "py",
		rust: "rs",
		go: "go",
		sql: "sql",
		sh: "sh",
		bash: "sh",
		zsh: "sh",
	};

	const ext = extMap[step.lang] || step.lang;
	return `snippet.${ext}`;
};
