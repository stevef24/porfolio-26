import { notFound } from "next/navigation";
import { courses } from "@/lib/source";
import { CourseLayout } from "@/components/courses/CourseLayout";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { LessonResources, type Resource } from "@/components/courses/LessonResources";
import { AccessGate } from "@/components/courses/AccessGate";
import { LessonNavigation } from "@/components/courses/LessonNavigation";
import { Breadcrumbs } from "@/components/courses/Breadcrumbs";
import customComponents from "@/lib/custom-components";
import type { AccessLevel } from "@/hooks/useAccess";

// Get lesson and all lessons for a course
function getLessonData(courseSlug: string, lessonSlug: string) {
  const pages = courses.getPages();

  // Find the specific lesson
  const lessonPage = pages.find(
    (page) =>
      page.slugs[0] === courseSlug &&
      page.slugs.includes("lessons") &&
      page.slugs[page.slugs.length - 1] === lessonSlug
  );

  // Find the course overview page (for course name)
  const coursePage = pages.find(
    (page) => page.slugs[0] === courseSlug && page.slugs.length === 1
  );

  // Find all lessons for this course (for sidebar)
  const allLessons = pages
    .filter(
      (page) => page.slugs[0] === courseSlug && page.slugs.includes("lessons")
    )
    .map((page) => {
      const data = page.data as {
        title?: string;
        module?: string;
        order?: number;
        access?: string;
      };
      return {
        slug: page.slugs[page.slugs.length - 1],
        title: data.title || page.slugs[page.slugs.length - 1],
        module: data.module || "Lessons",
        order: data.order || 0,
        url: page.url,
        access: (data.access || "public") as AccessLevel,
      };
    })
    .sort((a, b) => a.order - b.order);

  // Find previous and next lessons
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return { lessonPage, coursePage, allLessons, prevLesson, nextLesson };
}

export default async function LessonPage(props: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
  const params = await props.params;
  const { lessonPage, coursePage, allLessons, prevLesson, nextLesson } =
    getLessonData(params.slug, params.lesson);

  if (!lessonPage) {
    notFound();
  }

  const Mdx = lessonPage.data.body;
  const lessonData = lessonPage.data as {
    title?: string;
    description?: string;
    playbackId?: string;
    module?: string;
    access?: string;
    resources?: Resource[];
  };

  const courseData = coursePage?.data as {
    title?: string;
  };

  const tocItems = lessonPage.data.toc.map((item) => ({
    title:
      typeof item.title === "string" ? item.title : String(item.title ?? ""),
    url: item.url,
    depth: item.depth,
  }));

  const accessLevel = (lessonData.access || "public") as AccessLevel;

  return (
    <CourseLayout
      courseSlug={params.slug}
      lessons={allLessons}
      tocItems={tocItems}
    >
      <article className="py-8 lg:py-16">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Courses", href: "/courses" },
            {
              label: courseData?.title || params.slug,
              href: `/courses/${params.slug}`,
            },
            { label: lessonData.title || params.lesson },
          ]}
          className="mb-6"
        />

        {/* Video Player with progress tracking */}
        <VideoPlayer
          playbackId={lessonData.playbackId}
          title={lessonData.title}
          courseSlug={params.slug}
          lessonSlug={params.lesson}
          className="mb-8"
        />

        {/* Access-gated content */}
        <AccessGate
          accessLevel={accessLevel}
          lessonTitle={lessonData.title || "Lesson"}
          courseName={courseData?.title}
        >
          {/* Lesson Header */}
          <header className="mb-8">
            {lessonData.module && (
              <span className="text-swiss-label text-primary mb-2 block">
                {lessonData.module}
              </span>
            )}
            <h1 className="text-swiss-hero mb-4">{lessonData.title}</h1>
            {lessonData.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {lessonData.description}
              </p>
            )}
          </header>

          {/* Divider */}
          <div className="h-px bg-border mb-8" />

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
            <Mdx components={customComponents} />
          </div>

          {/* Lesson Resources */}
          {lessonData.resources && lessonData.resources.length > 0 && (
            <LessonResources resources={lessonData.resources} />
          )}
        </AccessGate>

        {/* Lesson Navigation */}
        <LessonNavigation
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          courseSlug={params.slug}
          className="mt-12"
        />
      </article>
    </CourseLayout>
  );
}

export function generateStaticParams(): { slug: string; lesson: string }[] {
  const pages = courses.getPages();
  const params: { slug: string; lesson: string }[] = [];

  pages.forEach((page) => {
    if (page.slugs.includes("lessons") && page.slugs.length >= 3) {
      params.push({
        slug: page.slugs[0],
        lesson: page.slugs[page.slugs.length - 1],
      });
    }
  });

  return params;
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
  const params = await props.params;
  const { lessonPage } = getLessonData(params.slug, params.lesson);

  if (!lessonPage) return {};

  return {
    title: lessonPage.data.title,
    description: lessonPage.data.description,
  };
}
