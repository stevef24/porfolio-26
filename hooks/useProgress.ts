"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Progress Tracking Hook
 *
 * Tracks course and lesson progress using localStorage.
 * Features:
 * - Lesson completion status
 * - Video watch percentage
 * - Last watched position for resume playback
 * - Last watched lesson for "continue where you left off"
 */

// Types for progress data
export interface LessonProgress {
  lessonSlug: string;
  completed: boolean;
  watchedPercentage: number;
  lastPosition: number; // in seconds
  lastWatched: number; // timestamp
}

export interface CourseProgress {
  courseSlug: string;
  lessons: Record<string, LessonProgress>;
  lastLessonSlug: string | null;
  lastUpdated: number;
}

interface ProgressStore {
  courses: Record<string, CourseProgress>;
  version: number;
}

const STORAGE_KEY = "course-progress";
const STORAGE_VERSION = 1;
const COMPLETION_THRESHOLD = 0.9; // 90% watched = completed

// Storage utilities
function getProgressStore(): ProgressStore {
  if (typeof window === "undefined") {
    return { courses: {}, version: STORAGE_VERSION };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === STORAGE_VERSION) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error reading progress from localStorage:", error);
  }

  return { courses: {}, version: STORAGE_VERSION };
}

function saveProgressStore(store: ProgressStore): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("Error saving progress to localStorage:", error);
  }
}

// Hook for tracking progress of a specific lesson
export function useLessonProgress(courseSlug: string, lessonSlug: string) {
  const [progress, setProgress] = useState<LessonProgress>({
    lessonSlug,
    completed: false,
    watchedPercentage: 0,
    lastPosition: 0,
    lastWatched: 0,
  });

  // Load initial progress
  useEffect(() => {
    const store = getProgressStore();
    const courseProgress = store.courses[courseSlug];
    const lessonProgress = courseProgress?.lessons[lessonSlug];

    if (lessonProgress) {
      setProgress(lessonProgress);
    }
  }, [courseSlug, lessonSlug]);

  // Update video progress (called during playback)
  const updateVideoProgress = useCallback(
    (currentTime: number, duration: number) => {
      if (duration <= 0) return;

      const watchedPercentage = currentTime / duration;
      const completed = watchedPercentage >= COMPLETION_THRESHOLD;

      setProgress((prev) => {
        const newProgress: LessonProgress = {
          lessonSlug,
          completed: prev.completed || completed,
          watchedPercentage: Math.max(prev.watchedPercentage, watchedPercentage),
          lastPosition: currentTime,
          lastWatched: Date.now(),
        };

        // Save to localStorage
        const store = getProgressStore();
        if (!store.courses[courseSlug]) {
          store.courses[courseSlug] = {
            courseSlug,
            lessons: {},
            lastLessonSlug: null,
            lastUpdated: Date.now(),
          };
        }
        store.courses[courseSlug].lessons[lessonSlug] = newProgress;
        store.courses[courseSlug].lastLessonSlug = lessonSlug;
        store.courses[courseSlug].lastUpdated = Date.now();
        saveProgressStore(store);

        return newProgress;
      });
    },
    [courseSlug, lessonSlug]
  );

  // Mark lesson as complete manually
  const markCompleted = useCallback(() => {
    setProgress((prev) => {
      const newProgress: LessonProgress = {
        ...prev,
        completed: true,
        watchedPercentage: 1,
        lastWatched: Date.now(),
      };

      const store = getProgressStore();
      if (!store.courses[courseSlug]) {
        store.courses[courseSlug] = {
          courseSlug,
          lessons: {},
          lastLessonSlug: null,
          lastUpdated: Date.now(),
        };
      }
      store.courses[courseSlug].lessons[lessonSlug] = newProgress;
      store.courses[courseSlug].lastUpdated = Date.now();
      saveProgressStore(store);

      return newProgress;
    });
  }, [courseSlug, lessonSlug]);

  // Reset lesson progress
  const resetProgress = useCallback(() => {
    const initialProgress: LessonProgress = {
      lessonSlug,
      completed: false,
      watchedPercentage: 0,
      lastPosition: 0,
      lastWatched: Date.now(),
    };

    setProgress(initialProgress);

    const store = getProgressStore();
    if (store.courses[courseSlug]?.lessons[lessonSlug]) {
      store.courses[courseSlug].lessons[lessonSlug] = initialProgress;
      saveProgressStore(store);
    }
  }, [courseSlug, lessonSlug]);

  return {
    progress,
    updateVideoProgress,
    markCompleted,
    resetProgress,
  };
}

