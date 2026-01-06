"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight01Icon, PlayCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface LessonCardProps {
  title: string;
  description: string;
  href: string;
  lessonCount?: number;
  module?: string;
  className?: string;
}

// Generate a seed from string for deterministic patterns
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Swiss minimal pattern - geometric shapes
function CoursePattern({ seed }: { seed: number }) {
  const hue = 131 + (seed % 20) - 10; // Stay close to primary lime hue

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg,
          oklch(0.85 0.15 ${hue}) 0%,
          oklch(0.7 0.18 ${hue}) 100%)`,
      }}
    >
      {/* Grid lines - Swiss design element */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.2 0 0) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.2 0 0) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />
      {/* Decorative play icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <HugeiconsIcon
          icon={PlayCircle02Icon}
          size={32}
          className="text-white/40"
        />
      </div>
    </div>
  );
}

export function LessonCard({
  title,
  description,
  href,
  lessonCount,
  module,
  className,
}: LessonCardProps) {
  const seed = hashString(title);

  return (
    <Link
      href={href}
      className={cn("group block py-6 cursor-pointer", className)}
    >
      <article className="flex gap-5">
        {/* Pattern thumbnail - Swiss minimal, no rounded corners */}
        <div className="flex-shrink-0 w-24 h-24 bg-muted overflow-hidden">
          <CoursePattern seed={seed} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="space-y-1.5">
            {/* Module tag */}
            {module && (
              <span className="text-swiss-label text-primary">{module}</span>
            )}
            <h3 className="text-swiss-title text-foreground group-hover:text-primary transition-colors duration-150 line-clamp-1">
              {title}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          {/* Swiss minimal footer */}
          <div className="flex items-center justify-between pt-2">
            {lessonCount !== undefined && (
              <span className="text-swiss-label text-muted-foreground">
                {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
              </span>
            )}
            <span className="text-swiss-label group-hover:text-primary transition-colors duration-150 inline-flex items-center gap-1 ml-auto">
              Start
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={12}
                className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default LessonCard;
