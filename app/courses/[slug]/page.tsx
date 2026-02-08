import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses } from "@/lib/source";
import { CourseShell } from "@/components/courses/CourseShell";
import { CourseProgressHeader } from "@/components/courses/CourseProgressHeader";
import customComponents from "@/lib/custom-components";
import type { AccessLevel } from "@/hooks/useAccess";
import { TOCProvider } from "fumadocs-ui/components/layout/toc";

type CoursePage = ReturnType<typeof courses.getPages>[number];

interface CourseLesson {
  slug: string;
  title: string;
  module: string;
  order: number;
  url: string;
  access: AccessLevel;
}

interface CourseData {
  overviewPage: CoursePage | undefined;
  lessonPages: CourseLesson[];
}

// Get course overview and all lessons for a course
function getCourseData(slug: string): CourseData {
  const pages = courses.getPages();

  // Find the course overview (index.mdx)
  const overviewPage = pages.find(
    (page) => page.slugs[0] === slug && page.slugs.length === 1
  );

  // Find all lessons for this course
  const lessonPages = pages
    .filter(
      (page) => page.slugs[0] === slug && page.slugs.includes("lessons")
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

  return { overviewPage, lessonPages };
}

export default async function CourseOverviewPage(props: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> {
  const params = await props.params;
  const { overviewPage, lessonPages } = getCourseData(params.slug);

  if (!overviewPage) {
    notFound();
  }

  const firstLesson = lessonPages[0];
  const courseName = (overviewPage.data.title as string) || params.slug;

  const Mdx = overviewPage.data.body;
  const overviewMeta = overviewPage.data as {
    toc?: Array<{ title: string; url: string; depth: number }>;
    difficulty?: string;
    duration?: string;
    tags?: string[];
  };
  const tocItems = overviewMeta.toc || [];

  return (
    <CourseShell
      courseSlug={params.slug}
      courseName={courseName}
      lessons={lessonPages}
    >
      <article className="py-8 lg:py-6">
        {/* Header */}
        <header className="mb-8">
          <p className="text-swiss-label text-foreground/50 mb-3">Course Overview</p>
          <h1 className="text-swiss-body text-foreground font-medium mb-3">{overviewPage.data.title}</h1>
          {overviewPage.data.description && (
            <p className="text-swiss-body text-foreground/60 leading-relaxed max-w-xl mb-4">
              {overviewPage.data.description}
            </p>
          )}

          {/* Metadata bar */}
          {(overviewMeta.difficulty || overviewMeta.duration || lessonPages.length > 0 || (overviewMeta.tags && overviewMeta.tags.length > 0)) && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6">
              {overviewMeta.difficulty && (
                <span className="text-swiss-caption text-foreground/50">{overviewMeta.difficulty}</span>
              )}
              {overviewMeta.difficulty && overviewMeta.duration && (
                <span className="text-swiss-caption text-foreground/30">&middot;</span>
              )}
              {overviewMeta.duration && (
                <span className="text-swiss-caption text-foreground/50">{overviewMeta.duration}</span>
              )}
              {(overviewMeta.difficulty || overviewMeta.duration) && lessonPages.length > 0 && (
                <span className="text-swiss-caption text-foreground/30">&middot;</span>
              )}
              {lessonPages.length > 0 && (
                <span className="text-swiss-caption text-foreground/50">
                  {lessonPages.length} {lessonPages.length === 1 ? "lesson" : "lessons"}
                </span>
              )}
              {overviewMeta.tags && overviewMeta.tags.length > 0 && (
                <>
                  <span className="text-swiss-caption text-foreground/30">&middot;</span>
                  {overviewMeta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-swiss-caption text-foreground/50 bg-foreground/5 px-1.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Progress and CTA */}
          {lessonPages.length > 0 && firstLesson && (
            <CourseProgressHeader
              courseSlug={params.slug}
              lessons={lessonPages.map((l) => ({
                slug: l.slug,
                title: l.title,
                url: l.url,
              }))}
              firstLessonUrl={firstLesson.url}
            />
          )}
        </header>

        {/* Divider */}
        <div className="h-px bg-border mb-12" />

        {/* Content */}
        <TOCProvider toc={tocItems}>
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
            <Mdx components={customComponents} />
          </div>
        </TOCProvider>
      </article>
    </CourseShell>
  );
}

export function generateStaticParams(): { slug: string }[] {
  const pages = courses.getPages();
  const slugs = new Set<string>();

  pages.forEach((page) => {
    slugs.add(page.slugs[0]);
  });

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { overviewPage } = getCourseData(params.slug);

  if (!overviewPage) return {};

  return {
    title: overviewPage.data.title,
    description: overviewPage.data.description,
  };
}
