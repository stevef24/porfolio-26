"use client";

import Link from "next/link";
import BlurFade from "@/components/shared/BlurFade";
import LinkedinIcon from "@/components/ui/linkedin-icon";
import YoutubeIcon from "@/components/ui/youtube-icon";
import GithubIcon from "@/components/ui/github-icon";

const socials = [
	{
		name: "LinkedIn",
		url: "https://www.linkedin.com/in/stavfernandes24/",
		Icon: LinkedinIcon,
	},
	{
		name: "YouTube",
		url: "https://www.youtube.com/@CodewithStav",
		Icon: YoutubeIcon,
	},
	{
		name: "GitHub",
		url: "https://github.com/stevef24",
		Icon: GithubIcon,
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
						<social.Icon size={18} strokeWidth={1.5} />
					</Link>
				))}
			</div>
		</BlurFade>
	);
};

export default Contact;
