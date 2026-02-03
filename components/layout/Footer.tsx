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
				<p className="text-[15px] text-foreground/50">
					&copy; {new Date().getFullYear()} Stav Fernandes
				</p>

				{/* Back to top */}
				<button
					onClick={scrollToTop}
					type="button"
					className="group flex items-center gap-1.5 text-[15px] text-foreground/50 hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full"
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
