"use client";

import { useEffect, useCallback } from "react";
import {
  CheckmarkCircle02Icon,
  Home01Icon,
  LockIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import type { AccessLevel } from "@/hooks/useAccess";

// ==========================================
// TYPES
// ==========================================

export interface Lesson {
  slug: string;
  title: string;
  module: string;
  order: number;
  url: string;
  access?: AccessLevel;
}

interface ModuleGroup {
  name: string;
  index: number;
  lessons: Lesson[];
}

interface CourseSidebarDesktopProps {
  courseSlug: string;
  lessons: Lesson[];
  className?: string;
  onCollapse?: () => void;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function groupLessonsByModule(lessons: Lesson[]): ModuleGroup[] {
  const groups: Record<string, Lesson[]> = {};

  lessons.forEach((lesson) => {
    const moduleName = lesson.module || "Lessons";
    if (!groups[moduleName]) {
      groups[moduleName] = [];
    }
    groups[moduleName].push(lesson);
  });

  // Sort lessons within each module by order
  Object.values(groups).forEach((group) => {
    group.sort((a, b) => a.order - b.order);
  });

  return Object.entries(groups).map(([name, lessons], index) => ({
    name,
    index: index + 1,
    lessons,
  }));
}

// ==========================================
// LESSON ITEM COMPONENT
// ==========================================

function LessonItem({
  lesson,
  isActive,
  isCompleted,
  index,
}: {
  lesson: Lesson;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}): JSX.Element {
  const isLocked = lesson.access === "paid";

  return (
    <Link
      href={lesson.url}
      className={cn(
        "flex items-start gap-3 px-3 py-2 text-[15px] transition-colors duration-150",
        "hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]",
        "rounded-[4px]",
        isActive && "bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.06)]",
        isActive ? "text-foreground font-medium" : "text-foreground/60",
        isLocked && "opacity-50"
      )}
    >
      {/* Status indicator */}
      <span className="mt-0.5 w-4 h-4 flex items-center justify-center shrink-0">
        {isLocked ? (
          <HugeiconsIcon icon={LockIcon} size={12} className="text-foreground/40" />
        ) : isCompleted ? (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-foreground" />
        ) : (
          <span className="text-[15px] text-foreground/50">{index + 1}</span>
        )}
      </span>
      <span className="leading-snug">{lesson.title}</span>
    </Link>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function CourseSidebarDesktop({
  courseSlug,
  lessons,
  className,
  onCollapse,
}: CourseSidebarDesktopProps): JSX.Element {
  const pathname = usePathname();
  const modules = groupLessonsByModule(lessons);
  const { isLessonCompleted, completedLessonsCount, refreshProgress } =
    useCourseProgress(courseSlug);

  // Listen for lesson completion events
  const handleLessonCompleted = useCallback(
    (e: Event) => {
      const customEvent = e as CustomEvent<{ courseSlug: string }>;
      if (customEvent.detail.courseSlug === courseSlug) {
        refreshProgress();
      }
    },
    [courseSlug, refreshProgress]
  );

  useEffect(() => {
    window.addEventListener("lesson-completed", handleLessonCompleted);
    return () =>
      window.removeEventListener("lesson-completed", handleLessonCompleted);
  }, [handleLessonCompleted]);

  // Calculate progress percentage
  const progressPercentage =
    lessons.length > 0
      ? Math.round((completedLessonsCount / lessons.length) * 100)
      : 0;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col",
        "w-[var(--course-sidebar-width)] min-w-[var(--course-sidebar-width)]",
        "h-screen sticky top-0",
        "border-r border-border",
        "bg-background",
        "overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        {/* Top row with overview and close button */}
        <div className="flex items-center justify-between">
          <Link
            href={`/courses/${courseSlug}`}
            className={cn(
              "flex items-center gap-2 text-[15px] font-medium",
              "hover:text-foreground transition-colors",
              pathname === `/courses/${courseSlug}`
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            <HugeiconsIcon icon={Home01Icon} size={14} />
            <span>Overview</span>
          </Link>
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              aria-label="Close sidebar"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {lessons.length > 0 && completedLessonsCount > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[15px] text-foreground/50 mb-1">
              <span>{completedLessonsCount}/{lessons.length}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-1 bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Scrollable module list */}
      <div className="flex-1 overflow-y-auto py-4">
        {modules.map((module) => (
          <div key={module.name} className="mb-6">
            {/* Module Header */}
            <div className="px-4 mb-2">
              <span className="text-[15px] text-foreground/50 uppercase tracking-wide">
                {module.name}
              </span>
            </div>

            {/* Lessons */}
            <div className="px-2 space-y-0.5">
              {module.lessons.map((lesson, index) => {
                const isActive = pathname === lesson.url;
                const isCompleted = isLessonCompleted(lesson.slug);

                return (
                  <LessonItem
                    key={lesson.slug}
                    lesson={lesson}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default CourseSidebarDesktop;
