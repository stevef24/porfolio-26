import { blog } from "@/lib/source";

const HIDDEN_BLOG_SLUGS = new Set<string>(["agent-sdk-deep-research"]);

type BlogPage = ReturnType<typeof blog.getPages>[number];

function isHiddenBlogPage(page: BlogPage): boolean {
  const slug = page.slugs[0] ?? "";
  const isHiddenInFrontmatter = Boolean((page.data as { hidden?: boolean }).hidden);
  return isHiddenInFrontmatter || HIDDEN_BLOG_SLUGS.has(slug);
}

export function getVisibleBlogPages(): BlogPage[] {
  return blog
    .getPages()
    .filter((page) => !isHiddenBlogPage(page))
    .sort((a, b) => {
      const dateA = new Date((a.data as { date?: string }).date ?? 0).getTime();
      const dateB = new Date((b.data as { date?: string }).date ?? 0).getTime();
      return dateB - dateA;
    });
}

export function getVisibleBlogPage(slug: string): BlogPage | null {
  const page = blog.getPage([slug]);
  if (!page) return null;
  return isHiddenBlogPage(page) ? null : page;
}

