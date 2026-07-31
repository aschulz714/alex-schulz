import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    description: z.string(),
    category: z.enum([
      'ai-automation',
      'data-systems',
      'geospatial',
      'product',
      'python',
      'web',
    ]),
    projectType: z
      .enum(['automation', 'data-system', 'product', 'research', 'venture'])
      .default('research'),
    year: z.number(),
    cover: z.string().optional(),
    tech: z.array(z.string()).default([]),
    status: z.string().optional(),
    role: z.string().optional(),
    scale: z.array(z.string()).default([]),
    proof: z.array(z.string()).default([]),
    confidentiality: z.string().optional(),
    artifact: z
      .object({
        label: z.string(),
        detail: z.string(),
      })
      .optional(),
    caseStudy: z.object({
      question: z.string(),
      data: z.string(),
      method: z.string(),
      signal: z.string(),
      why: z.string(),
    }),
    links: z
      .object({
        repo: z.string().url().optional(),
        demo: z.string().url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    featuredRank: z.number().int().positive().optional(),
  }),
});

export const collections = { projects };
