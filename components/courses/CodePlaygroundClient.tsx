"use client";

import * as React from "react";
import {
	SandpackCodeEditor,
	SandpackLayout,
	SandpackPreview,
	SandpackProvider,
	useSandpack,
	useSandpackNavigation,
	type SandpackFiles,
	type SandpackPredefinedTemplate,
	type SandpackTheme,
} from "@codesandbox/sandpack-react";
import { githubLight, sandpackDark } from "@codesandbox/sandpack-themes";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Refresh01Icon,
	ArrowExpandDiagonal01Icon,
	HashtagIcon,
	RotateLeft01Icon,
} from "@hugeicons/core-free-icons";

// ==========================================
// TYPES
// ==========================================

type PlaygroundTemplate = SandpackPredefinedTemplate | "nextjs-ts";

export interface CodePlaygroundProps {
	template?: PlaygroundTemplate;
	files?: SandpackFiles;
	showPreview?: boolean;
	showTabs?: boolean;
	showHeader?: boolean;
	title?: string;
	className?: string;
}

// ==========================================
// CONSTANTS
// ==========================================

const DEFAULT_TEMPLATE: SandpackPredefinedTemplate = "react";
const DEFAULT_HEIGHT = "420px";
const FULLSCREEN_HEIGHT = "100vh";

