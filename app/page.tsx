import Home from "@/components/landing/Home";
import { blog } from "@/lib/source";
import SiteShell from "@/components/layout/SiteShell";

export default function Page() {
  const posts = blog.getPages().map((post) => ({
    url: post.url,
    data: {
      title: post.data.title,
      description: post.data.description,
      author: post.data.author,
    },
  }));

  return (
    <SiteShell>
      <Home posts={posts} />
    </SiteShell>
  );
}
