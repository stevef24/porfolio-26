import { Footer } from "@/components/layout/Footer";
import { EmailCaptureForm } from "@/components/shared/EmailCaptureForm";
import BlurFade from "@/components/shared/BlurFade";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import { VideoCardList } from "@/components/ui/VideoCardList";
import { LinkPreview } from "@/components/ui/blog/LinkPreview";
import Contact from "./Contact";

interface BlogPost {
	url: string;
	data: {
		title?: string;
		description?: string;
	};
}

interface HomeProps {
	posts: BlogPost[];
}

const videos = [
	{
		title: "Vercel AI SDK Advanced Concepts",
		description:
			"Deep dive into advanced AI SDK patterns including backpressure, rate limiting, agents, caching, and dev tools for production-ready AI applications.",
		href: "https://www.youtube.com/watch?v=iv_3xi0teSI",
	},
	{
		title: "Vercel AI SDK V6 Crash Course 2026",
		description:
			"Updated crash course covering the latest Vercel AI SDK v6 features. Learn modern AI integration patterns and best practices.",
		href: "https://www.youtube.com/watch?v=bx3bBKtKb8c",
	},
	{
		title: "Next.js Caching Deep Dive + Visual Walkthrough",
		description:
			"A comprehensive visual guide to Next.js caching mechanisms. Learn how different caching strategies work and when to use them for optimal performance.",
		href: "https://www.youtube.com/watch?v=LQMQLLPFiTc",
	},
	{
		title: "Agentic Workflows Explained: Code + Visual Guide",
		description:
			"Deep dive into agentic workflows with practical code examples and visual explanations. Learn how to build intelligent, autonomous AI agents.",
		href: "https://www.youtube.com/watch?v=S8B_WmIZVkw",
	},
	{
		title: "Streaming in Next.js - Explained Visually",
		description:
			"Visual breakdown of streaming in Next.js. Understand how React Server Components enable progressive rendering for better user experience.",
		href: "https://www.youtube.com/watch?v=TGpaw0FsVPE",
	},
];

export default function Home({ posts }: HomeProps): JSX.Element {
	const blogPosts = posts.slice(0, 3).map((post) => ({
		url: post.url,
		title: post.data.title || "",
		description: post.data.description || "",
	}));

	return (
		<main className="pt-12 lg:pt-16">
			{/* Hero Section */}
			<section id="hero" className="pb-12" aria-labelledby="home-hero-heading">
				<BlurFade delay={0}>
					<div className="mb-12">
						<h2
							className="text-foreground text-swiss-body font-medium mb-0.5"
							id="home-hero-heading"
						>
							Stav Fernandes
						</h2>
						<p className="text-foreground/50 text-swiss-body">
							Frontend Developer
						</p>
					</div>
				</BlurFade>

				<BlurFade delay={0.1}>
					<div>
						<h3 className="text-swiss-label text-foreground/50 mb-3">
							Today
						</h3>
						<p className="text-foreground/60 text-swiss-body leading-relaxed mb-3">
							I build frontend interfaces and create{" "}
							<LinkPreview
								href="https://www.youtube.com/@CodewithStav"
								className="text-foreground/80 hover:text-foreground transition-colors underline underline-offset-[3px] decoration-foreground/20"
							>
								YouTube content
							</LinkPreview>{" "}
							about AI tooling and modern web development. I like to break down complex systems into visual explanations.
						</p>
						<p className="text-foreground/50 text-swiss-body leading-relaxed">
							Previously worked at Nationwide UK. Currently{" "}
								<LinkPreview href="https://littlelotus.co" className="text-foreground/80 hover:text-foreground transition-colors underline underline-offset-[3px] decoration-foreground/20">freelancing</LinkPreview>, based in Thailand. Open to remote work only.
						</p>
					</div>
				</BlurFade>
			</section>

			{/* Videos Section */}
			<section className="py-8" id="videos" aria-labelledby="videos-heading">
				<BlurFade delay={0.35}>
					<h3
						className="text-swiss-label text-foreground/50 mb-4"
						id="videos-heading"
					>
						Latest videos
					</h3>
				</BlurFade>
				<VideoCardList videos={videos} baseDelay={0.4} stagger={0.05} />
			</section>

			{/* Posts Section */}
			<section className="py-8" id="posts" aria-labelledby="posts-heading">
				<BlurFade delay={0.6}>
					<h3
						className="text-swiss-label text-foreground/50 mb-4"
						id="posts-heading"
					>
						Latest posts
					</h3>
				</BlurFade>
				<BlogPostsList posts={blogPosts} baseDelay={0.65} stagger={0.05} />
			</section>

			{/* Subscribe Section */}
			<section className="py-8" id="subscribe" aria-labelledby="subscribe-heading">
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
			<section className="py-8" id="contact" aria-labelledby="contact-heading">
				<BlurFade delay={0.8}>
					<h3
						className="text-swiss-label text-foreground/50 mb-4"
						id="contact-heading"
					>
						Contact
					</h3>
				</BlurFade>
				<Contact />
			</section>

			{/* Footer */}
			<div className="pt-6">
				<BlurFade delay={0.9}>
					<Footer />
				</BlurFade>
			</div>
		</main>
	);
}
