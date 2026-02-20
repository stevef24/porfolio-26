import { courses } from "@/lib/source";
import { CourseCardList } from "@/components/courses/CourseCardList";
import BlurFade from "@/components/shared/BlurFade";
import SiteShell from "@/components/layout/SiteShell";
import { PageHeaderShader } from "@/components/ui/PageHeaderShader";

interface CourseOverview {
  slug: string;
  title: string;
  description: string;
  lessonCount: number;
  duration?: string;
  difficulty?: string;
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
      const data = page.data as {
        title?: string;
        description?: string;
        duration?: string;
        difficulty?: string;
      };
      courseMap.set(courseSlug, {
        slug: courseSlug,
        title: data.title || courseSlug,
        description: data.description || "",
        lessonCount: 0,
        duration: data.duration,
        difficulty: data.difficulty,
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
      {/* Shader page header — breaks out of SiteShell's px-4 lg:px-6 padding */}
      <PageHeaderShader
        tokenPrefix="--courses-hero"
        fallbackMesh={[
          "rgb(196 181 253)",
          "rgb(165 180 252)",
          "rgb(237 233 254)",
          "rgb(199 210 254)",
        ]}
        className="-mx-4 lg:-mx-6 mb-10"
      >
        <div className="px-4 lg:px-6 pt-14 pb-10 lg:pt-16 lg:pb-12">
          <BlurFade delay={0.05}>
            <p className="text-swiss-label text-foreground/50 mb-3">Courses</p>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h1 className="text-swiss-section mb-3">Learn by Building</h1>
          </BlurFade>
          <BlurFade delay={0.15}>
            <p className="text-swiss-body text-foreground/60 leading-relaxed max-w-xl">
              Practical, context-first courses on AI CLI tools — from setup to
              production patterns.
            </p>
          </BlurFade>
        </div>
      </PageHeaderShader>

      {/* Course list */}
      <section className="pb-28">
        <BlurFade delay={0.18}>
          <h2 className="text-swiss-label text-foreground/50 mb-4">
            Available Courses
          </h2>
        </BlurFade>
        {courseOverviews.length > 0 ? (
          <CourseCardList courses={courseOverviews} baseDelay={0.2} stagger={0.05} />
        ) : (
          <BlurFade delay={0.2}>
            <p className="text-swiss-body text-foreground/60 leading-relaxed text-center py-16">
              No courses available yet. Check back soon.
            </p>
          </BlurFade>
        )}
      </section>
    </SiteShell>
  );
}

export const metadata = {
  title: "Courses",
  description:
    "Practical, context-first courses on AI CLI tools — from setup to production patterns.",
};
