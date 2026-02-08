import { blog } from "@/lib/source";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import SiteShell from "@/components/layout/SiteShell";
import BlurFade from "@/components/shared/BlurFade";

export default function BlogPage(): JSX.Element {
  const posts = blog.getPages().map((post) => ({
    url: post.url,
    title: post.data.title || "",
    description: post.data.description || "",
  }));

  return (
    <SiteShell>
      <main className="py-8 lg:py-6">
        {/* Page header */}
        <header className="mb-8">
          <BlurFade delay={0.05}>
            <p className="text-swiss-label text-foreground/50 mb-3">Blog</p>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h1 className="text-swiss-body text-foreground font-medium mb-3">
              Thoughts & Writing
            </h1>
          </BlurFade>
          <BlurFade delay={0.15}>
            <p className="text-swiss-body text-foreground/60 leading-relaxed max-w-xl">
              On engineering, design systems, and building for the web.
            </p>
          </BlurFade>
        </header>

        {/* Posts list */}
        <section>
          <BlurFade delay={0.2}>
            <h2 className="text-swiss-label text-foreground/50 mb-4">
              Latest Posts
            </h2>
          </BlurFade>
          <BlogPostsList posts={posts} baseDelay={0.25} />
        </section>
      </main>
    </SiteShell>
  );
}
