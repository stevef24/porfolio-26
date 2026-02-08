"use client";

import { useEffect, useCallback, useRef } from "react";
import {
  CheckmarkCircle02Icon,
  Home01Icon,
  LockIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import {
  sidebarContainer,
  sidebarModule,
  sidebarItem,
  springSmooth,
  springBouncy,
} from "@/lib/motion-variants";
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
  wasJustCompleted,
  index,
  prefersReducedMotion,
}: {
  lesson: Lesson;
  isActive: boolean;
  isCompleted: boolean;
  wasJustCompleted: boolean;
  index: number;
  prefersReducedMotion: boolean | null;
}): JSX.Element {
  const isLocked = lesson.access === "paid";
  const itemRef = useRef<HTMLAnchorElement>(null);

  // Auto-scroll active lesson into view
  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest",
      });
    }
  }, [isActive, prefersReducedMotion]);

  return (
    <Link
      ref={itemRef}
      href={lesson.url}
      className={cn(
        "relative flex items-start gap-3 px-3 py-2 text-swiss-body transition-colors duration-150",
        "hover:bg-[var(--sf-bg-subtle)]",
        "rounded-[4px]",
        isActive ? "text-foreground font-medium" : "text-foreground/60",
        isLocked && "opacity-50"
      )}
    >
      {/* Animated active indicator - slides between active items */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-[var(--sf-bg-muted)] rounded-[4px]"
          transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
          style={{ zIndex: 0 }}
        />
      )}

      {/* Status indicator */}
      <span className="relative z-10 mt-0.5 w-4 h-4 flex items-center justify-center shrink-0">
        {isLocked ? (
          <HugeiconsIcon icon={LockIcon} size={12} className="text-foreground/40" />
        ) : isCompleted ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="check"
              initial={
                wasJustCompleted && !prefersReducedMotion
                  ? { scale: 0 }
                  : false
              }
              animate={{ scale: 1 }}
              transition={
                wasJustCompleted ? springBouncy : { duration: 0 }
              }
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={14}
                className="text-foreground"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <span className="text-swiss-caption text-foreground/50">
            {index + 1}
          </span>
        )}
      </span>
      <span className="relative z-10 leading-snug">{lesson.title}</span>
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

  // Track which lessons were just completed (for bounce animation)
  const recentlyCompletedRef = useRef<Set<string>>(new Set());

  // Listen for lesson completion events
  const handleLessonCompleted = useCallback(
    (e: Event) => {
      const customEvent = e as CustomEvent<{
        courseSlug: string;
        lessonSlug?: string;
      }>;
      if (customEvent.detail.courseSlug === courseSlug) {
        if (customEvent.detail.lessonSlug) {
          recentlyCompletedRef.current.add(customEvent.detail.lessonSlug);
          // Clear the "just completed" flag after animation
          setTimeout(() => {
            recentlyCompletedRef.current.delete(
              customEvent.detail.lessonSlug!
            );
          }, 1000);
        }
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
  const prefersReducedMotion = useReducedMotion();

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
              "flex items-center gap-2 text-swiss-body font-medium",
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
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-[var(--sf-bg-subtle)] transition-colors"
              aria-label="Close sidebar"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {lessons.length > 0 && completedLessonsCount > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-swiss-caption text-foreground/50 mb-1">
              <span>{completedLessonsCount}/{lessons.length}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-1 bg-[var(--sf-bg-muted)] rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Scrollable module list */}
      <motion.div
        className="flex-1 overflow-y-auto py-4"
        variants={sidebarContainer}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate="visible"
      >
        {modules.map((module, moduleIndex) => (
          <motion.div
            key={module.name}
            className="mb-6"
            variants={sidebarModule}
            custom={moduleIndex}
          >
            {/* Module Header */}
            <div className="px-4 mb-2">
              <span className="text-swiss-label text-foreground/50">
                {module.name}
              </span>
            </div>

            {/* Lessons */}
            <div className="px-2 space-y-0.5">
              {module.lessons.map((lesson, index) => {
                const isActive = pathname === lesson.url;
                const isCompleted = isLessonCompleted(lesson.slug);
                const wasJustCompleted =
                  recentlyCompletedRef.current.has(lesson.slug);

                return (
                  <motion.div key={lesson.slug} variants={sidebarItem}>
                    <LessonItem
                      lesson={lesson}
                      isActive={isActive}
                      isCompleted={isCompleted}
                      wasJustCompleted={wasJustCompleted}
                      index={index}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer - keyboard shortcut hint */}
      <div className="px-4 py-3 border-t border-border">
        <span className="flex items-center justify-center gap-1.5 text-swiss-caption text-foreground/40">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
            {typeof navigator !== "undefined" &&
            /Mac/.test(navigator.userAgent)
              ? "\u2318"
              : "Ctrl"}
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
            K
          </kbd>
          <span className="ml-0.5">to search</span>
        </span>
      </div>
    </aside>
  );
}

export default CourseSidebarDesktop;
