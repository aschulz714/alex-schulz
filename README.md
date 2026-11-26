# Alex Schulz Portfolio

Source for [aschulz714.github.io/alex-schulz](https://aschulz714.github.io/alex-schulz/): a CPA who builds practical software with AI. The site shows five projects first, ten more behind them, and a long-form Story page.

Built with Astro and Tailwind CSS. GitHub Actions builds and publishes `main` to GitHub Pages.

## Structure

- `src/pages/index.astro`: home page. Headline, background strip, five project cards, working method.
- `src/pages/work/index.astro`: all projects. `src/pages/work/[slug].astro`: one project page.
- `src/pages/about.astro`: the Story page, with the life timeline.
- `src/content/projects/*.md`: one file per project. The frontmatter drives the cards and the project page.
- `src/components`: `PlateCard` (project card), `Figure` (framed figure that opens full size), `LifeTimeline`, `Method`, `CTA`.
- `src/data/site.ts`: contact links, footer coordinates, resume switch. `src/data/life.ts`: timeline entries.
- `src/layouts/Base.astro`: page shell, header, footer, link-preview tags.
- `src/styles/global.css`: the design system (paper, ink, one red, one sage).
- `public/figures`: figures rendered from project data. `public/og-image.png`: the link-preview image.
- `scripts/generate-og-image.py`: regenerates the link-preview image from the home page headline.

## Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Content model

Each project file carries:

- `title`, `blurb`, `description`, `category`, `year`, `status`.
- `plate`: display order. The first five appear on the home page.
- `figure` and `gallery`: images under `public/`, with the pixel ratio stated.
- `role`, `scale`, `proof`, `tech`: the sidebar on the project page.
- `caseStudy`: question, data, method, signal, and why it matters.
- `links.repo`, `links.demo`, `links.demoNote`: the buttons at the top of the project page.
- `hidden: true` keeps a file on disk and off the site.

## Rules for content

- Every number on the site is recomputed from its source file before it is published.
- No private owner names or residential addresses appear on any page.
- Employer work is described in generalized form only.
