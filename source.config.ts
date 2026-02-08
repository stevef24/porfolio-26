import {
	defineConfig,
	frontmatterSchema,
	defineCollections,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const blogPosts = defineCollections({
	type: "doc",
	dir: "content/blog",
	schema: frontmatterSchema.extend({
		author: z.string(),
		date: z.string().date().or(z.date()),
		image: z.string().optional(),
	}),
});

// Course lessons collection - ready for Phase 3 scaffolding
export const courses = defineCollections({
	type: "doc",
	dir: "content/courses",
	schema: frontmatterSchema.extend({
		playbackId: z.string().optional(), // Mux video playback ID
		access: z.enum(["public", "paid"]).default("public"), // Access control for future gating
		order: z.number().optional(), // Lesson ordering within module
		module: z.string().optional(), // Module grouping
		resources: z
			.array(
				z.object({
					label: z.string(),
					url: z.string(),
				})
			)
			.optional(), // Additional resources (code repos, docs, etc.)
	}),
});

export default defineConfig({
	mdxOptions: {
		rehypeCodeOptions: {
			themes: {
				light: "github-light",
				dark: "github-dark",
			},
		},
	},
});
