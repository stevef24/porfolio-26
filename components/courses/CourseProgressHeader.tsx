"use client";

import type { ReactNode } from "react";
import {
  CheckmarkCircle02Icon,
  PlayCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCourseProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import { springSmooth } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";

interface Lesson {
  slug: string;
  title: string;
  url: string;
}

interface CourseProgressHeaderProps {
  courseSlug: string;
  lessons: Lesson[];
  firstLessonUrl: string;
  className?: string;
}

export function CourseProgressHeader({
  courseSlug,
  lessons,
  firstLessonUrl,
  className,
}: CourseProgressHeaderProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const {
    lastWatchedLesson,
    completedLessonsCount,
    completionPercentage,
  } = useCourseProgress(courseSlug);

  const progressPercent = completionPercentage(lessons.length);
  const isComplete = progressPercent === 100;

  // Find the last watched lesson data
  const continueLesson = lastWatchedLesson
    ? lessons.find((l) => l.slug === lastWatchedLesson)
    : null;

  // Determine which lesson to continue from
  const continueLessonUrl = continueLesson?.url || firstLessonUrl;
  const continueLessonTitle = continueLesson?.title || "Start Course";
  let ctaContent: ReactNode;

  if (isComplete) {
    ctaContent = "Review Course";
  } else if (continueLesson) {
    ctaContent = (
      <>
        Continue:{" "}
        <span className="font-normal opacity-90 truncate max-w-[200px]">
          {continueLessonTitle}
        </span>
      </>
    );
  } else {
    ctaContent = "Start Course";
  }

  return (
    <motion.div
      className={cn("", className)}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springSmooth}
    >
      {/* Progress stats */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-swiss-caption text-foreground/50">
          {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
        </span>

        {completedLessonsCount > 0 && (
          <>
            <span className="text-foreground/30">•</span>
            <span className="text-swiss-body text-foreground flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
              {completedLessonsCount} completed
            </span>
          </>
        )}
      </div>

      {/* Progress bar (only show if progress exists) */}
      {completedLessonsCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-swiss-caption text-foreground/60 mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-1 bg-[var(--sf-bg-muted)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={springSmooth}
            />
          </div>
        </div>
      )}

      {/* CTA Button */}
      <Button asChild variant="cta" size="sm" className="group gap-2">
        <Link href={continueLessonUrl}>
          <HugeiconsIcon
            icon={isComplete ? CheckmarkCircle02Icon : PlayCircle02Icon}
            size={16}
          />
          {ctaContent}
        </Link>
      </Button>
    </motion.div>
  );
}

export default CourseProgressHeader;
