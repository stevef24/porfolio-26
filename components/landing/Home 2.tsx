"use client";

import { motion } from "motion/react";
import BlurFade from "@/components/shared/BlurFade";
import BlurFadeText from "@/components/shared/BlurText";
import { MidCard } from "@/components/ui/MidCard";
import { VideoCard } from "@/components/ui/VideoCard";
import Contact from "./Contact";
import { useTabVisibility } from "@/hooks/useTabVisibility";
import { ScrollingDot } from "@/components/ui/ScrollingDot";

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
	const sectionIds = ["hero", "about", "videos", "posts", "contact"];

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
		<>
			<ScrollingDot sections={sectionIds} />
			<main className="max-w-[65ch] mx-auto pl-10 pr-6 md:px-4 py-16 lg:py-24">
				{/* Hero Section - Swiss luxury spacing */}
				<section id="hero" className="pb-16" aria-labelledby="home-hero-heading">
					<BlurFadeText
						delay={0}
						text="Hi, I'm Stav"
						className="text-swiss-hero mb-6"
						id="home-hero-heading"
					/>
					<BlurFade delay={0.05}>
						<p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
							Frontend dev turned explorer. I love learning about the
							intersection of AI, design, and user experience, and I enjoy
							sharing and teaching what I learn along the way.
						</p>
					</BlurFade>
					{/* Accent line - Swiss minimal */}
					<motion.div
						className="w-16 h-[2px] bg-primary mt-10"
						initial={{ scaleX: 0, originX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
					/>
				</section>

				{/* About Section - Swiss spacing */}
				<section className="py-12" id="about" aria-labelledby="about-heading">
					<BlurFadeText
						delay={0.15}
						text="About"
						className="section-title text-swiss-subheading mb-6"
						id="about-heading"
					/>
					<div className="space-y-6">
						<BlurFade delay={0.2}>
							<p className="text-base text-muted-foreground leading-relaxed">
								I&apos;m currently open to work and looking for fully remote
								positions where I can bring my passion for building exceptional
								digital experiences. I love exploring the intersection of AI,
								design, and user experience - finding ways to make technology
								feel natural and intuitive.
							</p>
						</BlurFade>
						<BlurFade delay={0.25}>
							<p className="text-base text-muted-foreground leading-relaxed">
								Outside of work, I run a{" "}
								<a
									href="https://www.youtube.com/@CodewithStav"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:opacity-80 transition-opacity"
								>
									YouTube channel
								</a>{" "}
								where I teach frontend development, AI, and how to bring them
								together.
							</p>
						</BlurFade>
						<BlurFade delay={0.3}>
							<p className="text-base text-muted-foreground leading-relaxed">
								I thrive in roles where I can combine deep technical work with
								teaching and community engagement - whether that&apos;s creating
								guides, explaining complex systems, or helping others understand
								the &apos;why&apos; behind the code.
							</p>
						</BlurFade>
					</div>
				</section>

				{/* Videos Section - Swiss spacing */}
				<section className="py-12" id="videos" aria-labelledby="videos-heading">
					<BlurFadeText
						delay={0.35}
						text="Latest videos"
						className="section-title text-swiss-subheading mb-6"
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

				{/* Posts Section - Swiss spacing */}
				<section className="py-12" id="posts" aria-labelledby="posts-heading">
					<BlurFadeText
						delay={0.6}
						text="Latest posts"
						className="section-title text-swiss-subheading mb-6"
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

				{/* Contact Section - Swiss spacing */}
				<section className="py-12" id="contact" aria-labelledby="contact-heading">
					<BlurFadeText
						delay={0.8}
						text="Contact"
						className="section-title text-swiss-subheading mb-6"
						id="contact-heading"
					/>
					<Contact />
				</section>
			</main>
		</>
	);
};

export default Home;
