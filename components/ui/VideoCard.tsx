"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkPreview } from "@/components/ui/blog/LinkPreview";
import { cn } from "@/lib/utils";

interface VideoCardProps {
	title: string;
	description: string;
	href: string;
	className?: string;
}

/**
 * VideoCard - Link card with preview popup on hover
 * OpenAI design: opacity-based colors, smooth transitions, 6px radius
 */
export function VideoCard({
	title,
	description,
	href,
	className,
}: VideoCardProps): JSX.Element {
	return (
		<LinkPreview href={href} className="block">
			<article
				className={cn(
					"group py-4 -mx-4 px-4",
					"rounded-[6px]",
					"hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]",
					"transition-colors duration-150",
					"shadow-none",
					"cursor-pointer",
					className
				)}
			>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 min-w-0">
						<h3 className="text-[15px] text-foreground group-hover:text-foreground/70 transition-colors duration-150 line-clamp-1">
							{title}
						</h3>
						<p className="text-[15px] text-foreground/50 line-clamp-2 mt-1">
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
				</div>
			</article>
		</LinkPreview>
	);
}
