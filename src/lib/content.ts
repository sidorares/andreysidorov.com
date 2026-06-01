import type { ComponentType } from "react";
import {
  hasAboutContent,
  postEntries,
  projectEntries,
  type Frontmatter,
  type PostEntry,
  type ProjectEntry,
  type ProjectFrontmatter,
} from "./content-manifest.generated";

export type { Frontmatter, ProjectFrontmatter };

export type TocEntry = { depth: number; text: string; id: string };

type MdxModule = {
  default: ComponentType<any>;
  frontmatter: Frontmatter;
  toc?: TocEntry[];
  readingTime?: number;
};

type ProjectMdxModule = {
  default: ComponentType<any>;
  frontmatter: ProjectFrontmatter;
  toc?: TocEntry[];
  readingTime?: number;
};

export type PostMeta = PostEntry;
export type ProjectMeta = ProjectEntry;

export type LoadedPost = {
  Component: ComponentType<any>;
  frontmatter: Frontmatter;
  toc: TocEntry[];
  readingTime: number;
};

export type LoadedProject = {
  Component: ComponentType<any>;
  frontmatter: ProjectFrontmatter;
  toc: TocEntry[];
  readingTime: number;
};

export type LoadedAbout = {
  Component: ComponentType<any>;
};

const postLoaders = import.meta.glob<MdxModule>("../../content/posts/*.mdx");
const projectLoaders = import.meta.glob<ProjectMdxModule>(
  "../../content/projects/*.mdx",
);
const aboutLoader = hasAboutContent
  ? import.meta.glob<MdxModule>("../../content/about.mdx")
  : {};

function pathToSlug(p: string) {
  const file = p.split("/").pop()!.replace(/\.mdx?$/, "");
  return file.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function buildSlugMap<T>(loaders: Record<string, () => Promise<T>>) {
  return new Map(
    Object.keys(loaders).map((p) => [pathToSlug(p), p] as const),
  );
}

const postPathBySlug = buildSlugMap(postLoaders);
const projectPathBySlug = buildSlugMap(projectLoaders);
const aboutPath = Object.keys(aboutLoader)[0];

const postCache = new Map<string, Promise<LoadedPost | null>>();
const projectCache = new Map<string, Promise<LoadedProject | null>>();
const postResolved = new Map<string, LoadedPost | null>();
const projectResolved = new Map<string, LoadedProject | null>();
let aboutCache: Promise<LoadedAbout | null> | undefined;
/** undefined = not loaded yet; null = no about.mdx */
let aboutResolved: LoadedAbout | null | undefined;

export const posts: PostMeta[] = postEntries;
export const projects: ProjectMeta[] = projectEntries;

export const allTags = Array.from(
  new Set(posts.flatMap((p) => p.frontmatter.tags || [])),
).sort();

export function getPostMeta(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getProjectMeta(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** @deprecated Use getPostMeta — kept for call sites during migration. */
export const getPost = getPostMeta;

/** @deprecated Use getProjectMeta */
export const getProject = getProjectMeta;

export function loadPost(slug: string): Promise<LoadedPost | null> {
  const existing = postCache.get(slug);
  if (existing) return existing;

  const modulePath = postPathBySlug.get(slug);
  if (!modulePath) return Promise.resolve(null);

  const promise = postLoaders[modulePath]().then((mod) => {
    const loaded: LoadedPost = {
      Component: mod.default,
      frontmatter: mod.frontmatter,
      toc: mod.toc ?? [],
      readingTime: mod.readingTime ?? 1,
    };
    postResolved.set(slug, loaded);
    return loaded;
  });
  postCache.set(slug, promise);
  return promise;
}

/** Sync read when already loaded (e.g. after prefetch). Skips Suspense deferral. */
export function peekPost(slug: string): LoadedPost | null | undefined {
  return postResolved.get(slug);
}

export function loadProject(slug: string): Promise<LoadedProject | null> {
  const existing = projectCache.get(slug);
  if (existing) return existing;

  const modulePath = projectPathBySlug.get(slug);
  if (!modulePath) return Promise.resolve(null);

  const promise = projectLoaders[modulePath]().then((mod) => {
    const loaded: LoadedProject = {
      Component: mod.default,
      frontmatter: mod.frontmatter,
      toc: mod.toc ?? [],
      readingTime: mod.readingTime ?? 1,
    };
    projectResolved.set(slug, loaded);
    return loaded;
  });
  projectCache.set(slug, promise);
  return promise;
}

/** Sync read when already loaded (e.g. after prefetch). Skips Suspense deferral. */
export function peekProject(slug: string): LoadedProject | null | undefined {
  return projectResolved.get(slug);
}

export function loadAbout(): Promise<LoadedAbout | null> {
  if (!aboutPath) {
    aboutResolved = null;
    return Promise.resolve(null);
  }
  if (!aboutCache) {
    aboutCache = aboutLoader[aboutPath]().then((mod) => {
      aboutResolved = { Component: mod.default };
      return aboutResolved;
    });
  }
  return aboutCache;
}

/** Sync read when already loaded (e.g. after prefetch). Skips Suspense deferral. */
export function peekAbout(): LoadedAbout | null | undefined {
  return aboutResolved;
}

export function adjacentPosts(slug: string) {
  const i = posts.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? posts[i - 1] : null,
    next: i >= 0 && i < posts.length - 1 ? posts[i + 1] : null,
  };
}

/** Preload MDX chunks before SSR so prerender resolves Suspense on first pass. */
export async function preloadContentForRoute(url: string): Promise<void> {
  const path = url.replace(/\/$/, "") || "/";

  if (path.startsWith("/blog/")) {
    await loadPost(path.slice("/blog/".length));
    return;
  }
  if (path.startsWith("/projects/")) {
    await loadProject(path.slice("/projects/".length));
    return;
  }
  if (path.startsWith("/tags/")) {
    const parts = path.slice("/tags/".length).split("/");
    if (parts.length >= 2) {
      const slug = parts[1]!;
      await Promise.all([loadPost(slug), loadProject(slug)]);
    }
    return;
  }
  if (path === "/about") {
    await loadAbout();
  }
}
