import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

interface LessonProgressData {
  completed: boolean;
  watchedPercentage: number;
  lastPosition: number;
  lastWatched: number;
}

interface CourseProgressData {
  lessons: Record<string, LessonProgressData>;
}

interface SyncRequestBody {
  courses: Record<string, CourseProgressData>;
}

/**
 * Sync localStorage progress to Supabase
 * POST /api/progress/sync
 *
 * Body: {
 *   courses: {
 *     [courseSlug]: {
 *       lessons: {
 *         [lessonSlug]: {
 *           completed: boolean,
 *           watchedPercentage: number,
 *           lastPosition: number,
 *           lastWatched: number
 *         }
 *       }
 *     }
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Authentication not configured" },
        { status: 503 }
      );
    }

    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Authentication not configured" },
        { status: 503 }
      );
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: SyncRequestBody = await request.json();

    if (!body.courses || typeof body.courses !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    let synced = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    // Process each course
    for (const [courseSlug, courseProgress] of Object.entries(body.courses)) {
      if (!courseProgress.lessons) continue;

      // Process each lesson
      for (const [lessonSlug, lessonProgress] of Object.entries(
        courseProgress.lessons
      )) {
        try {
          // First, check if there's existing progress in Supabase
          const { data: existingProgress } = await supabase
            .from("progress")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_slug", courseSlug)
            .eq("lesson_slug", lessonSlug)
            .single();

          // Merge strategy: keep the better progress
          const shouldUpdate =
            !existingProgress ||
            lessonProgress.watchedPercentage >
              (existingProgress.watch_percentage || 0) ||
            (lessonProgress.completed && !existingProgress.completed);

          if (shouldUpdate) {
            const mergedProgress = {
              user_id: user.id,
              course_slug: courseSlug,
              lesson_slug: lessonSlug,
              completed:
                lessonProgress.completed ||
                existingProgress?.completed ||
                false,
              watch_percentage: Math.max(
                lessonProgress.watchedPercentage,
                existingProgress?.watch_percentage || 0
              ),
              last_position: lessonProgress.lastPosition,
              last_watched: new Date(lessonProgress.lastWatched).toISOString(),
              updated_at: new Date().toISOString(),
            };

            const { error: upsertError } = await supabase
              .from("progress")
              .upsert(mergedProgress, {
                onConflict: "user_id,course_slug,lesson_slug",
              });

            if (upsertError) {
              errors++;
              errorDetails.push(`${courseSlug}/${lessonSlug}: ${upsertError.message}`);
            } else {
              synced++;
            }
          } else {
            // Skip - existing progress is better
            synced++;
          }
        } catch (err) {
          errors++;
          errorDetails.push(
            `${courseSlug}/${lessonSlug}: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        }
      }
    }

    return NextResponse.json({
      ok: true,
      synced,
      errors,
      ...(errors > 0 && { errorDetails }),
    });
  } catch (error) {
    console.error("Progress sync error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Sync failed",
      },
      { status: 500 }
    );
  }
}

/**
 * Get all progress for the authenticated user
 * GET /api/progress/sync
 */
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Authentication not configured" },
        { status: 503 }
      );
    }

    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Authentication not configured" },
        { status: 503 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id)
      .order("last_watched", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    // Group by course
    const courses: Record<
      string,
      {
        lessons: Record<
          string,
          {
            completed: boolean;
            watchPercentage: number;
            lastPosition: number;
            lastWatched: string;
          }
        >;
      }
    > = {};

    for (const progress of data || []) {
      if (!courses[progress.course_slug]) {
        courses[progress.course_slug] = { lessons: {} };
      }

      courses[progress.course_slug].lessons[progress.lesson_slug] = {
        completed: progress.completed,
        watchPercentage: progress.watch_percentage,
        lastPosition: progress.last_position,
        lastWatched: progress.last_watched,
      };
    }

    return NextResponse.json({ ok: true, courses });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      },
      { status: 500 }
    );
  }
}
