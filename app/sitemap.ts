import type { MetadataRoute } from "next";
import { getVisibleBlogPages } from "@/lib/blog-visibility";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://stavfernandes.dev";

  const blogPages = getVisibleBlogPages().map((post) => ({
    url: `${baseUrl}${post.url}`,
    lastModified: post.data.date ? new Date(post.data.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPages,
  ];
}
