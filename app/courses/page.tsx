import { courses } from "@/lib/source";
import { LessonCard } from "@/components/courses/LessonCard";
import BlurFade from "@/components/shared/BlurFade";
import SiteShell from "@/components/layout/SiteShell";

// Group lessons by course (first segment of the path)
function getCourseOverviews() {
  const pages = courses.getPages();
  const courseMap = new Map<
    string,
    {
      slug: string;
      title: string;
      description: string;
      lessonCount: number;
    }
  >();

  pages.forEach((page) => {
    const pathParts = page.slugs;
    const courseSlug = pathParts[0];

    // Only count the overview page (index) as the course entry
    if (pathParts.length === 1 || pathParts[1] === "index") {
      courseMap.set(courseSlug, {
        slug: courseSlug,
        title: page.data.title || courseSlug,
        description: page.data.description || "",
        lessonCount: 0,
      });
    }
  });

  // Count lessons for each course
  pages.forEach((page) => {
    const pathParts = page.slugs;
    const courseSlug = pathParts[0];

    // Count pages that are in the lessons folder
    if (pathParts.includes("lessons")) {
      const course = courseMap.get(courseSlug);
      if (course) {
        course.lessonCount++;
      }
    }
  });

  return Array.from(courseMap.values());
}

export default function CoursesPage() {
  const courseOverviews = getCourseOverviews();

  return (
    <SiteShell>
      <main className="py-16 lg:py-24">
        <BlurFade delay={0.05}>
          <h1 className="text-swiss-subheading mb-2">Courses</h1>
        </BlurFade>

        <BlurFade delay={0.1}>
          <p className="text-lg text-muted-foreground mb-12 max-w-prose">
            Deep-dive tutorials on modern web development, from fundamentals to
            advanced patterns.
          </p>
        </BlurFade>

        <div className="divide-y divide-border">
          {courseOverviews.map((course, index) => (
            <BlurFade key={course.slug} delay={0.15 + index * 0.05}>
              <LessonCard
                title={course.title}
                description={course.description}
                href={`/courses/${course.slug}`}
                lessonCount={course.lessonCount}
              />
            </BlurFade>
          ))}
        </div>

        {courseOverviews.length === 0 && (
          <BlurFade delay={0.15}>
            <p className="text-muted-foreground text-center py-12">
              No courses available yet. Check back soon.
            </p>
          </BlurFade>
        )}
      </main>
    </SiteShell>
  );
}

export const metadata = {
  title: "Courses",
  description:
    "Deep-dive tutorials on modern web development, from fundamentals to advanced patterns.",
};
