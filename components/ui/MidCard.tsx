"use client";

import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

interface MidCardProps {
	title: string;
	description: string;
	href?: string;
	className?: string;
	external?: boolean;
}

/**
 * MidCard - Minimal link card with subtle hover states
 * Oatmeal design: warm backgrounds, olive accents, refined transitions
 */
export function MidCard({
	title,
	description,
	href = "#",
	className,
	external = false,
}: MidCardProps) {
	const Component = external ? "a" : Link;
	const externalProps = external
		? { target: "_blank", rel: "noopener noreferrer" }
		: {};

	return (
		<Component
			href={href}
			{...externalProps}
			className={cn(
				"group block py-4 -mx-4 px-4",
				"rounded-lg",
				"transition-all duration-200 ease-out",
				"hover:bg-muted/40",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				className
			)}
		>
			<article className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<h3
						className={cn(
							"text-base font-medium",
							"text-foreground",
							"group-hover:text-primary",
							"transition-colors duration-200",
							"line-clamp-1"
						)}
					>
						{title}
					</h3>
					<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-1">
						{description}
					</p>
				</div>

				{/* Arrow icon - subtle movement on hover */}
				<span
					className={cn(
						"flex-shrink-0 mt-0.5",
						"text-muted-foreground/60",
						"group-hover:text-primary",
						"transition-all duration-200"
					)}
				>
					<HugeiconsIcon
						icon={ArrowUpRight01Icon}
						size={16}
						className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
					/>
				</span>
			</article>
		</Component>
	);
}
