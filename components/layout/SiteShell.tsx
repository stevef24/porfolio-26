import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import SiteShellWithSidebar from "@/components/layout/SiteShellWithSidebar";

interface SiteShellProps {
	children: ReactNode;
	sidebar?: ReactNode;
	toc?: ReactNode;
	className?: string;
	contentClassName?: string;
}

/**
 * SiteShell - Main layout wrapper with optional sidebar and TOC
 *
 * Layout configurations:
 * 1. Simple (no sidebar, no TOC) - centered content at max-width
 * 2. TOC Layout (no sidebar, with TOC) - content + TOC in grid
 * 3. Full Layout (sidebar + TOC) - full width with sidebar
 */
export function SiteShell({
	children,
	sidebar,
	toc,
	className,
	contentClassName,
}: SiteShellProps): JSX.Element {
	const hasSidebar = Boolean(sidebar);
	const hasToc = Boolean(toc);

	const layoutWidth = hasSidebar
		? "max-w-none"
		: hasToc
			? "max-w-[calc(var(--content-width)+var(--toc-width)+var(--content-gap))]"
			: "max-w-[var(--content-width)]";

	if (hasSidebar) {
		return (
			<SiteShellWithSidebar
				sidebar={sidebar}
				toc={toc}
				className={className}
				contentClassName={contentClassName}
			>
				{children}
			</SiteShellWithSidebar>
		);
	}

	return (
		<div className={cn("min-h-svh flex flex-col bg-transparent", className)}>
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
			>
				Skip to content
			</a>
			<Header />

			<main id="main-content" className={cn("flex-1 ", contentClassName)}>
				{hasToc ? (
					<div className={cn("mx-auto w-full px-4 lg:px-6", layoutWidth)}>
						<div
							className={cn(
								"grid",
								"gap-8 lg:gap-[var(--content-gap)]",
								"lg:grid-cols-[minmax(0,var(--content-width))_var(--toc-width)]",
							)}
						>
							<div className="min-w-0">{children}</div>
							<aside className="hidden lg:block">{toc}</aside>
						</div>
					</div>
				) : (
					<div className={cn("mx-auto w-full px-4 lg:px-6", layoutWidth)}>
						{children}
					</div>
				)}
			</main>
		</div>
	);
}

export default SiteShell;
