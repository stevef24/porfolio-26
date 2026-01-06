import * as React from "react";
import type { ComponentPropsWithoutRef, ReactElement } from "react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Callout } from "fumadocs-ui/components/callout";
import { Banner } from "fumadocs-ui/components/banner";
import { File, Folder, Files } from "fumadocs-ui/components/files";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { Pre, CodeBlock } from "fumadocs-ui/components/codeblock";
import CompilerComparison from "@/components/ui/blog/react-compiler/compiler-comparison";
import FlowDiagram from "@/components/ui/blog/react-server-component/FlowDiagram";
import { AnimatedBlockquote } from "@/components/ui/blog/AnimatedBlockquote";
import StepCode from "@/components/ui/blog/StepCode";
import CodePlayground from "@/components/courses/CodePlayground";
import type { CodePlaygroundProps } from "@/components/courses/CodePlaygroundClient";
import { EmailCaptureForm } from "@/components/shared/EmailCaptureForm";
import { LinkPreview } from "@/components/ui/blog/LinkPreview";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { cn } from "@/lib/utils";

// Swiss-style minimal heading component without link icons
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type SwissHeadingProps<TTag extends HeadingTag> = {
	as: TTag;
} & ComponentPropsWithoutRef<TTag>;

function SwissHeading<TTag extends HeadingTag>({
	as: Tag,
	className,
	...props
}: SwissHeadingProps<TTag>) {
	const Component = Tag as React.ElementType;
	return (
		<Component
			className={cn(
				"scroll-mt-24",
				// Swiss typography - Cormorant Garamond for headings (larger scale for content)
				Tag === "h1" && "font-display text-4xl font-medium",
				Tag === "h2" && "font-display text-2xl font-medium",
				Tag === "h3" && "font-display text-xl font-medium",
				Tag === "h4" && "font-display text-lg font-medium",
				Tag === "h5" && "font-display text-base font-medium",
				Tag === "h6" && "font-display text-base font-medium",
				className
			)}
			{...props}
		/>
	);
}

type CodeBlockChildProps = {
	className?: string;
	children?: React.ReactNode;
	meta?: string;
	metastring?: string;
	"data-meta"?: string;
	"data-language"?: string;
};

const DefaultPre = defaultMdxComponents.pre;

const parseMetaValue = (value: string | undefined) => {
	if (!value) return { hasPlayground: false };
	const tokens = value.split(/\s+/).filter(Boolean);
	const hasPlayground = tokens.includes("playground");
	const options: {
		template?: string;
		file?: string;
		showPreview?: boolean;
		showTabs?: boolean;
	} = {};

	for (const token of tokens) {
		if (!token.includes("=")) continue;
		const [rawKey, rawValue] = token.split("=");
		const key = rawKey.trim().toLowerCase();
		const valueNormalized = rawValue?.trim();
		const booleanValue =
			valueNormalized === "true"
				? true
				: valueNormalized === "false"
				? false
				: undefined;

		if (key === "template") {
			options.template = valueNormalized;
		}
		if (key === "file") {
			options.file = valueNormalized;
		}
		if (key === "preview" && booleanValue !== undefined) {
			options.showPreview = booleanValue;
		}
		if (key === "tabs" && booleanValue !== undefined) {
			options.showTabs = booleanValue;
		}
	}

	return { hasPlayground, ...options };
};

const resolveLanguage = (
	codeElement: ReactElement<CodeBlockChildProps>
) => {
	const dataLanguage = codeElement.props["data-language"];
	if (typeof dataLanguage === "string" && dataLanguage.length > 0) {
		return dataLanguage;
	}

	const className = codeElement.props.className ?? "";
	const match = className.match(/language-([\w-]+)/i);
	return match?.[1];
};

const resolveTemplateFromLanguage = (language?: string) => {
	if (!language) return "react";
	const normalized = language.toLowerCase();
	if (normalized === "tsx" || normalized === "ts") return "react-ts";
	if (normalized === "jsx" || normalized === "js") return "react";
	if (normalized === "html" || normalized === "css") return "vanilla";
	return "react";
};

