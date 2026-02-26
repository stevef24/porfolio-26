import Home from "@/components/landing/Home";
import SiteShell from "@/components/layout/SiteShell";
import { getVisibleBlogPages } from "@/lib/blog-visibility";

export default function Page(): JSX.Element {
  // Get posts and sort by date (newest first)
  const posts = getVisibleBlogPages()
    .slice()
    .sort((a, b) => {
      const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
      const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
      return dateB - dateA; // Descending (newest first)
    })
    .map((post) => ({
      url: post.url,
      data: {
        title: post.data.title,
        description: post.data.description,
      },
    }));

  return (
    <SiteShell>
      <Home posts={posts} />
    </SiteShell>
  );
}
