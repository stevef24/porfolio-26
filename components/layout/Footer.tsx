"use client";

import { ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function Footer(): JSX.Element {
	function scrollToTop(): void {
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
	}

	return (
		<footer className="border-t border-border/40 py-4 mt-4">
			<div className="flex items-center justify-between">
				{/* Copyright */}
				<p className="text-swiss-caption text-foreground/50">
					&copy; {new Date().getFullYear()} Stav Fernandes
				</p>

				{/* Back to top */}
				<button
					onClick={scrollToTop}
					type="button"
					className="group inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--btn-outline-border)] bg-[var(--btn-subtle-bg)] px-3 text-swiss-caption text-[var(--btn-subtle-fg)] hover:text-foreground hover:bg-[var(--btn-subtle-bg-hover)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
					aria-label="Back to top"
				>
					<span>Top</span>
					<HugeiconsIcon
						icon={ArrowUp01Icon}
						size={14}
						className="transition-transform duration-200 group-hover:-translate-y-0.5"
						aria-hidden={true}
					/>
				</button>
			</div>
		</footer>
	);
}

export default Footer;
