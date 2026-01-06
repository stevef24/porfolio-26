"use client";

import { MidCard } from "@/components/ui/MidCard";
import BlurFade from "@/components/shared/BlurFade";

interface BlogPost {
  url: string;
  title: string;
  description: string;
}

interface BlogPostsListProps {
  posts: BlogPost[];
}

export function BlogPostsList({ posts }: BlogPostsListProps) {
  return (
    <div className="divide-y divide-border">
      {posts.map((post, index) => (
        <BlurFade key={post.url} delay={0.05 + index * 0.05}>
          <MidCard
            title={post.title}
            description={post.description}
            href={post.url}
          />
        </BlurFade>
      ))}
    </div>
  );
}
