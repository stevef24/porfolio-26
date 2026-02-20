import { BlogPostsList } from "@/components/blog/BlogPostsList";
import SiteShell from "@/components/layout/SiteShell";
import BlurFade from "@/components/shared/BlurFade";
import { getVisibleBlogPages } from "@/lib/blog-visibility";
import { PageHeaderShader } from "@/components/ui/PageHeaderShader";

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
