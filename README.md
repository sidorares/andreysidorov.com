# Notes — a developer blog & portfolio

A minimal, static, MDX-powered personal site. Built with Vite + React,
deployed to GitHub Pages by a one-file GitHub Action.

## Writing a post

Drop a file in `content/posts/`:

```
content/posts/2026-05-01-my-post.mdx
```

```mdx
---
title: "My post"
description: "One-liner used in lists and meta tags."
date: 2026-05-01
tags: [tag-one, tag-two]
featured: false
draft: false
---

Words go here. You can also use components:

<Callout type="tip">Like this.</Callout>
```

Push to `main` — the Action builds and deploys.

## Available MDX components

- `<Callout type="info|warn|tip">` — bordered note
- `<Figure src caption alt>` — image with caption
- `<Embed url />` — generic iframe (YouTube, etc.)
- `<Steps>` / `<Step title>` — numbered walkthrough
- Plus anything you `import` from `src/mdx/`.

## Runnable code fences

Syntax-highlighted fences stay plain source unless you opt in with a **`!`**
prefix **and** the language id is listed in `site.config.ts`:

```ts
export const siteConfig = {
  runnableFences: ["mermaid"],
};
```

Example: ` ```!mermaid ` runs the diagram renderer; ` ```mermaid ` only shows
highlighted text (same as any other language).

Add languages to `runnableFences` and wire a handler in `src/mdx/RunnableFence.tsx`.

## Local development

```bash
bun install
bun run dev
```

## Build / deploy

CI runs `bun run build` and publishes `dist/` to GitHub Pages.
The build pre-renders every route to static HTML (SSR at build time), then hydrates in the browser.
RSS, sitemap, and a pre-rendered `404.html` (GitHub Pages unknown-route fallback) are emitted automatically.

To deploy manually, push to `main`. To preview the production build:

```bash
bun run build && bun run preview
```

## Project layout

```
content/
  posts/          # blog posts (MDX)
  projects/       # portfolio items (MDX)
  about.mdx       # about page body
src/
  pages/          # routed React pages
  components/     # site chrome
  mdx/            # MDX components & RunnableFence
  lib/content.ts  # MDX glob loader
  site.config.ts  # name, socials, runnable fences
scripts/          # remark/rehype plugins, RSS/sitemap
.github/workflows/deploy.yml
```
