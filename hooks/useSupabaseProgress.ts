"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Supabase Progress Tracking Hook
 *
 * Syncs course progress with Supabase for authenticated users.
 * Works alongside localStorage for anonymous users.
 */

export interface SupabaseProgress {
  id: string;
  user_id: string;
  course_slug: string;
  lesson_slug: string;
  completed: boolean;
  watch_percentage: number;
  last_position: number;
  last_watched: string;
}

interface UseSupabaseLessonProgressReturn {
  progress: SupabaseProgress | null;
  isLoading: boolean;
  error: Error | null;
  updateProgress: (data: {
    watchPercentage: number;
    lastPosition: number;
    completed?: boolean;
  }) => Promise<void>;
  markCompleted: () => Promise<void>;
}

const COMPLETION_THRESHOLD = 0.9;

/**
 * Hook for tracking individual lesson progress in Supabase
 */
export function useSupabaseLessonProgress(
  courseSlug: string,
  lessonSlug: string
): UseSupabaseLessonProgressReturn {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<SupabaseProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabaseConfigured = isSupabaseConfigured();
  const supabase = useMemo(
    () => (supabaseConfigured ? createClient() : null),
    [supabaseConfigured]
  );

  // Load progress from Supabase
  useEffect(() => {
    if (!supabase || !isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    const loadProgress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_slug", courseSlug)
          .eq("lesson_slug", lessonSlug)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 = no rows returned (not an error for us)
          throw new Error(fetchError.message);
        }

        setProgress(data || null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load progress"));
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [supabase, user, isAuthenticated, courseSlug, lessonSlug]);

  // Update progress in Supabase
  const updateProgress = useCallback(
    async (data: {
      watchPercentage: number;
      lastPosition: number;
      completed?: boolean;
    }) => {
      if (!supabase || !isAuthenticated || !user) return;

      try {
        const completed = data.completed ?? data.watchPercentage >= COMPLETION_THRESHOLD;

        const { data: upsertedData, error: upsertError } = await supabase
          .from("progress")
          .upsert(
            {
              user_id: user.id,
              course_slug: courseSlug,
              lesson_slug: lessonSlug,
              watch_percentage: data.watchPercentage,
              last_position: data.lastPosition,
              completed,
              last_watched: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id,course_slug,lesson_slug",
            }
          )
          .select()
          .single();

        if (upsertError) {
          throw new Error(upsertError.message);
        }

        setProgress(upsertedData);
      } catch (err) {
        console.error("Failed to update progress:", err);
        setError(err instanceof Error ? err : new Error("Failed to update progress"));
      }
    },
    [supabase, user, isAuthenticated, courseSlug, lessonSlug]
  );

  // Mark lesson as completed
  const markCompleted = useCallback(async () => {
    await updateProgress({
      watchPercentage: 1,
      lastPosition: progress?.last_position ?? 0,
      completed: true,
    });
  }, [updateProgress, progress?.last_position]);

  return {
    progress,
    isLoading,
    error,
    updateProgress,
    markCompleted,
  };
}

/**
 * Hook for course-level progress aggregation from Supabase
 */
export function useSupabaseCourseProgress(courseSlug: string) {
  const { user, isAuthenticated } = useAuth();
  const [lessonsProgress, setLessonsProgress] = useState<SupabaseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabaseConfigured = isSupabaseConfigured();
  const supabase = useMemo(
    () => (supabaseConfigured ? createClient() : null),
    [supabaseConfigured]
  );

  // Load all lesson progress for the course
  useEffect(() => {
    if (!supabase || !isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    const loadCourseProgress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_slug", courseSlug)
          .order("last_watched", { ascending: false });

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setLessonsProgress(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load course progress"));
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseProgress();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`progress:${courseSlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "progress",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Reload on any change
          loadCourseProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, isAuthenticated, courseSlug]);

  // Check if a specific lesson is completed
  const isLessonCompleted = useCallback(
    (lessonSlug: string): boolean => {
      return lessonsProgress.some(
        (p) => p.lesson_slug === lessonSlug && p.completed
      );
    },
    [lessonsProgress]
  );

  // Get the last watched lesson
  const lastWatchedLesson = useMemo(() => {
    if (lessonsProgress.length === 0) return null;
    return lessonsProgress[0].lesson_slug; // Already sorted by last_watched desc
  }, [lessonsProgress]);

  // Calculate completion percentage
  const completionPercentage = useCallback(
    (totalLessons: number): number => {
      if (totalLessons === 0) return 0;
      const completedCount = lessonsProgress.filter((p) => p.completed).length;
      return (completedCount / totalLessons) * 100;
    },
    [lessonsProgress]
  );

  // Get completed lessons count
  const completedLessonsCount = useMemo(() => {
    return lessonsProgress.filter((p) => p.completed).length;
  }, [lessonsProgress]);

  return {
    lessonsProgress,
    isLoading,
    error,
    isLessonCompleted,
    lastWatchedLesson,
    completionPercentage,
    completedLessonsCount,
  };
}

/**
 * Sync localStorage progress to Supabase (for migration on sign-in)
 */
export async function syncLocalStorageToSupabase(
  userId: string,
  localProgress: Record<string, { lessons: Record<string, {
    completed: boolean;
    watchedPercentage: number;
    lastPosition: number;
    lastWatched: number;
  }> }>
): Promise<{ synced: number; errors: number }> {
  if (!isSupabaseConfigured()) {
    return { synced: 0, errors: 0 };
  }

  const supabase = createClient();

  if (!supabase) {
    return { synced: 0, errors: 0 };
  }

  let synced = 0;
  let errors = 0;

  for (const [courseSlug, courseProgress] of Object.entries(localProgress)) {
    for (const [lessonSlug, lessonProgress] of Object.entries(courseProgress.lessons)) {
      try {
        // Only upsert if local progress is better than existing
        const { error } = await supabase
          .from("progress")
          .upsert(
            {
              user_id: userId,
              course_slug: courseSlug,
              lesson_slug: lessonSlug,
              completed: lessonProgress.completed,
              watch_percentage: lessonProgress.watchedPercentage,
              last_position: lessonProgress.lastPosition,
              last_watched: new Date(lessonProgress.lastWatched).toISOString(),
            },
            {
              onConflict: "user_id,course_slug,lesson_slug",
              ignoreDuplicates: false,
            }
          );

        if (error) {
          errors++;
          console.error(`Failed to sync ${courseSlug}/${lessonSlug}:`, error);
        } else {
          synced++;
        }
      } catch {
        errors++;
      }
    }
  }

  return { synced, errors };
}
