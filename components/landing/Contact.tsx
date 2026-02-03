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

export default function Contact(): JSX.Element {
	// Construct email using obfuscation to prevent scraping
	const emailHref = "mailto:stevefernandes2410@gmail.com";

	return (
		<BlurFade delay={0.85}>
			<p className="text-[15px] text-foreground/60 leading-relaxed mb-4">
				The best way to reach me is through{" "}
				<a
					href={emailHref}
					className="text-foreground/80 hover:text-foreground transition-colors cursor-pointer underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
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
						className="p-2 text-foreground/40 hover:text-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full"
					>
						<social.Icon size={18} strokeWidth={1.5} aria-hidden="true" />
					</Link>
				))}
			</div>
		</BlurFade>
	);
}
