"use client";

import Link from "next/link";
import BlurFade from "@/components/shared/BlurFade";
import {
	Linkedin01Icon,
	YoutubeIcon,
	GithubIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const socials = [
	{
		name: "LinkedIn",
		url: "https://www.linkedin.com/in/stavfernandes24/",
		icon: Linkedin01Icon,
	},
	{
		name: "YouTube",
		url: "https://www.youtube.com/@CodewithStav",
		icon: YoutubeIcon,
	},
	{
		name: "GitHub",
		url: "https://github.com/stevef24",
		icon: GithubIcon,
	},
];

const Contact = () => {
	// Construct email using obfuscation to prevent scraping
	const getEmailHref = () => {
		const user = "stevefernandes2410";
		const domain = "gmail.com";
		return `mailto:${user}@${domain}`;
	};

	return (
		<BlurFade delay={0.85}>
			<p className="text-swiss-body mb-4">
				The best way to reach me is through{" "}
				<a
					href={getEmailHref()}
					className="text-primary hover:text-primary/80 transition-colors cursor-pointer underline underline-offset-2"
				>
					email
				</a>
				.
			</p>
			<div className="flex items-center gap-2">
				{socials.map((social) => (
					<Link
						key={social.name}
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={social.name}
						className="p-2 text-muted-foreground hover:text-primary transition-colors"
					>
						<HugeiconsIcon icon={social.icon} size={16} />
					</Link>
				))}
			</div>
		</BlurFade>
	);
};

export default Contact;
