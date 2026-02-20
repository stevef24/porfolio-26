"use client";

import { useState } from "react";
import { LayoutGroup } from "motion/react";
import { MidCard } from "@/components/ui/MidCard";
import BlurFade from "@/components/shared/BlurFade";

interface BlogPost {
  url: string;
  title: string;
  description: string;
}

interface BlogPostsListProps {
  posts: BlogPost[];
  baseDelay?: number;
  stagger?: number;
}

export function BlogPostsList({
  posts,
  baseDelay = 0.25,
  stagger = 0.05,
}: BlogPostsListProps): JSX.Element {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <LayoutGroup id="blog-posts">
      <div>
        {posts.map((post, index) => (
          <BlurFade key={post.url} delay={baseDelay + index * stagger}>
            <MidCard
              title={post.title}
              description={post.description}
              href={post.url}
              isHovered={hoveredId === post.url}
              onHoverChange={(hovered) =>
                setHoveredId(hovered ? post.url : null)
              }
            />
          </BlurFade>
        ))}
      </div>
    </LayoutGroup>
  );
}
