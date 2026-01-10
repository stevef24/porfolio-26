"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface SiteShellProps {
	children: React.ReactNode;
	sidebar?: React.ReactNode;
	toc?: React.ReactNode;
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
}: SiteShellProps) {
	const hasSidebar = Boolean(sidebar);
	const hasToc = Boolean(toc);

	// Determine max-width based on layout type
	const layoutWidth = React.useMemo(() => {
		if (hasSidebar) {
			// Sidebar layouts use full available width
			return "max-w-none";
		}
		if (hasToc) {
			// Blog posts with TOC
			return "max-w-[calc(var(--content-width)+var(--toc-width)+var(--content-gap))]";
		}
		// Simple content pages
		return "max-w-[var(--content-width)]";
	}, [hasSidebar, hasToc]);

	return (
		<SidebarProvider defaultOpen={false}>
			{sidebar}
			<SidebarInset className={cn("min-h-svh flex flex-col bg-transparent", className)}>
				<Header />

				{/* Main content area */}
				<main
					className={cn(
						"flex-1",
						// Top padding to account for fixed navbar
						"pt-20",
						contentClassName
					)}
				>
					{hasToc ? (
						<div className={cn("mx-auto w-full px-4 lg:px-6", layoutWidth)}>
							<div
								className={cn(
									"grid",
									// Responsive gap
									"gap-8 lg:gap-[var(--content-gap)]",
									// Grid columns only on large screens
									"lg:grid-cols-[minmax(0,var(--content-width))_var(--toc-width)]"
								)}
							>
								{/* Content column */}
								<div className="min-w-0">{children}</div>

								{/* TOC column - hidden on mobile */}
								<aside className="hidden lg:block">{toc}</aside>
							</div>
						</div>
					) : (
						<div className={cn("mx-auto w-full px-4 lg:px-6", layoutWidth)}>
							{children}
						</div>
					)}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default SiteShell;