const NEXT_TS_FILES: SandpackFiles = {
	"/pages/_app.tsx": `import "../styles.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
`,
	"/pages/index.tsx": `type HomeProps = {
  data: string;
};

export default function Home({ data }: HomeProps) {
  return (
    <main>
      <h1>Hello {data}</h1>
    </main>
  );
}

export function getServerSideProps() {
  return {
    props: { data: "world" },
  };
}
`,
	"/tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2019",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  }
}
`,
};

const NEXT_TS_SETUP = {
	dependencies: {
		typescript: "^5.5.4",
		"@types/react": "^18.3.1",
		"@types/react-dom": "^18.3.0",
		"@types/node": "^20.12.7",
	},
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const resolveTemplate = (
	template?: PlaygroundTemplate
): SandpackPredefinedTemplate => {
	if (!template) return DEFAULT_TEMPLATE;
	if (template === "nextjs-ts") return "nextjs";
	return template;
};

const createSwissTheme = (
	baseTheme: SandpackTheme,
	mode: "light" | "dark"
): SandpackTheme => {
	if (mode === "dark") {
		return {
			...baseTheme,
			colors: {
				...baseTheme.colors,
				surface1: "oklch(0.145 0 0)",
				surface2: "oklch(0.205 0 0)",
				surface3: "oklch(0.274 0.006 286.033)",
				clickable: "oklch(0.985 0 0)",
				base: "oklch(0.985 0 0)",
				disabled: "oklch(0.708 0 0)",
				hover: "oklch(0.985 0 0)",
				accent: "oklch(0.77 0.20 131)",
				error: "oklch(0.704 0.191 22.216)",
				errorSurface: "oklch(0.27 0.07 132)",
			},
			syntax: {
				...baseTheme.syntax,
				plain: "oklch(0.985 0 0)",
				comment: { color: "oklch(0.708 0 0)", fontStyle: "italic" },
				keyword: "oklch(0.77 0.20 131)",
				tag: "oklch(0.85 0.21 129)",
				punctuation: "oklch(0.708 0 0)",
				definition: "oklch(0.85 0.21 129)",
				property: "oklch(0.985 0 0)",
				static: "oklch(0.708 0 0)",
				string: "oklch(0.77 0.20 131)",
			},
			font: {
				...baseTheme.font,
				body: "var(--font-sans)",
				mono: "var(--font-mono)",
				size: "16px",
				lineHeight: "24px",
			},
		};
	}

	return {
		...baseTheme,
		colors: {
			...baseTheme.colors,
			surface1: "oklch(1 0 0)",
			surface2: "oklch(0.97 0 0)",
			surface3: "oklch(0.922 0 0)",
			clickable: "oklch(0.21 0.006 285.885)",
			base: "oklch(0.145 0 0)",
			disabled: "oklch(0.708 0 0)",
			hover: "oklch(0.145 0 0)",
			accent: "oklch(0.65 0.18 132)",
			error: "oklch(0.58 0.22 27)",
			errorSurface: "oklch(0.97 0 0)",
		},
		syntax: {
			...baseTheme.syntax,
			plain: "oklch(0.145 0 0)",
			comment: { color: "oklch(0.556 0 0)", fontStyle: "italic" },
			keyword: "oklch(0.53 0.14 132)",
			tag: "oklch(0.65 0.18 132)",
			punctuation: "oklch(0.556 0 0)",
			definition: "oklch(0.65 0.18 132)",
			property: "oklch(0.21 0.006 285.885)",
			static: "oklch(0.21 0.006 285.885)",
			string: "oklch(0.65 0.18 132)",
		},
		font: {
			...baseTheme.font,
			body: "var(--font-sans)",
			mono: "var(--font-mono)",
			size: "16px",
			lineHeight: "24px",
		},
	};
};

const resolvePrettierParser = (filePath: string) => {
	const extension = filePath.split(".").pop()?.toLowerCase();
	if (!extension) return null;

	if (["ts", "tsx"].includes(extension)) return "typescript";
	if (["js", "jsx", "cjs", "mjs"].includes(extension)) return "babel";
	if (["css", "scss", "less"].includes(extension)) return "css";
	if (extension === "html") return "html";
	if (extension === "json") return "json";

	return null;
};

const loadPrettierPlugins = async (parser: string) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const plugins: Array<any> = [];
	if (parser === "babel" || parser === "json") {
		const [{ default: babel }, { default: estree }] = await Promise.all([
			import("prettier/plugins/babel"),
			import("prettier/plugins/estree"),
		]);
		plugins.push(babel, estree);
	}

	if (parser === "typescript") {
		const [{ default: typescript }, { default: estree }] = await Promise.all([
			import("prettier/plugins/typescript"),
			import("prettier/plugins/estree"),
		]);
		plugins.push(typescript, estree);
	}

	if (parser === "html") {
		const { default: html } = await import("prettier/plugins/html");
		plugins.push(html);
	}

	if (parser === "css") {
		const { default: postcss } = await import("prettier/plugins/postcss");
		plugins.push(postcss);
	}

	return plugins;
};

// ==========================================
// PLAYGROUND HEADER COMPONENT
// ==========================================

interface PlaygroundHeaderProps {
	title: string;
	showLineNumbers: boolean;
	onToggleLineNumbers: () => void;
	onReset: () => void;
	onRefresh: () => void;
	onToggleFullscreen: () => void;
	isFullscreen: boolean;
}

function PlaygroundHeader({
	title,
	showLineNumbers,
	onToggleLineNumbers,
	onReset,
	onRefresh,
	onToggleFullscreen,
	isFullscreen,
}: PlaygroundHeaderProps) {
	return (
		<div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
			{/* Title */}
			<span className="text-sm font-medium text-foreground">{title}</span>

			{/* Action buttons */}
			<div className="flex items-center gap-0.5">
				{/* Reset Code */}
				<button
					type="button"
					onClick={onReset}
					className={cn(
						"p-1.5 rounded transition-colors cursor-pointer",
						"text-muted-foreground hover:text-foreground hover:bg-muted",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
					)}
					title="Reset code"
					aria-label="Reset code to initial state"
				>
					<HugeiconsIcon icon={RotateLeft01Icon} size={14} />
				</button>

				{/* Toggle Line Numbers */}
				<button
					type="button"
					onClick={onToggleLineNumbers}
					className={cn(
						"p-1.5 rounded transition-colors cursor-pointer",
						showLineNumbers
							? "text-foreground bg-muted"
							: "text-muted-foreground hover:text-foreground hover:bg-muted",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
					)}
					title="Toggle line numbers"
					aria-label="Toggle line numbers"
					aria-pressed={showLineNumbers}
				>
					<HugeiconsIcon icon={HashtagIcon} size={14} />
				</button>

				{/* Toggle Fullscreen */}
				<button
					type="button"
					onClick={onToggleFullscreen}
					className={cn(
						"p-1.5 rounded transition-colors cursor-pointer",
						isFullscreen
							? "text-foreground bg-muted"
							: "text-muted-foreground hover:text-foreground hover:bg-muted",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
					)}
					title="Toggle fullscreen"
					aria-label="Toggle fullscreen mode"
					aria-pressed={isFullscreen}
				>
					<HugeiconsIcon icon={ArrowExpandDiagonal01Icon} size={14} />
				</button>

				{/* Refresh Preview */}
				<button
					type="button"
					onClick={onRefresh}
					className={cn(
						"p-1.5 rounded transition-colors cursor-pointer",
						"text-muted-foreground hover:text-foreground hover:bg-muted",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
					)}
					title="Refresh preview"
					aria-label="Refresh preview"
				>
					<HugeiconsIcon icon={Refresh01Icon} size={14} />
				</button>
			</div>
		</div>
	);
}

// ==========================================
// FORMAT ON SAVE COMPONENT
// ==========================================

const FormatOnSave = ({
	containerRef,
}: {
	containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
	const { sandpack } = useSandpack();

	const formatActiveFile = React.useCallback(async () => {
		const activeFile = sandpack.activeFile;
		const file = sandpack.files[activeFile];
		const code = typeof file?.code === "string" ? file.code : "";
		const parser = resolvePrettierParser(activeFile);
		if (!parser || !code) return;

		try {
			const prettier = (await import("prettier/standalone")).default;
			const plugins = await loadPrettierPlugins(parser);
			const formatted = await prettier.format(code, {
				parser,
				plugins,
				semi: true,
				singleQuote: true,
				trailingComma: "es5",
				printWidth: 80,
			});
			sandpack.updateFile(activeFile, formatted, true);
		} catch (error) {
			console.error("Code formatting failed:", error);
		}
	}, [sandpack]);

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const isSave =
				(event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s";
			if (!isSave) return;

			const target = event.target as HTMLElement | null;
			if (!target || !containerRef.current?.contains(target)) return;

			event.preventDefault();
			void formatActiveFile();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [containerRef, formatActiveFile]);

	return null;
};

// ==========================================
// PLAYGROUND INNER COMPONENT
// ==========================================

function PlaygroundInner({
	showPreview,
	showTabs,
	showHeader,
	title,
}: {
	showPreview: boolean;
	showTabs: boolean;
	showHeader: boolean;
	title: string;
}) {
	const { sandpack } = useSandpack();
	const { refresh } = useSandpackNavigation();
	const prefersReducedMotion = useReducedMotion();
	const containerRef = React.useRef<HTMLDivElement>(null);

	const [editorWidth, setEditorWidth] = React.useState(55);
	const [isResizing, setIsResizing] = React.useState(false);
	const [showLineNumbers, setShowLineNumbers] = React.useState(false);
	const [isFullscreen, setIsFullscreen] = React.useState(false);

	// Action handlers
	const handleReset = React.useCallback(() => {
		sandpack.resetAllFiles();
	}, [sandpack]);

	const handleRefresh = React.useCallback(() => {
		refresh();
	}, [refresh]);

	const handleToggleLineNumbers = React.useCallback(() => {
		setShowLineNumbers((prev) => !prev);
	}, []);

	const handleToggleFullscreen = React.useCallback(async () => {
		if (!containerRef.current) return;

		try {
			if (!document.fullscreenElement) {
				await containerRef.current.requestFullscreen();
				setIsFullscreen(true);
			} else {
				await document.exitFullscreen();
				setIsFullscreen(false);
			}
		} catch (error) {
			console.error("Fullscreen error:", error);
		}
	}, []);

	// Listen for fullscreen changes (e.g., Esc key)
	React.useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, []);

	// Resize logic
	const startResizing = React.useCallback(
		(event: React.PointerEvent<HTMLButtonElement>) => {
			if (!showPreview || !containerRef.current) return;

			event.preventDefault();
			const container = containerRef.current;
			const rect = container.getBoundingClientRect();
			setIsResizing(true);
			document.body.style.cursor = "col-resize";

			const handlePointerMove = (moveEvent: PointerEvent) => {
				const next = ((moveEvent.clientX - rect.left) / rect.width) * 100;
				const bounded = Math.min(75, Math.max(25, next));
				setEditorWidth(bounded);
			};

			const stopResize = () => {
				setIsResizing(false);
				document.body.style.cursor = "";
				window.removeEventListener("pointermove", handlePointerMove);
				window.removeEventListener("pointerup", stopResize);
			};

			window.addEventListener("pointermove", handlePointerMove);
			window.addEventListener("pointerup", stopResize);
		},
		[showPreview]
	);

	const currentHeight = isFullscreen ? FULLSCREEN_HEIGHT : DEFAULT_HEIGHT;

	const editorStyle: React.CSSProperties = {
		height: currentHeight,
		flexGrow: showPreview ? editorWidth : 100,
		flexShrink: showPreview ? editorWidth : 100,
		flexBasis: 0,
	};

	const previewStyle: React.CSSProperties = {
		height: currentHeight,
		flexGrow: 100 - editorWidth,
		flexShrink: 100 - editorWidth,
		flexBasis: 0,
	};

	return (
		<div
			ref={containerRef}
			className={cn(
				"code-playground rounded-lg border border-border overflow-hidden bg-background",
				isFullscreen && "fixed inset-0 z-50 rounded-none"
			)}
		>
			{/* Header Toolbar */}
			{showHeader && (
				<PlaygroundHeader
					title={title}
					showLineNumbers={showLineNumbers}
					onToggleLineNumbers={handleToggleLineNumbers}
					onReset={handleReset}
					onRefresh={handleRefresh}
					onToggleFullscreen={handleToggleFullscreen}
					isFullscreen={isFullscreen}
				/>
			)}

			{/* Sandpack Layout */}
			<SandpackLayout className="code-playground__layout">
				<SandpackCodeEditor
					showTabs={showTabs}
					showLineNumbers={showLineNumbers}
					showInlineErrors
					wrapContent
					style={editorStyle}
					className={cn(
						"code-playground__editor",
						prefersReducedMotion ? "" : "transition-[flex-grow]"
					)}
				/>
				{showPreview && (
					<>
						<button
							type="button"
							onPointerDown={startResizing}
							role="separator"
							aria-label="Resize code editor"
							aria-orientation="vertical"
							aria-valuemin={25}
							aria-valuemax={75}
							aria-valuenow={Math.round(editorWidth)}
							className={cn(
								"code-playground__resize-handle",
								isResizing && "is-resizing"
							)}
						/>
						<SandpackPreview
							showNavigator={false}
							showOpenInCodeSandbox={false}
							showRefreshButton={false}
							showRestartButton={false}
							showOpenNewtab={false}
							style={previewStyle}
							className={cn(
								"code-playground__preview",
								prefersReducedMotion ? "" : "transition-[flex-grow]"
							)}
						/>
					</>
				)}
			</SandpackLayout>

			<FormatOnSave containerRef={containerRef} />
		</div>
	);
}

// ==========================================
// MAIN COMPONENT
// ==========================================

const CodePlaygroundClient = ({
	template,
	files,
	showPreview = true,
	showTabs = true,
	showHeader = true,
	title = "Code Playground",
	className,
}: CodePlaygroundProps) => {
	const { resolvedTheme } = useTheme();
	const prefersReducedMotion = useReducedMotion();

	const resolvedTemplate = resolveTemplate(template);
	const resolvedFiles =
		template === "nextjs-ts" ? { ...NEXT_TS_FILES, ...(files ?? {}) } : files;
	const customSetup = template === "nextjs-ts" ? NEXT_TS_SETUP : undefined;

	const theme = React.useMemo(() => {
		const mode = resolvedTheme === "dark" ? "dark" : "light";
		const baseTheme = mode === "dark" ? sandpackDark : githubLight;
		return createSwissTheme(baseTheme, mode);
	}, [resolvedTheme]);

	return (
		<motion.div
			className={className}
			style={{ "--sp-border-radius": "0" } as React.CSSProperties}
			initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: prefersReducedMotion ? 0 : 0.2,
				ease: "easeOut",
			}}
		>
			<SandpackProvider
				template={resolvedTemplate}
				files={resolvedFiles}
				customSetup={customSetup}
				theme={theme}
				options={{
					initMode: "lazy",
					recompileMode: "delayed",
					recompileDelay: 300,
				}}
			>
				<PlaygroundInner
					showPreview={showPreview}
					showTabs={showTabs}
					showHeader={showHeader}
					title={title}
				/>
			</SandpackProvider>
		</motion.div>
	);
};

export default CodePlaygroundClient;
