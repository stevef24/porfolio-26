"use client";

import { useMemo } from "react";

/**
 * Access Control Hook
 *
 * Manages lesson access based on access level.
 * Prepares for future payment integration in Phase 5.
 *
 * Access Levels:
 * - "public": Free, accessible to everyone
 * - "paid": Requires purchase (visual gate for now)
 * - "preview": First X lessons free in a paid course
 */

export type AccessLevel = "public" | "paid" | "preview";

interface AccessResult {
  hasAccess: boolean;
  accessLevel: AccessLevel;
  isLocked: boolean;
  reason: string | null;
}

interface UseAccessOptions {
  accessLevel: AccessLevel;
  // Future: Add user authentication state
  // isAuthenticated?: boolean;
  // hasPurchased?: boolean;
}

/**
 * Hook to check if user has access to a lesson
 *
 * For Phase 4: Only visual access control
 * Phase 5 will add actual payment verification
 */
export function useAccess({ accessLevel }: UseAccessOptions): AccessResult {
  return useMemo(() => {
    // For Phase 4: Public and preview lessons are accessible
    // Paid lessons show a visual gate but don't block content
    switch (accessLevel) {
      case "public":
        return {
          hasAccess: true,
          accessLevel,
          isLocked: false,
          reason: null,
        };

      case "preview":
        return {
          hasAccess: true,
          accessLevel,
          isLocked: false,
          reason: null,
        };

      case "paid":
        // For now, return locked state for visual indicator
        // In Phase 5, this will check actual purchase status
        return {
          hasAccess: false,
          accessLevel,
          isLocked: true,
          reason: "This lesson requires course purchase",
        };

      default:
        return {
          hasAccess: true,
          accessLevel: "public",
          isLocked: false,
          reason: null,
        };
    }
  }, [accessLevel]);
}

/**
 * Hook to check access for a course
 */
export function useCourseAccess(lessons: Array<{ access: AccessLevel }>) {
  return useMemo(() => {
    const publicLessons = lessons.filter((l) => l.access === "public");
    const paidLessons = lessons.filter((l) => l.access === "paid");
    const previewLessons = lessons.filter((l) => l.access === "preview");

    const hasFreeLessons = publicLessons.length > 0 || previewLessons.length > 0;
    const isFullyPaid = paidLessons.length === lessons.length;

    return {
      hasFreeLessons,
      isFullyPaid,
      freeLessonCount: publicLessons.length + previewLessons.length,
      paidLessonCount: paidLessons.length,
      totalLessonCount: lessons.length,
    };
  }, [lessons]);
}

/**
 * Utility function to determine access level from frontmatter
 */
export function parseAccessLevel(access: string | undefined): AccessLevel {
  if (access === "paid") return "paid";
  if (access === "preview") return "preview";
  return "public";
}
