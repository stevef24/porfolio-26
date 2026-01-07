import { blog } from "@/lib/source";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import SiteShell from "@/components/layout/SiteShell";

export default function BlogPage() {
  const posts = blog.getPages().map((post) => ({
    url: post.url,
    title: post.data.title || "",
    description: post.data.description || "",
  }));

  return (
    <SiteShell>
      <main className="py-8 lg:py-6">
        <h1 className="section-title text-swiss-subheading mb-6">
          Latest Blog Posts
        </h1>

        <BlogPostsList posts={posts} />
      </main>
    </SiteShell>
  );
}
