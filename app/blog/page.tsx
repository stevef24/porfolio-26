import type { Metadata } from "next";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import SiteShell from "@/components/layout/SiteShell";
import BlurFade from "@/components/shared/BlurFade";
import { getVisibleBlogPages } from "@/lib/blog-visibility";
import { PageHeaderShader } from "@/components/ui/PageHeaderShader";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on frontend engineering, AI tooling, React patterns, and building for the web.",
  openGraph: {
    title: "Blog | Stav Fernandes",
    description:
      "Thoughts on frontend engineering, AI tooling, React patterns, and building for the web.",
    url: "https://stavfernandes.dev/blog",
    images: [
      {
        url: "https://stavfernandes.dev/og?title=Blog&description=Thoughts%20on%20frontend%20engineering%2C%20AI%20tooling%2C%20and%20building%20for%20the%20web.",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Stav Fernandes",
    description:
      "Thoughts on frontend engineering, AI tooling, React patterns, and building for the web.",
    creator: "@CodewithStav",
  },
};

export default function BlogPage(): JSX.Element {
  const posts = getVisibleBlogPages().map((post) => ({
    url: post.url,
    title: post.data.title || "",
    description: post.data.description || "",
  }));

  return (
    <SiteShell>
      {/* Shader page header — breaks out of SiteShell's px-4 lg:px-6 padding */}
      <PageHeaderShader
        tokenPrefix="--blog-list-hero"
        fallbackMesh={[
          "rgb(220 252 231)",
          "rgb(254 252 232)",
          "rgb(209 250 229)",
          "rgb(224 247 250)",
        ]}
        darkMesh={[
          "#0a1117",
          "#123644",
          "#10352f",
          "#142445",
        ]}
        darkPaperFront="rgb(126 153 160)"
        darkPaperBack="#081015"
        className="-mx-4 lg:-mx-6 mb-10"
      >
        <div className="px-4 lg:px-6 pt-14 pb-10 lg:pt-16 lg:pb-12">
          <BlurFade delay={0.05}>
            <p className="text-swiss-label text-foreground/50 mb-3">Blog</p>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h1 className="text-swiss-section mb-3">Thoughts &amp; Writing</h1>
          </BlurFade>
          <BlurFade delay={0.15}>
            <p className="text-swiss-body text-foreground/60 leading-relaxed max-w-xl">
              On engineering, design systems, and building for the web.
            </p>
          </BlurFade>
        </div>
      </PageHeaderShader>

      {/* Posts list */}
      <section className="pb-28">
        <BlurFade delay={0.2}>
          <h2 className="text-swiss-label text-foreground/50 mb-4">
            Latest Posts
          </h2>
        </BlurFade>
        <BlogPostsList posts={posts} baseDelay={0.25} />
      </section>
    </SiteShell>
  );
}
