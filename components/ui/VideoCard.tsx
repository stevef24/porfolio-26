"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LinkPreview } from "@/components/ui/blog/LinkPreview";
import { cn } from "@/lib/utils";
import { springSmooth } from "@/lib/motion-variants";

interface VideoCardProps {
	title: string;
	description: string;
	href: string;
	className?: string;
	/** Controlled by parent VideoCardList for shared layoutId hover highlight */
	isHovered?: boolean;
	onHoverChange?: (hovered: boolean) => void;
}

/**
 * VideoCard - Link card with preview popup on hover.
 * Uses a shared layoutId="videocard-hover-bg" so the highlight
 * slides between cards when controlled by a LayoutGroup parent.
 */
export function VideoCard({
	title,
	description,
	href,
	className,
	isHovered = false,
	onHoverChange,
}: VideoCardProps): JSX.Element {
	const prefersReducedMotion = useReducedMotion();

	return (
		<div
			className={cn("relative -mx-4", className)}
			onMouseEnter={() => onHoverChange?.(true)}
			onMouseLeave={() => onHoverChange?.(false)}
		>
			{/* Shared layoutId hover highlight */}
			<AnimatePresence>
				{isHovered && (
					<motion.div
						layoutId="videocard-hover-bg"
						className="absolute inset-0 rounded-[6px]"
						style={{ backgroundColor: "var(--sf-bg-subtle)" }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
					/>
				)}
			</AnimatePresence>

			<LinkPreview href={href} className="block">
				<article
					className={cn(
						"group relative z-10 py-4 px-4",
						"rounded-[6px]",
						"shadow-none cursor-pointer"
					)}
				>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1 min-w-0">
							<h3 className="text-swiss-body text-foreground group-hover:text-foreground/70 transition-colors duration-150 line-clamp-1">
								{title}
							</h3>
							<p className="text-swiss-body text-foreground/50 line-clamp-2 mt-1">
								{description}
							</p>
						</div>

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
		</div>
	);
}
