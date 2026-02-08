"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MidCardProps {
	title: string;
	description: string;
	href?: string;
	className?: string;
}

/**
 * MidCard - Minimal link card with subtle hover states
 * OpenAI design: opacity-based colors, smooth transitions, 6px radius
 */
export function MidCard({
	title,
	description,
	href = "#",
	className,
}: MidCardProps): JSX.Element {
	return (
		<Link
			href={href}
			className={cn(
				"group block py-6 -mx-4 px-4",
				"rounded-[6px]",
				"hover:bg-[var(--sf-bg-subtle)]",
				"transition-colors duration-150",
				"shadow-none",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				className
			)}
		>
			<article className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<h3 className="text-swiss-body text-foreground font-medium group-hover:text-foreground/70 transition-colors duration-150 line-clamp-1">
						{title}
					</h3>
					<p className="text-swiss-body text-foreground/50 line-clamp-2 mt-1">
						{description}
					</p>
				</div>

				{/* Arrow icon - subtle movement on hover */}
				<span
					className={cn(
						"flex-shrink-0 mt-0.5",
						"text-foreground/30",
						"group-hover:text-foreground/60",
						"transition-colors duration-150"
					)}
				>
					<HugeiconsIcon
						icon={ArrowUpRight01Icon}
						size={16}
						className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						aria-hidden={true}
					/>
				</span>
			</article>
		</Link>
	);
}