// Hook for tracking overall course progress
export function useCourseProgress(courseSlug: string) {
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(
    null
  );

  // Load course progress
  useEffect(() => {
    const store = getProgressStore();
    const progress = store.courses[courseSlug];
    setCourseProgress(progress || null);

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const newStore = getProgressStore();
        setCourseProgress(newStore.courses[courseSlug] || null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [courseSlug]);

  // Get completion status for a specific lesson
  const isLessonCompleted = useCallback(
    (lessonSlug: string): boolean => {
      return courseProgress?.lessons[lessonSlug]?.completed || false;
    },
    [courseProgress]
  );

  // Get the last watched lesson for "continue where you left off"
  const lastWatchedLesson = useMemo(() => {
    return courseProgress?.lastLessonSlug || null;
  }, [courseProgress]);

  // Calculate overall course completion percentage
  const completionPercentage = useCallback(
    (totalLessons: number): number => {
      if (!courseProgress || totalLessons === 0) return 0;

      const completedCount = Object.values(courseProgress.lessons).filter(
        (l) => l.completed
      ).length;

      return (completedCount / totalLessons) * 100;
    },
    [courseProgress]
  );

  // Get count of completed lessons
  const completedLessonsCount = useMemo(() => {
    if (!courseProgress) return 0;
    return Object.values(courseProgress.lessons).filter((l) => l.completed)
      .length;
  }, [courseProgress]);

  // Get all lesson progress data
  const lessonsProgress = useMemo(() => {
    return courseProgress?.lessons || {};
  }, [courseProgress]);

  // Reset all course progress
  const resetCourseProgress = useCallback(() => {
    const store = getProgressStore();
    delete store.courses[courseSlug];
    saveProgressStore(store);
    setCourseProgress(null);
  }, [courseSlug]);

  // Manually refresh progress from localStorage (for same-tab updates)
  const refreshProgress = useCallback(() => {
    const store = getProgressStore();
    setCourseProgress(store.courses[courseSlug] || null);
  }, [courseSlug]);

  return {
    courseProgress,
    isLessonCompleted,
    lastWatchedLesson,
    completionPercentage,
    completedLessonsCount,
    lessonsProgress,
    resetCourseProgress,
    refreshProgress,
  };
}

// Hook to get resume position for a video
export function useResumePosition(courseSlug: string, lessonSlug: string) {
  const [resumePosition, setResumePosition] = useState<number>(0);

  useEffect(() => {
    const store = getProgressStore();
    const lessonProgress =
      store.courses[courseSlug]?.lessons[lessonSlug];

    if (lessonProgress) {
      // Only resume if they haven't completed and watched > 5 seconds
      if (!lessonProgress.completed && lessonProgress.lastPosition > 5) {
        setResumePosition(lessonProgress.lastPosition);
      }
    }
  }, [courseSlug, lessonSlug]);

  const clearResumePosition = useCallback(() => {
    setResumePosition(0);
  }, []);

  return { resumePosition, clearResumePosition };
}

/**
 * Get all localStorage progress data for Supabase sync
 */
export function getLocalStorageProgressForSync(): ProgressStore["courses"] {
  const store = getProgressStore();
  return store.courses;
}

/**
 * Clear localStorage progress after successful sync
 */
export function clearLocalStorageProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}
