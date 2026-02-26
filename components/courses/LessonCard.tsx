"use client";

import { ArrowUpRight01Icon, PlayCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { springSmooth } from "@/lib/motion-variants";

interface LessonCardProps {
  title: string;
  description: string;
  href: string;
  lessonCount?: number;
  duration?: string;
  difficulty?: string;
  module?: string;
  className?: string;
  /** Controlled by parent CourseCardList for shared layoutId hover highlight */
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function CoursePattern({ seed }: { seed: number }): JSX.Element {
  const hue = 125 + (seed % 20) - 10;

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg,
          oklch(0.85 0.15 ${hue}) 0%,
          oklch(0.7 0.18 ${hue}) 100%)`,
      }}
    >
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
      <div className="absolute inset-0 flex items-center justify-center">
        <HugeiconsIcon
          icon={PlayCircle02Icon}
          size={32}
          className="text-white/40"
          aria-hidden={true}
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
  duration,
  difficulty,
  module,
  className,
  isHovered = false,
  onHoverChange,
}: LessonCardProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const seed = hashString(title);

  return (
    <div
      className={cn("relative -mx-4", className)}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      {/* Shared layoutId hover highlight */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            layoutId="lessoncard-hover-bg"
            className="absolute inset-0 rounded-[6px]"
            style={{ backgroundColor: "var(--sf-bg-subtle)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
          />
        )}
      </AnimatePresence>

      <Link
        href={href}
        className={cn(
          "group block py-6 px-4 relative z-10",
          "rounded-[6px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <article className="flex gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-muted overflow-hidden">
            <CoursePattern seed={seed} />
          </div>

          <div className="flex-1 min-w-0">
            {module && (
              <span className="text-swiss-label text-foreground/50">{module}</span>
            )}
            <h3 className="text-swiss-body text-foreground font-medium group-hover:text-foreground/70 transition-colors duration-150 line-clamp-1">
              {title}
            </h3>
            <p className="text-swiss-body text-foreground/50 line-clamp-2 mt-1">
              {description}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                {lessonCount !== undefined && (
                  <span className="text-swiss-caption text-foreground/40">
                    {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                  </span>
                )}
                {duration && (
                  <>
                    <span className="text-swiss-caption text-foreground/30">&middot;</span>
                    <span className="text-swiss-caption text-foreground/40">{duration}</span>
                  </>
                )}
                {difficulty && (
                  <>
                    <span className="text-swiss-caption text-foreground/30">&middot;</span>
                    <span className="text-swiss-caption text-foreground/40">{difficulty}</span>
                  </>
                )}
              </div>
              <span className="text-swiss-caption text-foreground/40 group-hover:text-foreground/70 transition-colors duration-150 inline-flex items-center gap-1">
                Start
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={12}
                  className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden={true}
                />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}

export default LessonCard;
