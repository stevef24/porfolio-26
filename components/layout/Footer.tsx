"use client";

import { ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { springSnappy } from "@/lib/motion-variants";

export function Footer(): JSX.Element {
	const prefersReducedMotion = useReducedMotion();

	function scrollToTop(): void {
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
	}

	return (
		<footer className="border-t border-border/40 py-4 mt-4">
			<div className="flex items-center justify-between">
				{/* Copyright */}
				<p className="text-swiss-caption text-foreground/50">
					&copy; {new Date().getFullYear()} Stav Fernandes
				</p>

				{/* Back to top */}
				<motion.button
					onClick={scrollToTop}
					type="button"
					className="group inline-flex items-center gap-1 min-h-[40px] px-2 text-swiss-caption text-foreground/35 hover:text-foreground/70 transition-colors cursor-pointer focus-visible:outline-none"
					aria-label="Back to top"
					whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
					transition={springSnappy}
				>
					<HugeiconsIcon
						icon={ArrowUp01Icon}
						size={12}
						className="transition-transform duration-200 group-hover:-translate-y-0.5"
						aria-hidden={true}
					/>
					<span>Top</span>
				</motion.button>
			</div>
		</footer>
	);
}

export default Footer;
