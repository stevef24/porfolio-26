"use client";

import { ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function Footer(): JSX.Element {
	function scrollToTop(): void {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	return (
		<footer className="border-t border-border/40 py-4 mt-4">
			<div className="flex items-center justify-between">
				{/* Copyright */}
				<p className="text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} Stav Fernandes
				</p>

				{/* Back to top */}
				<button
					onClick={scrollToTop}
					className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
