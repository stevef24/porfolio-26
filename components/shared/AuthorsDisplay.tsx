"use client";

import { cn } from "@/lib/utils";

interface AuthorDisplayProps {
	author: {
		name: string;
		image?: string;
	};
	className?: string;
}

export function AuthorDisplay({ author, className }: AuthorDisplayProps) {
	const initials = author.name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
				<span className="text-base font-medium text-muted-foreground">
					{initials}
				</span>
			</div>
			<span className="text-base text-muted-foreground">{author.name}</span>
		</div>
	);
}
