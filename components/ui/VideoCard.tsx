"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkPreview } from "@/components/ui/blog/LinkPreview";

interface VideoCardProps {
	title: string;
	description: string;
	href?: string;
	className?: string;
}

export function VideoCard({
	title,
	description,
	href,
	className,
}: VideoCardProps) {
	const content = (
		<article
			className={`group py-3 cursor-pointer transition-colors duration-200 hover:bg-muted/30 -mx-4 px-4 rounded-md ${className ?? ""}`}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-150 line-clamp-1">
						{title}
					</h3>
					<p className="text-base text-muted-foreground leading-relaxed line-clamp-1 mt-0.5">
						{description}
					</p>
				</div>

				{/* Arrow icon */}
				<span className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors duration-150">
					<HugeiconsIcon
						icon={ArrowUpRight01Icon}
						size={14}
						className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
					/>
				</span>
			</div>
		</article>
	);

	if (href) {
		return (
			<LinkPreview href={href} className="block">
				{content}
			</LinkPreview>
		);
	}

	return content;
}
