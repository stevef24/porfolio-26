import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blog } from "@/lib/source";
import customComponents from "@/lib/custom-components";
import { GradualBlur } from "@/components/ui/blog/GradualBlur";
import { SectionIndicator } from "@/components/ui/blog/SectionIndicator";
import { EmailCaptureForm } from "@/components/shared/EmailCaptureForm";
import SiteShell from "@/components/layout/SiteShell";
import { BlogHeroHeader } from "@/components/blog/BlogHeroHeader";

// Helper to extract text content from React elements or strings
function extractTextContent(node: unknown): string {
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
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}): Promise<React.ReactNode> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const Mdx = page.data.body;
  const { date } = page.data as { author?: string; date?: string };

  // Transform TOC items for section indicator
  const tocItems = page.data.toc.map((item) => ({
    title: extractTextContent(item.title),
    url: item.url,
    depth: item.depth,
  }));

  // Format date for display
  const formattedDate = date ? format(new Date(date), "MMMM d, yyyy") : undefined;

  return (
    <>
      {/* Fixed bottom gradual blur - fades when reaching end */}
      <GradualBlur />

      <SiteShell>
        <article className="relative py-8 lg:py-6">
          {/* Hero Header with Mesh Gradient */}
          <BlogHeroHeader
            title={page.data.title}
            description={page.data.description}
            date={formattedDate}
            categories={["Article"]}
          />

          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-caption hover:text-foreground transition-colors mb-8"
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
            Back to Blog
          </Link>

          {/* Section indicator - sticks when scrolled past header */}
          {tocItems.length > 0 && <SectionIndicator items={tocItems} />}

          {/* Divider */}
          <div className="h-px bg-border mb-8" />

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <Mdx components={customComponents} />
          </div>

          {/* Email Capture CTA */}
          <EmailCaptureForm
            title="Enjoyed this post?"
            description="Get notified when I publish something new. No spam, just fresh content."
            buttonLabel="Subscribe"
            source="blog-footer"
            className="mt-12"
          />

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            {date && (
              <span className="text-caption">
                Published {format(new Date(date), "MMMM d, yyyy")}
              </span>
            )}
          </footer>
        </article>
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
}): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
