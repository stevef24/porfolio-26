"use client";

import {
	useRef,
	useMemo,
	Children,
	isValidElement,
	type ReactNode,
} from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	InformationCircleIcon,
	Alert02Icon,
	CheckmarkCircle02Icon,
	BulbIcon,
} from "@hugeicons/core-free-icons";

type CalloutType = "note" | "warning" | "tip" | "important";

const CALLOUT_CONFIG: Record<
	CalloutType,
	{
		icon: typeof InformationCircleIcon;
		label: string;
		border: string;
		bg: string;
		iconColor: string;
	}
> = {
	note: {
		icon: InformationCircleIcon,
		label: "Note",
		border: "border-blue-500/20",
		bg: "bg-blue-500/[0.03]",
		iconColor: "text-blue-500/60",
	},
	tip: {
		icon: BulbIcon,
		label: "Tip",
		border: "border-emerald-500/20",
		bg: "bg-emerald-500/[0.03]",
		iconColor: "text-emerald-500/60",
	},
	warning: {
		icon: Alert02Icon,
		label: "Warning",
		border: "border-amber-500/20",
		bg: "bg-amber-500/[0.03]",
		iconColor: "text-amber-500/60",
	},
	important: {
		icon: CheckmarkCircle02Icon,
		label: "Important",
		border: "border-red-500/20",
		bg: "bg-red-500/[0.03]",
		iconColor: "text-red-500/60",
	},
};

/**
 * Extracts text content recursively from React children
 */
function extractText(node: ReactNode): string {
	if (typeof node === "string") return node;
	if (typeof node === "number") return String(node);
	if (!node) return "";
	if (Array.isArray(node)) return node.map(extractText).join("");
	if (isValidElement(node)) {
		return extractText((node.props as { children?: ReactNode }).children);
	}
	return "";
}

/**
 * Detects callout type from the first bold word in blockquote content.
 * Matches patterns like: **Note:** or **Warning:** or **Tip:**
 */
function detectType(children: ReactNode): {
	type: CalloutType | null;
	strippedChildren: ReactNode;
} {
	const text = extractText(children);
	const match = text.match(
		/^\s*\*{0,2}(Note|Warning|Tip|Important):?\*{0,2}\s*/i
	);

	if (!match) return { type: null, strippedChildren: children };

	const keyword = match[1].toLowerCase() as CalloutType;
	if (!(keyword in CALLOUT_CONFIG))
		return { type: null, strippedChildren: children };

	// Strip the keyword prefix from children
	const childArray = Children.toArray(children);
	const stripped = childArray
		.map((child) => {
			if (!isValidElement(child)) return child;
			const props = child.props as { children?: ReactNode };
			if (!props.children) return child;

			const innerText = extractText(props.children);
			if (
				innerText.match(
					/^\s*\*{0,2}(Note|Warning|Tip|Important):?\*{0,2}\s*$/i
				)
			) {
				return null;
			}
			return child;
		})
		.filter(Boolean);

	return { type: keyword, strippedChildren: stripped };
}

interface AnimatedBlockquoteProps {
	children: ReactNode;
	className?: string;
}

/**
 * AnimatedBlockquote - Minimal callout with type detection
 *
 * Detects **Note:**, **Warning:**, **Tip:**, **Important:** prefixes
 * and renders with matching color, icon, and subtle background.
 * Falls back to a plain minimal blockquote when no type is detected.
 */
export function AnimatedBlockquote({
	children,
	className,
}: AnimatedBlockquoteProps): JSX.Element {
	const ref = useRef<HTMLQuoteElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-80px" });
	const shouldReduceMotion = useReducedMotion();

	const { type, strippedChildren } = useMemo(
		() => detectType(children),
		[children]
	);

	const config = type ? CALLOUT_CONFIG[type] : null;

	return (
		<motion.blockquote
			ref={ref}
			className={cn(
				"relative my-10 rounded-lg",
				config
					? cn("border", config.border, config.bg, "px-5 py-4")
					: "border border-foreground/[0.1] bg-foreground/[0.02] px-5 py-4",
				className
			)}
			initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
			animate={isInView ? { opacity: 1, y: 0 } : {}}
			transition={{
				duration: 0.4,
				ease: [0.25, 0.46, 0.45, 0.94],
			}}
		>
			{config && (
				<div
					className={cn(
						"flex items-center gap-2 mb-3",
						config.iconColor
					)}
				>
					<HugeiconsIcon
						icon={config.icon}
						size={14}
						strokeWidth={1.5}
						aria-hidden="true"
					/>
					<span className="text-[10px] font-medium uppercase tracking-[0.1em]">
						{config.label}
					</span>
				</div>
			)}
			<div className="text-[14px] leading-relaxed text-foreground/60 [&>p]:m-0">
				{config ? strippedChildren : children}
			</div>
		</motion.blockquote>
	);
}
