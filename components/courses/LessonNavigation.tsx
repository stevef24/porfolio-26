"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface LessonInfo {
  slug: string;
  title: string;
  url: string;
}

interface LessonNavigationProps {
  prevLesson: LessonInfo | null;
  nextLesson: LessonInfo | null;
  courseSlug: string;
  className?: string;
}

export function LessonNavigation({
  prevLesson,
  nextLesson,
  courseSlug,
  className,
}: LessonNavigationProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  // Keyboard navigation (j/k or arrow keys when holding Shift)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      // Shift + Arrow keys for lesson navigation
      if (e.shiftKey) {
        if (e.key === "ArrowLeft" || e.key === "j") {
          e.preventDefault();
          if (prevLesson) {
            router.push(prevLesson.url);
          }
        } else if (e.key === "ArrowRight" || e.key === "k") {
          e.preventDefault();
          if (nextLesson) {
            router.push(nextLesson.url);
          }
        }
      }
    },
    [prevLesson, nextLesson, router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.nav
      className={cn("pt-8 border-t border-border", className)}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      aria-label="Lesson navigation"
    >
      <div className="flex items-center justify-between">
        {/* Previous lesson */}
        {prevLesson ? (
          <Link
            href={prevLesson.url}
            className="group flex flex-col items-start cursor-pointer max-w-[45%]"
          >
            <span className="flex items-center gap-1.5 text-swiss-label text-muted-foreground mb-1">
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={12}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Previous
            </span>
            <span className="text-base text-foreground group-hover:text-primary transition-colors truncate w-full">
              {prevLesson.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {/* Next lesson or completion */}
        {nextLesson ? (
          <Link
            href={nextLesson.url}
            className="group flex flex-col items-end text-right cursor-pointer max-w-[45%]"
          >
            <span className="flex items-center gap-1.5 text-swiss-label text-muted-foreground mb-1">
              Next
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={12}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </span>
            <span className="text-base text-foreground group-hover:text-primary transition-colors truncate w-full">
              {nextLesson.title}
            </span>
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="group flex flex-col items-end text-right cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-swiss-label text-primary mb-1">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
              Complete
            </span>
            <span className="text-base text-foreground group-hover:text-primary transition-colors">
              Back to Course
            </span>
          </Link>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      <div className="mt-4 flex justify-center">
        <span className="text-base text-muted-foreground/60">
          <kbd className="px-1.5 bg-muted">Shift</kbd> +{" "}
          <kbd className="px-1.5 bg-muted">←</kbd>{" "}
          <kbd className="px-1.5 bg-muted">→</kbd> to navigate lessons
        </span>
      </div>
    </motion.nav>
  );
}

export default LessonNavigation;
