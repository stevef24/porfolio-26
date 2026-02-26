"use client";

import { useState } from "react";
import { LayoutGroup } from "motion/react";
import { VideoCard } from "@/components/ui/VideoCard";
import BlurFade from "@/components/shared/BlurFade";

interface Video {
  title: string;
  description: string;
  href: string;
}

interface VideoCardListProps {
  videos: Video[];
  baseDelay?: number;
  stagger?: number;
}

export function VideoCardList({
  videos,
  baseDelay = 0.4,
  stagger = 0.05,
}: VideoCardListProps): JSX.Element {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  return (
    <LayoutGroup id="video-cards">
      <div>
        {videos.map((video, index) => (
          <BlurFade key={video.href} delay={baseDelay + index * stagger}>
            <VideoCard
              title={video.title}
              description={video.description}
              href={video.href}
              isHovered={hoveredHref === video.href}
              onHoverChange={(hovered) =>
                setHoveredHref(hovered ? video.href : null)
              }
            />
          </BlurFade>
        ))}
      </div>
    </LayoutGroup>
  );
}
