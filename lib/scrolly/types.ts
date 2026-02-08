/**
 * Scrolly Coding Type Definitions
 *
 * Typed API for scrollytelling code walkthroughs.
 * Supports multiple content types: code, playground, images, iframes, and custom components.
 * Designed for MDX authoring with incremental content transitions.
 */

import type { ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Stage Content Types - Discriminated Union
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Code stage content - syntax highlighted with Shiki Magic Move.
 */
export type StageCodeContent = {
	type: "code";
	/** Code string for this step */
	code: string;
	/** Shiki language identifier (e.g., "ts", "tsx", "css") */
	lang: string;
	/** 1-based line numbers to highlight */
	focusLines?: number[];
	/** Optional filename displayed in stage badge */
	file?: string;
	/** Optional annotations on specific lines */
	annotations?: Array<{
		line: number;
		label: string;
	}>;
};

/**
 * Playground stage content - live code editor with Sandpack.
 */
export type StagePlaygroundContent = {
	type: "playground";
	/** Files keyed by filename (e.g., "/App.tsx": "code...") */
	files: Record<string, string>;
	/** Sandpack template preset */
	template?: "react" | "react-ts" | "vue" | "vanilla" | "vanilla-ts";
	/** Show live preview panel (default: true) */
	showPreview?: boolean;
	/** Entry file path (default: "/App.tsx" for React) */
	entry?: string;
};

/**
 * Single image stage content.
 */
export type StageImageContent = {
	type: "image";
	/** Image source URL */
	src: string;
	/** Alt text for accessibility */
	alt?: string;
	/** Optional caption below image */
	caption?: string;
};

/**
 * Multiple images stage content - grid or carousel.
 */
export type StageImagesContent = {
	type: "images";
	/** Array of image items */
	items: Array<{
		src: string;
		alt?: string;
	}>;
	/** Layout mode */
	layout?: "grid" | "carousel";
	/** Grid columns (for grid layout) */
	columns?: 2 | 3 | 4;
};

/**
 * Iframe stage content - embedded external content.
 */
export type StageIframeContent = {
	type: "iframe";
	/** Iframe source URL */
	src: string;
	/** Accessibility title */
	title?: string;
	/** Iframe sandbox permissions */
	sandbox?: string;
	/** Aspect ratio (e.g., "16/9", "4/3") */
	aspectRatio?: string;
};

/**
 * Custom stage content - render arbitrary React components.
 */
export type StageCustomContent = {
	type: "custom";
	/** React component to render */
	component: ReactNode;
};

/**
 * Union of all stage content types.
 * Use discriminated union pattern for type narrowing.
 *
 * @example
 * ```tsx
 * switch (content.type) {
 *   case "code":
 *     // TypeScript knows content.code exists
 *     break;
 *   case "playground":
 *     // TypeScript knows content.files exists
 *     break;
 * }
 * ```
 */
export type StageContentType =
	| StageCodeContent
	| StagePlaygroundContent
	| StageImageContent
	| StageImagesContent
	| StageIframeContent
	| StageCustomContent;

// ─────────────────────────────────────────────────────────────────────────────
// Extended ScrollyStep (supports all content types)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extended step with flexible stage content.
 * Use this for mixed-content scrollytelling (code, images, playgrounds).
 *
 * @example
 * ```tsx
 * const steps: ScrollyStep[] = [
 *   {
 *     id: "intro",
 *     title: "Introduction",
 *     body: <p>Let's build something.</p>,
 *     stage: { type: "image", src: "/overview.png", alt: "Architecture" },
 *   },
 *   {
 *     id: "code",
 *     title: "The Code",
 *     body: <p>Here's how it works.</p>,
 *     stage: { type: "code", code: "const x = 1", lang: "ts" },
 *   },
 * ];
 * ```
 */
export type ScrollyStep = {
	/** Unique identifier (kebab-case, stable across drafts) */
	id: string;
	/** Step title displayed above the body */
	title: string;
	/** Prose content - paragraphs, lists, inline code */
	body: ReactNode;
	/** Stage content to display */
	stage: StageContentType;
	/** Optional Magic Move overrides (only for code type) */
	magicMove?: {
		duration?: number;
		stagger?: number;
		lineNumbers?: boolean;
	};
};

// ─────────────────────────────────────────────────────────────────────────────
// Legacy ScrollyCodeStep (backward compatible)
// ─────────────────────────────────────────────────────────────────────────────

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
		/** Light theme name (default: "github-light") */
		light: string;
		/** Dark theme name (default: "github-dark") */
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
		light: "github-light",
		dark: "github-dark",
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

// ─────────────────────────────────────────────────────────────────────────────
// Type Guards & Converters
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Type guard: Check if stage content is code type.
 */
export const isCodeStage = (
	stage: StageContentType
): stage is StageCodeContent => {
	return stage.type === "code";
};

/**
 * Type guard: Check if stage content is playground type.
 */
export const isPlaygroundStage = (
	stage: StageContentType
): stage is StagePlaygroundContent => {
	return stage.type === "playground";
};

/**
 * Type guard: Check if stage content is image type.
 */
export const isImageStage = (
	stage: StageContentType
): stage is StageImageContent => {
	return stage.type === "image";
};

/**
 * Type guard: Check if stage content is images (gallery) type.
 */
export const isImagesStage = (
	stage: StageContentType
): stage is StageImagesContent => {
	return stage.type === "images";
};

/**
 * Type guard: Check if stage content is iframe type.
 */
export const isIframeStage = (
	stage: StageContentType
): stage is StageIframeContent => {
	return stage.type === "iframe";
};

/**
 * Type guard: Check if stage content is custom type.
 */
export const isCustomStage = (
	stage: StageContentType
): stage is StageCustomContent => {
	return stage.type === "custom";
};

/**
 * Convert legacy ScrollyCodeStep to new ScrollyStep format.
 * Use this to migrate existing code-only steps to the new type system.
 *
 * @example
 * ```tsx
 * const legacySteps: ScrollyCodeStep[] = [...];
 * const newSteps = legacySteps.map(codeStepToScrollyStep);
 * ```
 */
export const codeStepToScrollyStep = (step: ScrollyCodeStep): ScrollyStep => {
	return {
		id: step.id,
		title: step.title,
		body: step.body,
		stage: {
			type: "code",
			code: step.code,
			lang: step.lang,
			file: step.file,
			focusLines: step.focusLines,
			annotations: step.annotations,
		},
		magicMove: step.magicMove,
	};
};

/**
 * Extract code content from a ScrollyStep if it's a code stage.
 * Returns null for non-code stages.
 */
export const extractCodeContent = (
	step: ScrollyStep
): StageCodeContent | null => {
	return isCodeStage(step.stage) ? step.stage : null;
};

/**
 * Derive filename from stage content.
 * Works with both new ScrollyStep and legacy ScrollyCodeStep.
 */
export const deriveStageFilename = (stage: StageContentType): string => {
	if (!isCodeStage(stage)) {
		return "";
	}

	if (stage.file) return stage.file;

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

	const ext = extMap[stage.lang] || stage.lang;
	return `snippet.${ext}`;
};

/**
 * Check if a step has compilable code content.
 * Used by compile-steps.ts to determine if Shiki compilation is needed.
 */
export const hasCompilableCode = (step: ScrollyStep): boolean => {
	return isCodeStage(step.stage);
};
