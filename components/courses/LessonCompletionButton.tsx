"use client";

import { useCallback } from "react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useLessonProgress } from "@/hooks/useProgress";
import { useSyncProgress } from "@/hooks/useSyncProgress";

interface LessonCompletionButtonProps {
  courseSlug: string;
  lessonSlug: string;
  className?: string;
}

/**
 * Mark lesson as complete button with animated state transitions.
 *
 * States:
 * - Incomplete: Shows empty circle with "Mark Complete" text
 * - Completed: Shows green checkmark with "Completed" text
 *
 * Uses localStorage via useLessonProgress hook.
 */
export function LessonCompletionButton({
  courseSlug,
  lessonSlug,
  className,
}: LessonCompletionButtonProps): JSX.Element {
  const { progress, markCompleted } = useLessonProgress(courseSlug, lessonSlug);
  const { syncNow, isAuthenticated } = useSyncProgress();
  const prefersReducedMotion = useReducedMotion();
  const isCompleted = progress.completed;

  const handleClick = useCallback(async () => {
    if (!isCompleted) {
      markCompleted();

      // Dispatch custom event for sidebar celebration animation
      window.dispatchEvent(
        new CustomEvent("lesson-completed", {
          detail: { courseSlug, lessonSlug },
        })
      );

      // Sync to Supabase for authenticated users
      if (isAuthenticated) {
        // Small delay to ensure localStorage is updated
        setTimeout(() => {
          void syncNow();
        }, 100);
      }
    }
  }, [isCompleted, markCompleted, isAuthenticated, syncNow, courseSlug, lessonSlug]);

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isCompleted}
      className={cn(
        "group relative flex items-center justify-center gap-2 w-full py-3 px-4",
        "text-sm font-medium rounded-full transition-colors",
        "border",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isCompleted
          ? "bg-foreground border-foreground text-background cursor-default"
          : "bg-foreground/[0.05] border-border/80 text-foreground hover:bg-foreground/[0.1] hover:border-border cursor-pointer",
        className
      )}
      whileHover={!isCompleted && !prefersReducedMotion ? { scale: 1.01 } : {}}
      whileTap={!isCompleted && !prefersReducedMotion ? { scale: 0.99 } : {}}
      aria-label={isCompleted ? "Lesson completed" : "Mark lesson as complete"}
    >
      {/* Icon with animated swap */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="completed"
              initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={20}
                className="text-primary"
              />
            </motion.div>
          ) : (
            <motion.div
              key="incomplete"
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="w-5 h-5 rounded-full border-2 border-muted-foreground group-hover:border-primary transition-colors"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Text with animated swap */}
      <AnimatePresence mode="wait">
        {isCompleted ? (
          <motion.span
            key="completed-text"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            Completed
          </motion.span>
        ) : (
          <motion.span
            key="incomplete-text"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            Mark Complete
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default LessonCompletionButton;
