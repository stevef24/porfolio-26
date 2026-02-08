// source.config.ts
import {
  defineConfig,
  frontmatterSchema,
  defineCollections
} from "fumadocs-mdx/config";
import { z } from "zod";
var blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.string().date().or(z.date()),
    image: z.string().optional()
  })
});
var courses = defineCollections({
  type: "doc",
  dir: "content/courses",
  schema: frontmatterSchema.extend({
    playbackId: z.string().optional(),
    // Mux video playback ID
    access: z.enum(["public", "paid"]).default("public"),
    // Access control for future gating
    order: z.number().optional(),
    // Lesson ordering within module
    module: z.string().optional(),
    // Module grouping
    resources: z.array(
      z.object({
        label: z.string(),
        url: z.string()
      })
    ).optional()
    // Additional resources (code repos, docs, etc.)
  })
});
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  }
});
export {
  blogPosts,
  courses,
  source_config_default as default
};
