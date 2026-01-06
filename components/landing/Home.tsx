"use client";

import { motion } from "motion/react";
import BlurFade from "@/components/shared/BlurFade";
import BlurFadeText from "@/components/shared/BlurText";
import { MidCard } from "@/components/ui/MidCard";
import { VideoCard } from "@/components/ui/VideoCard";
import { EmailCaptureForm } from "@/components/shared/EmailCaptureForm";
import { Footer } from "@/components/layout/Footer";
import Contact from "./Contact";
import { useTabVisibility } from "@/hooks/useTabVisibility";

interface BlogPost {
	url: string;
	data: {
		title?: string;
		description?: string;
		author?: string;
	};
}

interface HomeProps {
	posts: BlogPost[];
}

const Home = ({ posts }: HomeProps) => {
	useTabVisibility({
		awayMessage: "Come back - I'm bored",
		originalTitle: "Stav Fernandes - Full Stack Developer & Technical Writer",
		enabled: true,
	});

	const videos = [
		{
			title: "Next.js Caching Deep Dive + Visual Walkthrough",
			description:
				"A comprehensive visual guide to Next.js caching mechanisms. Learn how different caching strategies work and when to use them for optimal performance.",
			videoId: "LQMQLLPFiTc",
			href: "https://www.youtube.com/watch?v=LQMQLLPFiTc",
		},
		{
			title: "Vercel AI SDK Crash Course",
			description:
				"Complete crash course on building AI-powered applications with the Vercel AI SDK. From setup to deployment, master modern AI integration patterns.",
			videoId: "plj49NPsYfk",
			href: "https://www.youtube.com/watch?v=plj49NPsYfk",
		},
		{
			title: "Agentic Workflows Explained: Code + Visual Guide",
			description:
				"Deep dive into agentic workflows with practical code examples and visual explanations. Learn how to build intelligent, autonomous AI agents.",
			videoId: "S8B_WmIZVkw",
			href: "https://www.youtube.com/watch?v=S8B_WmIZVkw",
		},
		{
			title: "Streaming in Next.js - Explained Visually",
			description:
				"Visual breakdown of streaming in Next.js. Understand how React Server Components enable progressive rendering for better user experience.",
			videoId: "TGpaw0FsVPE",
			href: "https://www.youtube.com/watch?v=TGpaw0FsVPE",
		},
	];

	return (
		<main className="py-8 lg:py-6">
				{/* Hero Section */}
				<section
					id="hero"
					className="pb-6"
					aria-labelledby="home-hero-heading"
				>
					<BlurFadeText
						delay={0}
						text="Hi, I'm Stav"
						className="text-swiss-hero mb-3"
						id="home-hero-heading"
					/>
					<BlurFade delay={0.05}>
						<p className="text-swiss-body max-w-prose">
							Frontend developer. Building with AI, teaching what I learn.
						</p>
					</BlurFade>
					{/* Accent line - lime */}
					<motion.div
						className="w-12 h-[1px] bg-primary mt-6"
						initial={{ scaleX: 0, originX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
					/>
				</section>

				{/* About Section */}
				<section className="py-4" id="about" aria-labelledby="about-heading">
					<BlurFadeText
						delay={0.15}
						text="About"
						className="section-title text-swiss-subheading mb-4"
						id="about-heading"
					/>
					<div className="space-y-3">
						<BlurFade delay={0.2}>
							<p className="text-swiss-body">
								Open to remote Developer Relations / DX roles.
							</p>
						</BlurFade>
						<BlurFade delay={0.25}>
							<p className="text-swiss-body">
								I make{" "}
								<a
									href="https://www.youtube.com/@CodewithStav"
									target="_blank"
									rel="noopener noreferrer"
									className="text-foreground hover:text-primary transition-colors underline underline-offset-2"
								>
									YouTube videos
								</a>{" "}
								about frontend development and AI tooling — breaking down complex
								systems into visual explanations.
							</p>
						</BlurFade>
						<BlurFade delay={0.3}>
							<p className="text-swiss-body">
								Previously: [X]. Currently based in Thailand.
							</p>
						</BlurFade>
					</div>
				</section>

				{/* Videos Section */}
				<section className="py-4" id="videos" aria-labelledby="videos-heading">
					<BlurFadeText
						delay={0.35}
						text="Latest videos"
						className="section-title text-swiss-subheading mb-4"
						id="videos-heading"
					/>
					<div className="divide-y divide-border">
						{videos.map((video, index) => (
							<BlurFade key={video.href} delay={0.4 + index * 0.05}>
								<VideoCard
									title={video.title}
									description={video.description}
									href={video.href}
								/>
							</BlurFade>
						))}
					</div>
				</section>

				{/* Posts Section */}
				<section className="py-4" id="posts" aria-labelledby="posts-heading">
					<BlurFadeText
						delay={0.6}
						text="Latest posts"
						className="section-title text-swiss-subheading mb-4"
						id="posts-heading"
					/>
					<div className="divide-y divide-border">
						{posts.slice(0, 3).map((post, index) => (
							<BlurFade key={post.url} delay={0.65 + index * 0.05}>
								<MidCard
									title={post.data.title || ""}
									description={post.data.description || ""}
									href={post.url}
								/>
							</BlurFade>
						))}
					</div>
				</section>

				{/* Subscribe Section */}
				<section
					className="py-6"
					id="subscribe"
					aria-labelledby="subscribe-heading"
				>
					<BlurFade delay={0.75}>
						<EmailCaptureForm
							title="Stay in the loop"
							description="I share notes on frontend, AI, and what I'm building. No spam, unsubscribe anytime."
							buttonLabel="Subscribe"
							source="homepage"
						/>
					</BlurFade>
				</section>

				{/* Contact Section */}
				<section
					className="py-4"
					id="contact"
					aria-labelledby="contact-heading"
				>
					<BlurFadeText
						delay={0.8}
						text="Contact"
						className="section-title text-swiss-subheading mb-4"
						id="contact-heading"
					/>
					<Contact />
				</section>

				{/* Footer */}
				<BlurFade delay={0.9}>
					<Footer />
				</BlurFade>
		</main>
	);
};

export default Home;
