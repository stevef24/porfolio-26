"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckmarkCircle02Icon,
  Home01Icon,
  LockIcon,
  PlayCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useCourseProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AccessLevel } from "@/hooks/useAccess";
import { springBouncy, springSnappy } from "@/lib/motion-variants";
import { Skeleton } from "@/components/ui/skeleton";

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

interface CourseSidebarMobileProps {
  courseSlug: string;
  courseName: string;
  lessons: Lesson[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  onNavigate,
  prefersReducedMotion,
}: {
  lesson: Lesson;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
  onNavigate: () => void;
  prefersReducedMotion: boolean | null;
}): JSX.Element {
  const isLocked = lesson.access === "paid";

  const statusIcon = isLocked ? (
    <HugeiconsIcon
      icon={LockIcon}
      size={12}
      className="text-muted-foreground shrink-0"
    />
  ) : isCompleted ? (
    <HugeiconsIcon
      icon={CheckmarkCircle02Icon}
      size={12}
      className="text-foreground/80 shrink-0"
    />
  ) : isActive ? (
    <HugeiconsIcon
      icon={PlayCircle02Icon}
      size={12}
      className="text-foreground/80 shrink-0"
    />
  ) : (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-xs font-medium tabular-nums text-muted-foreground">
      {String(index + 1).padStart(2, "0")}
    </span>
  );

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { x: 2 }}
      transition={springSnappy}
    >
      <Link
        href={lesson.url}
        onClick={onNavigate}
        className={cn(
          "relative flex min-h-11 items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer",
          "text-sm leading-5",
          "hover:bg-sidebar-accent/70 active:bg-sidebar-accent/80",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar",
          isActive && "bg-sidebar-accent/80 text-foreground font-medium",
          !isActive && "text-muted-foreground",
          isLocked && "opacity-60"
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-foreground/80" />
        )}
        <span className={cn("flex-1 leading-snug", isLocked && "text-muted-foreground")}>
          {lesson.title}
        </span>
        <span>{statusIcon}</span>
      </Link>
    </motion.div>
  );
}

// ==========================================
// SKELETON COMPONENT
// ==========================================

function SidebarSkeleton(): JSX.Element {
  return (
    <div className="py-2">
      {[1, 2].map((moduleIndex) => (
        <div key={moduleIndex} className="mb-4">
          <div className="px-4 py-2">
            <Skeleton className="h-2.5 w-16 mb-1.5" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="px-1 space-y-1">
            {[1, 2, 3].slice(0, moduleIndex === 1 ? 3 : 2).map((i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2.5">
                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-full max-w-[180px]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function CourseSidebarMobile({
  courseSlug,
  courseName,
  lessons,
  open,
  onOpenChange,
}: CourseSidebarMobileProps): JSX.Element {
  const pathname = usePathname();
  const modules = groupLessonsByModule(lessons);
  const { isLessonCompleted, completedLessonsCount, refreshProgress } =
    useCourseProgress(courseSlug);
  const prefersReducedMotion = useReducedMotion();

  // Celebration pulse state
  const [isPulsing, setIsPulsing] = useState(false);

  // Listen for lesson completion events to trigger celebration
  const handleLessonCompleted = useCallback(
    (e: Event) => {
      const customEvent = e as CustomEvent<{ courseSlug: string }>;
      if (customEvent.detail.courseSlug === courseSlug) {
        refreshProgress();
        if (!prefersReducedMotion) {
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 600);
        }
      }
    },
    [courseSlug, refreshProgress, prefersReducedMotion]
  );

  useEffect(() => {
    window.addEventListener("lesson-completed", handleLessonCompleted);
    return () =>
      window.removeEventListener("lesson-completed", handleLessonCompleted);
  }, [handleLessonCompleted]);

  const progressPercentage =
    lessons.length > 0
      ? Math.round((completedLessonsCount / lessons.length) * 100)
      : 0;

  const handleNavigate = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] p-0 bg-sidebar">
        <SheetHeader className="border-b border-sidebar-border/70 px-4 py-4">
          <p className="text-swiss-meta tracking-[0.12em] text-muted-foreground">Course</p>
          <SheetTitle className="text-left text-sm font-medium">
            {courseName}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-60px)]">
          {/* Course Overview Link */}
          <Link
            href={`/courses/${courseSlug}`}
            onClick={handleNavigate}
            className={cn(
              "flex items-center gap-2 border-b border-sidebar-border/70 px-4 py-3 text-sm",
              "hover:bg-sidebar-accent/60 transition-colors cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
              pathname === `/courses/${courseSlug}` &&
                "bg-sidebar-accent/70 font-medium"
            )}
          >
            <HugeiconsIcon icon={Home01Icon} size={16} />
            <span>Course Overview</span>
          </Link>

          {/* Progress indicator */}
          {lessons.length > 0 && (
            <div className="px-4 py-3 border-b border-sidebar-border/70">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {completedLessonsCount} / {lessons.length} completed
                </span>
                <span>{progressPercentage}%</span>
              </div>
              <motion.div
                className="h-1 bg-muted rounded-full overflow-hidden"
                animate={
                  isPulsing
                    ? { scale: [1, 1.08, 1] }
                    : { scale: 1 }
                }
                transition={springBouncy}
              >
                <motion.div
                  className={cn(
                    "h-full bg-primary rounded-full",
                    isPulsing && "shadow-[0_0_8px_2px_rgba(111,124,90,0.5)]"
                  )}
                  initial={false}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.div>
            </div>
          )}

          {/* Scrollable module list */}
          <div className="flex-1 overflow-y-auto py-2">
            {lessons.length === 0 ? (
              <SidebarSkeleton />
            ) : (
              modules.map((module) => (
                <div key={module.name} className="mb-4">
                  <div className="px-4 py-2">
                    <span className="text-swiss-meta tracking-[0.12em] text-muted-foreground">
                      Module {String(module.index).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 text-sm font-medium leading-tight text-foreground/80">
                      {module.name}
                    </h3>
                  </div>

                  <div className="px-1 space-y-0.5">
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
                          onNavigate={handleNavigate}
                          prefersReducedMotion={prefersReducedMotion}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CourseSidebarMobile;
