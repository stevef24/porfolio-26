import { blogPosts, courses as coursesSource } from "@/.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";

export const blog = loader({
  baseUrl: "/blog",
  source: createMDXSource(blogPosts),
});

export const courses = loader({
  baseUrl: "/courses",
  source: createMDXSource(coursesSource),
});
