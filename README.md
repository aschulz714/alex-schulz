# Alex Schulz Portfolio

Living resume and portfolio for work at the intersection of accounting discipline, geospatial intelligence, and physical-world financial signals.

## Structure

- `src/pages/index.astro`: homepage composition.
- `src/pages/about.astro`: long-form biography and origin story.
- `src/components`: visual sections and interactive project modal.
- `src/content/projects`: project case studies managed through Astro content collections.
- `src/data/profile.ts`: reusable profile data for hero places, proof pillars, and notes.
- `src/data/timeline.ts`: career timeline data.
- `public`: static assets including resume, OG image, and artifact images.

## Commands

```sh
npm run dev
npm run build
npm run preview
```

## Content Model

Projects use frontmatter for the core portfolio proof layer:

- `blurb`: short card summary.
- `caseStudy.question`: the research or product question.
- `caseStudy.data`: source material or inputs.
- `caseStudy.method`: how the work was done.
- `caseStudy.signal`: what the work reveals.
- `caseStudy.why`: why it matters.
- `artifact`: the visible output or object visitors can inspect.
