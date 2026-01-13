"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  /** YouTube video ID (e.g., "dQw4w9WgXcQ") */
  videoId: string;
  /** Title for accessibility (will be used as iframe title) */
  title?: string;
  /** Aspect ratio - defaults to 16/9 */
  aspectRatio?: number;
  /** Additional className for the container */
  className?: string;
  /** Start time in seconds */
  start?: number;
  /** Optional thumbnail URL override */
  thumbnailUrl?: string;
}

/**
 * YouTubeEmbed - Responsive YouTube video embed component with hover preview
 *
 * Features:
 * - Lazy loading for performance
 * - Privacy-enhanced mode (youtube-nocookie.com)
 * - Disables related videos at end (rel=0)
 * - Responsive with configurable aspect ratio
 * - Accessible with proper title attribute
 * - Brutalist design with sharp corners
 * - Hover effect with play button overlay
 *
 * Usage in MDX:
 * ```mdx
 * <YouTubeEmbed videoId="dQw4w9WgXcQ" title="Demo video" />
 * ```
 */
export function YouTubeEmbed({
  videoId,
  title = "YouTube video",
  aspectRatio = 16 / 9,
  className,
  start,
  thumbnailUrl,
}: YouTubeEmbedProps): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Build the embed URL with privacy-enhanced mode and no related videos
  const params = new URLSearchParams({
    rel: "0", // Disable related videos
    modestbranding: "1", // Reduce YouTube branding
    autoplay: "1", // Auto-play when clicked
  });

  if (start) {
    params.set("start", start.toString());
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  const thumbnail = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <motion.div
      className={cn(
        "relative w-full overflow-hidden rounded-none border border-border bg-muted cursor-pointer group",
        "my-6", // Vertical margin for blog posts
        className
      )}
      style={{
        paddingBottom: `${(1 / aspectRatio) * 100}%`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsPlaying(true)}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {isPlaying ? (
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <>
          {/* Thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            width={1280}
            height={720}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Dark overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Play button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8, scale: isHovered ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-none bg-primary text-primary-foreground border border-border">
              <svg
                className="h-8 w-8 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>

          {/* Title bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border p-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <p className="text-xs font-medium text-foreground uppercase tracking-wider truncate">
              {title}
            </p>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

export default YouTubeEmbed;
