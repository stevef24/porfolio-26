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
					className="group inline-flex items-center gap-1 text-swiss-caption text-foreground/35 hover:text-foreground/70 transition-colors cursor-pointer focus-visible:outline-none"
					aria-label="Back to top"
				>
					<HugeiconsIcon
						icon={ArrowUp01Icon}
						size={12}
						className="transition-transform duration-200 group-hover:-translate-y-0.5"
						aria-hidden={true}
					/>
					<span>Top</span>
				</button>
			</div>
		</footer>
	);
}

export default Footer;
