import { courses } from "@/lib/source";
import { LessonCard } from "@/components/courses/LessonCard";
import BlurFade from "@/components/shared/BlurFade";
import SiteShell from "@/components/layout/SiteShell";

interface CourseOverview {
  slug: string;
  title: string;
  description: string;
  lessonCount: number;
}

// Group lessons by course (first segment of the path)
function getCourseOverviews(): CourseOverview[] {
  const pages = courses.getPages();
  const courseMap = new Map<string, CourseOverview>();

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

export default function CoursesPage(): JSX.Element {
  const courseOverviews = getCourseOverviews();

  return (
    <SiteShell>
      <main className="py-8 lg:py-6">
        {/* Header section */}
        <header className="mb-8">
          <BlurFade delay={0.05}>
            <p className="text-[15px] text-foreground/50 mb-3">Courses</p>
          </BlurFade>

          <BlurFade delay={0.1}>
            <h1 className="text-[15px] text-foreground font-medium mb-3">Learn by Building</h1>
          </BlurFade>

          <BlurFade delay={0.15}>
            <p className="text-[15px] text-foreground/60 leading-relaxed max-w-xl">
              Deep-dive tutorials on modern web development, from fundamentals
              to advanced patterns.
            </p>
          </BlurFade>
        </header>

        {/* Course list */}
        <section>
          <BlurFade delay={0.18}>
            <h2 className="text-[15px] text-foreground/50 mb-4">
              Available Courses
            </h2>
          </BlurFade>
          {courseOverviews.map((course, index) => (
            <BlurFade key={course.slug} delay={0.2 + index * 0.05}>
              <LessonCard
                title={course.title}
                description={course.description}
                href={`/courses/${course.slug}`}
                lessonCount={course.lessonCount}
              />
            </BlurFade>
          ))}

          {courseOverviews.length === 0 && (
            <BlurFade delay={0.2}>
              <p className="text-[15px] text-foreground/60 leading-relaxed text-center py-16">
                No courses available yet. Check back soon.
              </p>
            </BlurFade>
          )}
        </section>
      </main>
    </SiteShell>
  );
}

export const metadata = {
  title: "Courses",
  description:
    "Deep-dive tutorials on modern web development, from fundamentals to advanced patterns.",
};