const resolveDefaultFile = (template: string, language?: string) => {
	if (template === "nextjs" || template === "nextjs-ts") {
		return language && language.startsWith("ts")
			? "/pages/index.tsx"
			: "/pages/index.js";
	}
	if (template === "react-ts") return "/App.tsx";
	if (template === "react") return "/App.js";
	if (template === "vanilla-ts") return "/index.ts";
	if (template === "vanilla") {
		if (language === "html") return "/index.html";
		if (language === "css") return "/styles.css";
		return "/index.js";
	}
	return "/App.js";
};

const resolveCodeString = (code: React.ReactNode) => {
	if (typeof code === "string") return code.trimEnd();
	if (Array.isArray(code)) {
		return code.map((item) => (typeof item === "string" ? item : "")).join("").trimEnd();
	}
	return "";
};

const PlaygroundPre = (props: ComponentPropsWithoutRef<"pre">) => {
	const child = Array.isArray(props.children)
		? props.children[0]
		: props.children;

	if (!React.isValidElement<CodeBlockChildProps>(child)) {
		return DefaultPre ? <DefaultPre {...props} /> : <pre {...props} />;
	}

	const metaValue =
		child.props.meta ||
		child.props.metastring ||
		child.props["data-meta"] ||
		(props as Record<string, unknown>)["data-meta"];

	const meta = typeof metaValue === "string" ? metaValue : undefined;
	const parsed = parseMetaValue(meta);

	if (!parsed.hasPlayground) {
		return DefaultPre ? <DefaultPre {...props} /> : <pre {...props} />;
	}

	const language = resolveLanguage(child);
	const template = parsed.template || resolveTemplateFromLanguage(language);
	const typedTemplate = template as CodePlaygroundProps["template"];
	const filePath = parsed.file || resolveDefaultFile(template, language);
	const code = resolveCodeString(child.props.children);

	return (
		<CodePlayground
			template={typedTemplate}
			files={{ [filePath]: code }}
			showPreview={parsed.showPreview ?? true}
			showTabs={parsed.showTabs ?? true}
			className="my-6"
		/>
	);
};

const customComponents = {
	...defaultMdxComponents,
	Accordion,
	Accordions,
	DynamicCodeBlock,
	Callout,
	Banner,
	File,
	Folder,
	Files,
	ImageZoom,
	InlineTOC,
	Step,
	Steps,
	Tab,
	Tabs,
	TypeTable,
	Pre,
	CodeBlock,
	pre: PlaygroundPre,
	blockquote: AnimatedBlockquote,
	// Swiss minimal headings - no link icons, clean typography
	h1: (props: ComponentPropsWithoutRef<"h1">) => (
		<SwissHeading as="h1" {...props} />
	),
	h2: (props: ComponentPropsWithoutRef<"h2">) => (
		<SwissHeading as="h2" {...props} />
	),
	h3: (props: ComponentPropsWithoutRef<"h3">) => (
		<SwissHeading as="h3" {...props} />
	),
	h4: (props: ComponentPropsWithoutRef<"h4">) => (
		<SwissHeading as="h4" {...props} />
	),
	h5: (props: ComponentPropsWithoutRef<"h5">) => (
		<SwissHeading as="h5" {...props} />
	),
	h6: (props: ComponentPropsWithoutRef<"h6">) => (
		<SwissHeading as="h6" {...props} />
	),
	CompilerComparison,
	FlowDiagram,
	StepCode,
	CodePlayground,
	EmailCapture: EmailCaptureForm,
	// YouTube embed with privacy-enhanced mode
	YouTubeEmbed,
	// Link with preview on hover for external links
	a: (props: ComponentPropsWithoutRef<"a">) => {
		const { href, children, ...rest } = props;
		if (href && href.startsWith("http")) {
			return (
				<LinkPreview href={href} {...rest}>
					{children}
				</LinkPreview>
			);
		}
		return <a href={href} {...rest}>{children}</a>;
	},
};

export default customComponents;
