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

  let statusIcon: JSX.Element;
  if (isLocked) {
    statusIcon = (
      <HugeiconsIcon
        icon={LockIcon}
        size={14}
        className="text-muted-foreground shrink-0"
      />
    );
  } else if (isCompleted) {
    statusIcon = (
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        size={14}
        className="text-primary shrink-0"
      />
    );
  } else if (isActive) {
    statusIcon = (
      <HugeiconsIcon
        icon={PlayCircle02Icon}
        size={14}
        className="text-primary shrink-0"
      />
    );
  } else {
    statusIcon = (
      <span className="w-4 h-4 flex items-center justify-center text-xs text-muted-foreground shrink-0">
        {index + 1}
      </span>
    );
  }

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { x: 2 }}
      transition={springSnappy}
    >
      <Link
        href={lesson.url}
        onClick={onNavigate}
        className={cn(
          "flex items-start gap-2 px-3 py-2.5 text-sm rounded-md transition-colors cursor-pointer",
          "hover:bg-sidebar-accent active:bg-sidebar-accent",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar",
          isActive && "bg-sidebar-accent text-foreground font-medium",
          !isActive && "text-muted-foreground",
          isLocked && "opacity-60"
        )}
      >
        <span className="mt-0.5">{statusIcon}</span>
        <span className={cn("leading-snug", isLocked && "text-muted-foreground")}>
          {lesson.title}
        </span>
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
      <SheetContent side="left" className="w-[280px] p-0 bg-sidebar">
        <SheetHeader className="border-b border-sidebar-border px-4 py-4">
          <SheetTitle className="text-left text-base font-medium">
            {courseName}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-60px)]">
          {/* Course Overview Link */}
          <Link
            href={`/courses/${courseSlug}`}
            onClick={handleNavigate}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm border-b border-sidebar-border",
              "hover:bg-sidebar-accent transition-colors cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
              pathname === `/courses/${courseSlug}` &&
                "bg-sidebar-accent font-medium"
            )}
          >
            <HugeiconsIcon icon={Home01Icon} size={16} />
            <span>Course Overview</span>
          </Link>

          {/* Progress indicator */}
          {lessons.length > 0 && (
            <div className="px-4 py-3 border-b border-sidebar-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
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
                    <span className="text-swiss-meta">
                      Module {String(module.index).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-medium text-foreground mt-0.5 leading-tight">
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
