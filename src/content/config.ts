import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * A figure attached to a plate or an analysis piece.
 * - image: a static render under /public (path relative to site base, no leading slash)
 * - iframe: a live, self-hosted demo embedded on the project page (src must be https)
 */
const figure = z.object({
  kind: z.enum(['image', 'iframe']).default('image'),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  /** Aspect ratio as "w/h" for layout stability, e.g. "16/9". Match the file's pixel size. */
  ratio: z.string().default('16/9'),
  /**
   * How the image fills a fixed-ratio frame such as a project card. 'contain' (default) never
   * crops, which suits charts, maps, and schematics; 'cover' fills the frame, for photos and imagery.
   */
  fit: z.enum(['contain', 'cover']).default('contain'),
  /** Optional source line printed under the figure. */
  source: z.string().optional(),
});

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
    /** Display order (roman numeral) on the work index. Lower = earlier. */
    plate: z.number().int().positive().optional(),
    figure: figure.optional(),
    /** Secondary figures shown in the project page gallery. */
    gallery: z.array(figure).default([]),
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
        /** One line printed under the demo button, e.g. the guest PIN of a sample trip. */
        demoNote: z.string().optional(),
      })
      .default({}),
    /** Embed the live demo as an iframe on the project page (button link is always shown). */
    embedDemo: z.boolean().default(true),
    /** Keep the entry on disk but off the site (no page, no card). */
    hidden: z.boolean().default(false),
    featured: z.boolean().default(false),
    featuredRank: z.number().int().positive().optional(),
  }),
});

/** Parked: the site has no analysis pages (removed 2026-09-24); pieces stay here as drafts. */
const analysis = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/analysis' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    date: z.coerce.date(),
    /** One vertical per piece; the site is depth-in-one-vertical by design. */
    vertical: z.enum(['parcels', 'data-centers', 'power', 'wealth', 'method']),
    tags: z.array(z.string()).default([]),
    figure: figure.optional(),
    /** The five-part evidentiary frame, same as the plates. */
    frame: z.object({
      question: z.string(),
      data: z.string(),
      method: z.string(),
      finding: z.string(),
      limits: z.string(),
    }),
    /** Related project ids, e.g. ["national-parcel-coverage"]. */
    plates: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, analysis };
