import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

function slugFromFilename(file: string) {
  return file.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

async function slugsFromDir(
  relativeDir: string,
  skipDrafts: boolean
): Promise<string[]> {
  const dir = path.resolve(relativeDir);
  const files = (await fs.readdir(dir)).filter((f) => /\.mdx?$/.test(f));
  const slugs: string[] = [];

  for (const file of files) {
    if (skipDrafts) {
      const raw = await fs.readFile(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      if (data.draft) continue;
    }
    slugs.push(slugFromFilename(file));
  }

  return slugs;
}

async function tagsFromDir(
  relativeDir: string,
  skipDrafts: boolean,
  extract: (data: Record<string, unknown>) => unknown
): Promise<string[]> {
  const dir = path.resolve(relativeDir);
  const files = (await fs.readdir(dir)).filter((f) => /\.mdx?$/.test(f));
  const tags = new Set<string>();

  for (const file of files) {
    if (skipDrafts) {
      const raw = await fs.readFile(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      if (data.draft) continue;
    }

    const raw = await fs.readFile(path.join(dir, file), "utf8");
    const { data } = matter(raw);
    const extracted = extract(data);
    if (!Array.isArray(extracted)) continue;

    for (const t of extracted) {
      if (typeof t === "string") {
        const normalized = t.trim().toLowerCase();
        if (normalized) tags.add(normalized);
      }
    }
  }

  return Array.from(tags);
}

/** Paths passed to react-router StaticRouter (no basename prefix). */
export async function getStaticRoutes(): Promise<string[]> {
  const [postSlugs, projectSlugs] = await Promise.all([
    slugsFromDir("content/posts", true),
    slugsFromDir("content/projects", false),
  ]);

  const [postTags, projectTechTags] = await Promise.all([
    tagsFromDir("content/posts", true, (data) => data.tags),
    tagsFromDir("content/projects", false, (data) => data.tech),
  ]);

  const allTags = Array.from(new Set([...postTags, ...projectTechTags])).sort();

  return [
    "/",
    "/blog",
    "/projects",
    "/about",
    ...allTags.map((tag) => `/tags/${encodeURIComponent(tag)}`),
    ...postSlugs.map((slug) => `/blog/${slug}`),
    ...projectSlugs.map((slug) => `/projects/${slug}`),
  ];
}

/** Renders the NotFound route during prerender. */
export const NOT_FOUND_ROUTE = "/__ssg_not_found__";
