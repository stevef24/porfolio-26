import { courses } from "@/lib/source";
import { DashboardContent } from "./DashboardContent";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";

export const metadata = {
  title: "Dashboard - Your Learning Progress",
  description: "Track your course progress and continue learning",
};

interface CourseInfo {
  slug: string;
  title: string;
  description: string;
  totalLessons: number;
  url: string;
}

export default async function DashboardPage() {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    redirect("/?auth_not_configured=true");
  }

  // Check authentication on server
  const supabase = await createClient();

  if (!supabase) {
    redirect("/?auth_not_configured=true");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?auth_required=true");
  }

  // Get all courses
  const allCourses = courses.getPages();

  // Extract course info (group by course slug)
  const courseMap = new Map<string, CourseInfo>();

  for (const page of allCourses) {
    const slugParts = page.slugs;

    // Skip if not a course page
    if (slugParts.length === 0) continue;

    const courseSlug = slugParts[0];

    // Initialize course if not exists
    if (!courseMap.has(courseSlug)) {
      // Find the course index page
      const indexPage = allCourses.find(
        (p) => p.slugs.length === 1 && p.slugs[0] === courseSlug
      );

      courseMap.set(courseSlug, {
        slug: courseSlug,
        title: indexPage?.data.title || courseSlug,
        description: indexPage?.data.description || "",
        totalLessons: 0,
        url: `/courses/${courseSlug}`,
      });
    }

    // Count lessons (pages with more than 1 slug part)
    if (slugParts.length > 1) {
      const course = courseMap.get(courseSlug)!;
      course.totalLessons++;
    }
  }

  const coursesData = Array.from(courseMap.values());

  // Get user's progress from Supabase
  const { data: progressData } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id);

  // Group progress by course
  const progressByCourse: Record<
    string,
    {
      completedCount: number;
      lastLesson: string | null;
      lastWatched: string | null;
    }
  > = {};

  for (const progress of progressData || []) {
    if (!progressByCourse[progress.course_slug]) {
      progressByCourse[progress.course_slug] = {
        completedCount: 0,
        lastLesson: null,
        lastWatched: null,
      };
    }

    if (progress.completed) {
      progressByCourse[progress.course_slug].completedCount++;
    }

    // Track most recent lesson
    const current = progressByCourse[progress.course_slug];
    if (
      !current.lastWatched ||
      new Date(progress.last_watched) > new Date(current.lastWatched)
    ) {
      current.lastLesson = progress.lesson_slug;
      current.lastWatched = progress.last_watched;
    }
  }

  return (
    <SiteShell>
      <DashboardContent
        courses={coursesData}
        progress={progressByCourse}
        userEmail={user.email || ""}
      />
    </SiteShell>
  );
}
