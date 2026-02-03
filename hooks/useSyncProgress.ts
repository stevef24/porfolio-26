"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getLocalStorageProgressForSync } from "@/hooks/useProgress";

interface SyncState {
  isSyncing: boolean;
  lastSynced: Date | null;
  error: string | null;
}

interface SyncResult {
  ok: boolean;
  synced?: number;
  errors?: number;
  error?: string;
}

/**
 * Hook for syncing progress to Supabase.
 *
 * Features:
 * - Auto-syncs on page visibility change (debounced)
 * - Provides syncNow() for immediate sync
 * - Only syncs for authenticated users
 * - Tracks sync status for UI feedback
 */
export function useSyncProgress() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSynced: null,
    error: null,
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Sync progress to Supabase
  const syncToServer = useCallback(async (): Promise<SyncResult> => {
    // Don't sync if not authenticated
    if (!isAuthenticated) {
      return { ok: false, error: "Not authenticated" };
    }

    // Get localStorage progress
    const courses = getLocalStorageProgressForSync();

    // Don't sync if nothing to sync
    if (Object.keys(courses).length === 0) {
      return { ok: true, synced: 0 };
    }

    try {
      const response = await fetch("/api/progress/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses }),
      });

      const result: SyncResult = await response.json();
      return result;
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Sync failed",
      };
    }
  }, [isAuthenticated]);

  // Immediate sync with status tracking
  const syncNow = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || syncState.isSyncing) {
      return false;
    }

    setSyncState((prev) => ({ ...prev, isSyncing: true, error: null }));

    const result = await syncToServer();

    if (isMountedRef.current) {
      setSyncState({
        isSyncing: false,
        lastSynced: result.ok ? new Date() : syncState.lastSynced,
        error: result.ok ? null : result.error || "Sync failed",
      });
    }

    return result.ok;
  }, [isAuthenticated, syncState.isSyncing, syncState.lastSynced, syncToServer]);

  // Debounced sync (for auto-sync on visibility change)
  const syncDebounced = useCallback(
    (delayMs = 2000) => {
      if (!isAuthenticated) return;

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        void syncNow();
      }, delayMs);
    },
    [isAuthenticated, syncNow]
  );

  // Auto-sync on visibility change (user leaving page)
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // User is leaving - sync with short debounce
        syncDebounced(500);
      }
    };

    const handleBeforeUnload = () => {
      // Sync immediately on page unload
      // Use sendBeacon for reliability
      if (isAuthenticated) {
        const courses = getLocalStorageProgressForSync();
        if (Object.keys(courses).length > 0) {
          navigator.sendBeacon(
            "/api/progress/sync",
            JSON.stringify({ courses })
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [authLoading, isAuthenticated, syncDebounced]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    syncNow,
    syncDebounced,
    isSyncing: syncState.isSyncing,
    lastSynced: syncState.lastSynced,
    syncError: syncState.error,
    isAuthenticated,
  };
}

/**
 * Fetch progress from Supabase and merge with localStorage.
 * Called on login to hydrate localStorage from server.
 */
export async function hydrateProgressFromServer(): Promise<boolean> {
  try {
    const response = await fetch("/api/progress/sync", {
      method: "GET",
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();

    if (!result.ok || !result.courses) {
      return false;
    }

    // Merge server progress with localStorage
    // Server wins for completed lessons, keep best watch percentage
    const STORAGE_KEY = "course-progress";
    const STORAGE_VERSION = 1;

    // Get current localStorage
    let localStore: {
      courses: Record<string, { lessons: Record<string, unknown> }>;
      version: number;
    } = { courses: {}, version: STORAGE_VERSION };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === STORAGE_VERSION) {
          localStore = parsed;
        }
      }
    } catch {
      // Continue with empty store
    }

    // Merge server progress into localStorage
    for (const [courseSlug, courseData] of Object.entries(result.courses)) {
      const serverCourse = courseData as {
        lessons: Record<
          string,
          {
            completed: boolean;
            watchPercentage: number;
            lastPosition: number;
            lastWatched: string;
          }
        >;
      };

      if (!localStore.courses[courseSlug]) {
        localStore.courses[courseSlug] = {
          courseSlug,
          lessons: {},
          lastLessonSlug: null,
          lastUpdated: Date.now(),
        } as unknown as { lessons: Record<string, unknown> };
      }

      for (const [lessonSlug, serverLesson] of Object.entries(
        serverCourse.lessons
      )) {
        const localLesson = localStore.courses[courseSlug]?.lessons?.[
          lessonSlug
        ] as
          | {
              completed?: boolean;
              watchedPercentage?: number;
              lastPosition?: number;
              lastWatched?: number;
            }
          | undefined;

        // Merge: server completed wins, keep best watch percentage
        const mergedLesson = {
          lessonSlug,
          completed: serverLesson.completed || localLesson?.completed || false,
          watchedPercentage: Math.max(
            serverLesson.watchPercentage || 0,
            localLesson?.watchedPercentage || 0
          ),
          lastPosition:
            serverLesson.lastPosition || localLesson?.lastPosition || 0,
          lastWatched: Math.max(
            new Date(serverLesson.lastWatched).getTime() || 0,
            localLesson?.lastWatched || 0
          ),
        };

        localStore.courses[courseSlug].lessons[lessonSlug] = mergedLesson;
      }
    }

    // Save merged progress
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localStore));

    return true;
  } catch (err) {
    console.error("Failed to hydrate progress:", err);
    return false;
  }
}
