"use client";

import { memo, useEffect, useCallback, useRef, useState } from "react";
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

const LessonItem = memo(function LessonItem({
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

  const statusIcon = isLocked ? (
    <HugeiconsIcon icon={LockIcon} size={12} className="text-foreground/35" />
  ) : isCompleted ? (
    <AnimatePresence mode="wait">
      <motion.span
        key="check"
        initial={wasJustCompleted && !prefersReducedMotion ? { scale: 0 } : false}
        animate={{ scale: 1 }}
        transition={wasJustCompleted ? springBouncy : { duration: 0 }}
        className="inline-flex"
      >
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} className="text-foreground/85" />
      </motion.span>
    </AnimatePresence>
  ) : (
    <span className="text-[10px] font-medium tabular-nums text-foreground/40">
      {String(index + 1).padStart(2, "0")}
    </span>
  );

  return (
    <Link
      ref={itemRef}
      href={lesson.url}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5",
        "text-[13px] leading-5 transition-colors duration-150",
        isActive ? "text-foreground" : "text-foreground/65 hover:text-foreground/90",
        "hover:bg-foreground/[0.04]",
        isLocked && "opacity-55"
      )}
    >
      {isActive && (
        <>
          <motion.span
            layoutId="course-sidebar-active-pill"
            className="absolute inset-0 rounded-md border border-foreground/10 bg-foreground/[0.07]"
            transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
            style={{ zIndex: 0 }}
          />
          <motion.span
            layoutId="course-sidebar-active-rail"
            className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-foreground/80"
            transition={prefersReducedMotion ? { duration: 0 } : springSmooth}
            style={{ zIndex: 0 }}
          />
        </>
      )}

      <span className="relative z-10 flex-1 truncate">{lesson.title}</span>

      <span
        className={cn(
          "relative z-10 inline-flex h-4 min-w-4 items-center justify-center",
          isActive ? "text-foreground/90" : "text-foreground/45"
        )}
      >
        {statusIcon}
      </span>
    </Link>
  );
});

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

  const [recentlyCompleted, setRecentlyCompleted] = useState<
    Record<string, boolean>
  >({});

  // Listen for lesson completion events
  const handleLessonCompleted = useCallback(
    (e: Event) => {
      const customEvent = e as CustomEvent<{
        courseSlug: string;
        lessonSlug?: string;
      }>;
      if (customEvent.detail.courseSlug === courseSlug) {
        if (customEvent.detail.lessonSlug) {
          const lessonSlug = customEvent.detail.lessonSlug;
          setRecentlyCompleted((prev) => ({ ...prev, [lessonSlug]: true }));
          // Clear the "just completed" flag after animation
          setTimeout(() => {
            setRecentlyCompleted((prev) => {
              const next = { ...prev };
              delete next[lessonSlug];
              return next;
            });
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
        "border-r border-border/70",
        "bg-background/92 backdrop-blur-sm",
        "overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-border/70 px-4 py-4">
        <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-foreground/45">
          Course
        </p>

        {/* Top row with overview and close button */}
        <div className="flex items-center justify-between">
          <Link
            href={`/courses/${courseSlug}`}
            className={cn(
              "flex min-w-0 items-center gap-2 text-[13px] font-medium",
              "transition-colors hover:text-foreground",
              pathname === `/courses/${courseSlug}`
                ? "text-foreground"
                : "text-foreground/70"
            )}
          >
            <HugeiconsIcon icon={Home01Icon} size={13} />
            <span className="truncate">Overview</span>
          </Link>
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
              aria-label="Close sidebar"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={13} />
            </button>
          )}
        </div>

        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-foreground/[0.02] px-2 py-1 text-[11px] text-foreground/55">
          <kbd className="rounded border border-border/80 px-1 py-0.5 text-[10px] font-mono leading-none">
            ⌘/Ctrl
          </kbd>
          <kbd className="rounded border border-border/80 px-1 py-0.5 text-[10px] font-mono leading-none">K</kbd>
          <span>Search lessons</span>
        </div>

        {/* Progress bar */}
        {lessons.length > 0 && completedLessonsCount > 0 && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] text-foreground/50">
              <span>{completedLessonsCount}/{lessons.length}</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-foreground/[0.08]">
              <div
                className="h-full rounded-full bg-foreground/80 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Scrollable module list */}
      <motion.div
        className="flex-1 overflow-y-auto py-3"
        style={{ contain: "content" }}
        variants={sidebarContainer}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate="visible"
      >
        {modules.map((module, moduleIndex) => (
          <motion.div
            key={module.name}
            className="mb-5"
            variants={sidebarModule}
            custom={moduleIndex}
          >
            {/* Module Header */}
            <div className="mb-2 px-4">
              <span className="text-[10px] uppercase tracking-[0.12em] text-foreground/45">
                Module {String(module.index).padStart(2, "0")}
              </span>
              <p className="mt-1 text-[12px] leading-snug text-foreground/70">
                {module.name}
              </p>
            </div>

            {/* Lessons */}
            <div className="space-y-0.5 px-2">
              {module.lessons.map((lesson, index) => {
                const isActive = pathname === lesson.url;
                const isCompleted = isLessonCompleted(lesson.slug);
                const wasJustCompleted = Boolean(recentlyCompleted[lesson.slug]);

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

      {/* Footer */}
      <div className="border-t border-border/70 px-4 py-3">
        <p className="text-[11px] leading-relaxed text-foreground/45">
          Keep lessons focused and progress-friendly.
        </p>
      </div>
    </aside>
  );
}

export default CourseSidebarDesktop;
