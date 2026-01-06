"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import {
  PlayCircle02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCourseProgress } from "@/hooks/useProgress";

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
}: CourseProgressHeaderProps) {
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

  return (
    <motion.div
      className={cn("", className)}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress stats */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-swiss-label text-muted-foreground">
          {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
        </span>

        {completedLessonsCount > 0 && (
          <>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-swiss-label text-primary flex items-center gap-1">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
              {completedLessonsCount} completed
            </span>
          </>
        )}
      </div>

      {/* Progress bar (only show if progress exists) */}
      {completedLessonsCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-base text-muted-foreground mb-2">
            <span>Course progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-1 bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* CTA Button */}
      <Link
        href={continueLessonUrl}
        className="group inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-swiss-label hover:bg-primary/90 transition-colors cursor-pointer"
      >
        <HugeiconsIcon
          icon={isComplete ? CheckmarkCircle02Icon : PlayCircle02Icon}
          size={16}
        />
        {isComplete ? (
          "Review Course"
        ) : continueLesson ? (
          <>
            Continue:{" "}
            <span className="font-normal opacity-90 truncate max-w-[200px]">
              {continueLessonTitle}
            </span>
          </>
        ) : (
          "Start Course"
        )}
      </Link>
    </motion.div>
  );
}

export default CourseProgressHeader;
