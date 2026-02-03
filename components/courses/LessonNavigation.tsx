"use client";

import { useCallback, useEffect } from "react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LessonCompletionButton } from "@/components/courses/LessonCompletionButton";

interface LessonInfo {
  slug: string;
  title: string;
  url: string;
}

interface LessonNavigationProps {
  prevLesson: LessonInfo | null;
  nextLesson: LessonInfo | null;
  courseSlug: string;
  lessonSlug: string;
  className?: string;
}

export function LessonNavigation({
  prevLesson,
  nextLesson,
  courseSlug,
  lessonSlug,
  className,
}: LessonNavigationProps): JSX.Element {
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
      {/* Mark Complete Button */}
      <div className="mb-6">
        <LessonCompletionButton
          courseSlug={courseSlug}
          lessonSlug={lessonSlug}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Previous lesson */}
        {prevLesson ? (
          <Link
            href={prevLesson.url}
            className="group flex flex-col items-start cursor-pointer max-w-[45%] rounded-md p-2 -m-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-1.5 text-[15px] text-foreground/50 mb-1">
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={12}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Previous
            </span>
            <span className="text-[15px] text-foreground group-hover:text-primary transition-colors truncate w-full">
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
            className="group flex flex-col items-end text-right cursor-pointer max-w-[45%] rounded-md p-2 -m-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-1.5 text-[15px] text-foreground/50 mb-1">
              Next
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={12}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </span>
            <span className="text-[15px] text-foreground group-hover:text-primary transition-colors truncate w-full">
              {nextLesson.title}
            </span>
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="group flex flex-col items-end text-right cursor-pointer rounded-md p-2 -m-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-1.5 text-[15px] text-primary mb-1">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
              Complete
            </span>
            <span className="text-[15px] text-foreground group-hover:text-primary transition-colors">
              Back to Course
            </span>
          </Link>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      <div className="mt-4 flex justify-center">
        <span className="text-[15px] text-foreground/40">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Shift</kbd>
          {" + "}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">←</kbd>
          {" "}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">→</kbd>
          {" to navigate"}
        </span>
      </div>
    </motion.nav>
  );
}

export default LessonNavigation;
