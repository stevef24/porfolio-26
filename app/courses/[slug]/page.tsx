import { notFound } from "next/navigation";
import { courses } from "@/lib/source";
import { CourseLayout } from "@/components/courses/CourseLayout";
import { CourseProgressHeader } from "@/components/courses/CourseProgressHeader";
import { Breadcrumbs } from "@/components/courses/Breadcrumbs";
import customComponents from "@/lib/custom-components";
import type { AccessLevel } from "@/hooks/useAccess";

// Get course overview and all lessons for a course
function getCourseData(slug: string) {
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
}) {
  const params = await props.params;
  const { overviewPage, lessonPages } = getCourseData(params.slug);

  if (!overviewPage) {
    notFound();
  }

  const firstLesson = lessonPages[0];

  const Mdx = overviewPage.data.body;
  const tocItems = overviewPage.data.toc.map((item) => ({
    title: typeof item.title === "string" ? item.title : String(item.title ?? ""),
    url: item.url,
    depth: item.depth,
  }));

  return (
    <CourseLayout
      courseSlug={params.slug}
      lessons={lessonPages}
      tocItems={tocItems}
    >
      <article className="py-16 lg:py-24">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Courses", href: "/courses" },
            { label: overviewPage.data.title || params.slug },
          ]}
          className="mb-10"
        />

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-swiss-hero mb-4">{overviewPage.data.title}</h1>
          {overviewPage.data.description && (
            <p className="text-lg text-muted-foreground leading-relaxed max-w-prose mb-8">
              {overviewPage.data.description}
            </p>
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
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
          <Mdx components={customComponents} />
        </div>
      </article>
    </CourseLayout>
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
}) {
  const params = await props.params;
  const { overviewPage } = getCourseData(params.slug);

  if (!overviewPage) return {};

  return {
    title: overviewPage.data.title,
    description: overviewPage.data.description,
  };
}
