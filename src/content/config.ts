import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    description: z.string(),
    category: z.enum(['geospatial', 'python', 'web']),
    year: z.number(),
    cover: z.string().optional(),
    tech: z.array(z.string()).default([]),
    links: z
      .object({
        repo: z.string().url().optional(),
        demo: z.string().url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
