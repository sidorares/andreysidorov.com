import type { ComponentType } from "react";

export type Frontmatter = {
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  featured?: boolean;
  draft?: boolean;
  cover?: string;
};

export type ProjectFrontmatter = {
  title: string;
  summary: string;
  tech?: string[];
  repo?: string;
  url?: string;
  cover?: string;
  featured?: boolean;
  date?: string;
};

export type TocEntry = { depth: number; text: string; id: string };

export type MdxModule = {
  default: ComponentType<any>;
  frontmatter: Frontmatter;
  toc?: TocEntry[];
  readingTime?: number;
};

export type ProjectMdxModule = {
  default: ComponentType<any>;
  frontmatter: ProjectFrontmatter;
  toc?: TocEntry[];
  readingTime?: number;
};

// Eager-glob all posts/projects at build time. This makes the content tree
// part of the bundle so the SPA (and SSG) can route to anything without IO.
const postModules = import.meta.glob<MdxModule>(
  "../../content/posts/*.mdx",
  { eager: true }
);

const projectModules = import.meta.glob<ProjectMdxModule>(
  "../../content/projects/*.mdx",
  { eager: true }
);

const aboutModules = import.meta.glob<MdxModule>(
  "../../content/about.mdx",
  { eager: true }
);

function pathToSlug(p: string) {
  const file = p.split("/").pop()!.replace(/\.mdx?$/, "");
  // strip leading YYYY-MM-DD-
  return file.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function normalizeTag(t: unknown): string | null {
  if (typeof t !== "string") return null;
  const normalized = t.trim().toLowerCase();
  return normalized ? normalized : null;
}

export type Post = {
  slug: string;
  Component: ComponentType<any>;
  frontmatter: Frontmatter;
  toc: TocEntry[];
  readingTime: number;
};

export type Project = {
  slug: string;
  Component: ComponentType<any>;
  frontmatter: ProjectFrontmatter;
  toc: TocEntry[];
  readingTime: number;
};

const isProd = import.meta.env.PROD;

export const posts: Post[] = Object.entries(postModules)
  .map(([path, mod]) => ({
    slug: pathToSlug(path),
    Component: mod.default,
    frontmatter: {
      ...mod.frontmatter,
      tags: (mod.frontmatter.tags ?? [])
        .map(normalizeTag)
        .filter((t): t is string => t !== null),
    },
    toc: mod.toc || [],
    readingTime: mod.readingTime || 1,
  }))
  .filter((p) => !(isProd && p.frontmatter.draft))
  .sort(
    (a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
  );

export const projects: Project[] = Object.entries(projectModules)
  .map(([path, mod]) => ({
    slug: pathToSlug(path),
    Component: mod.default,
    frontmatter: {
      ...mod.frontmatter,
      tech: (mod.frontmatter.tech ?? [])
        .map(normalizeTag)
        .filter((t): t is string => t !== null),
    },
    toc: mod.toc || [],
    readingTime: mod.readingTime || 1,
  }))
  .sort(
    (a, b) =>
      +new Date(b.frontmatter.date || 0) - +new Date(a.frontmatter.date || 0)
  );

export const about: MdxModule | undefined = Object.values(aboutModules)[0];

export const allTags = Array.from(
  new Set(posts.flatMap((p) => p.frontmatter.tags || []))
).sort();

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function adjacentPosts(slug: string) {
  const i = posts.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? posts[i - 1] : null,
    next: i >= 0 && i < posts.length - 1 ? posts[i + 1] : null,
  };
}
