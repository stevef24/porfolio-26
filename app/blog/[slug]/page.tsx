import { notFound } from "next/navigation";
import Link from "next/link";
import { blog } from "@/lib/source";
import { format } from "date-fns";
import customComponents from "@/lib/custom-components";
import { RulerTOC } from "@/components/ui/blog/RulerTOC";
import { GradualBlur } from "@/components/ui/blog/GradualBlur";
import { MobileFloatingTOC } from "@/components/ui/blog/MobileFloatingTOC";
import { EmailCaptureForm } from "@/components/shared/EmailCaptureForm";
import SiteShell from "@/components/layout/SiteShell";

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const Mdx = page.data.body;
  const { date } = page.data as { author?: string; date?: string };

  const articleContent = (
    <article className="relative py-8 lg:py-6">
      {/* Back Link - Minimal */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-swiss-label hover:text-primary transition-colors mb-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back
      </Link>

      {/* Header - Minimal */}
      <header className="mb-10">
        <h1 className="text-swiss-hero mb-4">
          {page.data.title}
        </h1>
        {page.data.description && (
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {page.data.description}
          </p>
        )}
        {/* Date display */}
        {date && (
          <div className="mt-6">
            <span className="text-swiss-label">
              {format(new Date(date), "MMMM d, yyyy")}
            </span>
          </div>
        )}
      </header>

      {/* Divider */}
      <div className="h-px bg-border mb-10" />

      {/* Content - Enhanced prose styling */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <Mdx components={customComponents} />
      </div>

      {/* Email Capture CTA */}
      <EmailCaptureForm
        title="Enjoyed this post?"
        description="Get notified when I publish something new. No spam, just fresh content."
        buttonLabel="Subscribe"
        source="blog-footer"
        className="mt-20"
      />

      {/* Footer */}
      <footer className="mt-16 pt-10 border-t border-border">
        {date && (
          <span className="text-swiss-label">
            {format(new Date(date), "MMMM d, yyyy")}
          </span>
        )}
      </footer>
    </article>
  );

  // Helper to extract text content from React elements or strings
  const extractTextContent = (node: unknown): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (!node) return "";

    // Handle React elements
    if (typeof node === "object" && node !== null) {
      const element = node as { props?: { children?: unknown } };
      if (element.props?.children) {
        if (Array.isArray(element.props.children)) {
          return element.props.children.map(extractTextContent).join("");
        }
        return extractTextContent(element.props.children);
      }
    }
    return "";
  };

  // Transform TOC items for the ruler navigation
  const tocItems = page.data.toc.map((item) => ({
    title: extractTextContent(item.title),
    url: item.url,
    depth: item.depth,
  }));

  return (
    <>
      {/* Fixed left-side ruler TOC (desktop) */}
      {tocItems.length > 0 && <RulerTOC items={tocItems} />}

      {/* Floating pill TOC (mobile/tablet) */}
      {tocItems.length > 0 && <MobileFloatingTOC items={tocItems} />}

      {/* Fixed bottom gradual blur - fades when reaching end */}
      <GradualBlur />

      <SiteShell>
        {articleContent}
      </SiteShell>
    </>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
