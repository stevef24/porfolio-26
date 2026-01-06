"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getLocalStorageProgressForSync,
  clearLocalStorageProgress,
} from "@/hooks/useProgress";

interface CourseInfo {
  slug: string;
  title: string;
  description: string;
  totalLessons: number;
  url: string;
}

interface CourseProgressData {
  completedCount: number;
  lastLesson: string | null;
  lastWatched: string | null;
}

interface DashboardContentProps {
  courses: CourseInfo[];
  progress: Record<string, CourseProgressData>;
  userEmail: string;
}

export function DashboardContent({
  courses,
  progress,
  userEmail,
}: DashboardContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Sync localStorage progress on mount
  useEffect(() => {
    const syncLocalProgress = async () => {
      const localProgress = getLocalStorageProgressForSync();

      // Check if there's any local progress to sync
      const hasLocalProgress = Object.keys(localProgress).length > 0;
      if (!hasLocalProgress) return;

      setIsSyncing(true);
      setSyncMessage("Syncing your progress...");

      try {
        const response = await fetch("/api/progress/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courses: localProgress }),
        });

        const result = await response.json();

        if (result.ok) {
          // Clear localStorage after successful sync
          clearLocalStorageProgress();
          setSyncMessage(
            result.synced > 0
              ? `Synced ${result.synced} lesson${result.synced > 1 ? "s" : ""} from this device`
              : null
          );
        } else {
          setSyncMessage("Failed to sync progress");
        }
      } catch {
        setSyncMessage("Failed to sync progress");
      } finally {
        setIsSyncing(false);
        // Clear message after 3 seconds
        setTimeout(() => setSyncMessage(null), 3000);
      }
    };

    syncLocalProgress();
  }, []);

  return (
    <main className="py-16">
      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <p className="text-swiss-label text-muted-foreground mb-2">
            Dashboard
          </p>
          <h1 className="text-swiss-hero mb-4">Your Learning Progress</h1>
          <p className="text-muted-foreground text-base">
            Signed in as{" "}
            <span className="text-foreground font-medium">{userEmail}</span>
          </p>
        </motion.div>

        {/* Sync message */}
        {syncMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mb-6 p-4 text-base border",
              isSyncing
                ? "bg-muted/50 border-border"
                : "bg-primary/5 border-primary/20"
            )}
          >
            {isSyncing && <SyncIcon className="inline-block size-4 mr-2 animate-spin" />}
            {syncMessage}
          </motion.div>
        )}

        {/* Courses grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No courses available yet.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Browse Home</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course, index) => {
              const courseProgress = progress[course.slug];
              const completedCount = courseProgress?.completedCount || 0;
              const percentage =
                course.totalLessons > 0
                  ? Math.round((completedCount / course.totalLessons) * 100)
                  : 0;
              const lastLesson = courseProgress?.lastLesson;

              return (
                <motion.div
                  key={course.slug}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border border-border bg-background p-6 group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-swiss-subheading mb-1 group-hover:text-primary transition-colors">
                        {course.title}
                      </h2>
                      {course.description && (
                        <p className="text-base text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-2xl font-medium tabular-nums">
                        {percentage}%
                      </p>
                      <p className="text-base text-muted-foreground">
                        {completedCount}/{course.totalLessons} lessons
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 bg-muted mb-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                      className="h-full bg-primary"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {percentage === 0 ? (
                      <Button asChild size="sm">
                        <Link href={course.url}>Start Course</Link>
                      </Button>
                    ) : percentage === 100 ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={course.url}>Review Course</Link>
                      </Button>
                    ) : (
                      <Button asChild size="sm">
                        <Link
                          href={
                            lastLesson
                              ? `${course.url}/lessons/${lastLesson}`
                              : course.url
                          }
                        >
                          Continue Learning
                        </Link>
                      </Button>
                    )}

                    <Button asChild variant="ghost" size="sm">
                      <Link href={course.url}>View All Lessons</Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function SyncIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  );
}
