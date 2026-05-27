import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";
import { getStaticRoutes, NOT_FOUND_ROUTE } from "./content-routes";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const templatePath = path.join(distDir, "index.html");
const serverEntry = path.join(distDir, "server", "entry-server.js");

type RenderResult = { html: string; head: string };
type RenderFn = (url: string) => RenderResult;

function routeToOutFile(route: string) {
  if (route === "/") return path.join(distDir, "index.html");
  const segments = route.replace(/^\//, "").split("/");
  return path.join(distDir, ...segments, "index.html");
}

function inject(template: string, appHtml: string, headHtml: string) {
  let html = template;
  if (html.includes("<!--ssr-head-->")) {
    html = html.replace("<!--ssr-head-->", headHtml);
  } else {
    html = html.replace("</head>", `${headHtml}\n  </head>`);
  }
  return html.replace("<!--ssr-outlet-->", appHtml);
}

async function writeHtml(filePath: string, contents: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents);
}

function slugFromFilename(file: string) {
  return file.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

type TaggedCopy = {
  tag: string;
  encodedTag: string;
  slug: string;
  sourceType: "blog" | "projects";
};

async function collectTaggedCopies(rootDir: string): Promise<TaggedCopy[]> {
  const postsDir = path.join(rootDir, "content/posts");
  const projectsDir = path.join(rootDir, "content/projects");

  const [postFiles, projectFiles] = await Promise.all([
    fs.readdir(postsDir),
    fs.readdir(projectsDir),
  ]);

  const copies: TaggedCopy[] = [];

  for (const file of postFiles) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = await fs.readFile(path.join(postsDir, file), "utf8");
    const { data } = matter(raw);
    if (data.draft) continue;

    const slug = slugFromFilename(file);
    const tags = Array.isArray(data.tags) ? data.tags : [];
    for (const t of tags) {
      if (typeof t !== "string" || !t.trim()) continue;
      const normalized = t.trim().toLowerCase();
      copies.push({
        tag: normalized,
        encodedTag: encodeURIComponent(normalized),
        slug,
        sourceType: "blog",
      });
    }
  }

  for (const file of projectFiles) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = await fs.readFile(path.join(projectsDir, file), "utf8");
    const { data } = matter(raw);
    if (data.draft) continue;

    const slug = slugFromFilename(file);
    const tech = Array.isArray(data.tech) ? data.tech : [];
    for (const t of tech) {
      if (typeof t !== "string" || !t.trim()) continue;
      const normalized = t.trim().toLowerCase();
      copies.push({
        tag: normalized,
        encodedTag: encodeURIComponent(normalized),
        slug,
        sourceType: "projects",
      });
    }
  }

  return copies;
}

async function copyTaggedPages(distDir: string, rootDir: string) {
  const assetsSrcDir = path.join(distDir, "assets");
  const taggedCopies = await collectTaggedCopies(rootDir);

  if (taggedCopies.length === 0) return;

  // Avoid leaving behind stale folder names (e.g. old uppercase tags)
  // without deleting the prerendered tag index pages.
  const tagsRoot = path.join(distDir, "tags");
  try {
    const entries = await fs.readdir(tagsRoot, { withFileTypes: true });
    await Promise.all(
      entries
        .filter((e) => e.isDirectory() && e.name !== e.name.toLowerCase())
        .map((e) => fs.rm(path.join(tagsRoot, e.name), { recursive: true, force: true })),
    );
  } catch {
    // tags folder might not exist yet
  }

  for (const c of taggedCopies) {
    const srcIndex = path.join(
      distDir,
      c.sourceType,
      c.slug,
      "index.html",
    );
    // Only copy pages that exist (should always be true since we prerender all blog/projects slugs).
    try {
      await fs.stat(srcIndex);
    } catch {
      continue;
    }

    const destDir = path.join(distDir, "tags", c.encodedTag, c.slug);
    const destIndex = path.join(destDir, "index.html");
    const destAssetsDir = path.join(destDir, "assets");

    await fs.mkdir(destDir, { recursive: true });
    await fs.copyFile(srcIndex, destIndex);

    // Copy the Vite build assets alongside the copied HTML so pages can be served as standalone folders.
    await fs.rm(destAssetsDir, { recursive: true, force: true });
    await fs.cp(assetsSrcDir, destAssetsDir, { recursive: true });

    // Make asset URLs relative to this folder.
    const html = await fs.readFile(destIndex, "utf8");
    const rewritten = html.replace(/(["'])\/assets\//g, `$1./assets/`);
    await fs.writeFile(destIndex, rewritten);

    // eslint-disable-next-line no-console
    console.log(
      `[ssg] copied tagged page: ${c.sourceType}/${c.slug} → tags/${c.encodedTag}/${c.slug}`,
    );
  }
}

async function main() {
  const template = await fs.readFile(templatePath, "utf8");
  const { render } = (await import(pathToFileURL(serverEntry).href)) as {
    render: RenderFn;
  };

  const routes = await getStaticRoutes();
  for (const route of routes) {
    const { html, head } = render(route);
    const out = inject(template, html, head);
    const file = routeToOutFile(route);
    await writeHtml(file, out);
    // eslint-disable-next-line no-console
    console.log(`[ssg] ${route} → ${path.relative(root, file)}`);
  }

  const notFound = render(NOT_FOUND_ROUTE);
  const notFoundHtml = inject(template, notFound.html, notFound.head);
  await writeHtml(path.join(distDir, "404.html"), notFoundHtml);
  // eslint-disable-next-line no-console
  console.log(`[ssg] 404 fallback → dist/404.html (${routes.length} routes)`);

  await copyTaggedPages(distDir, root);
}

main().catch((err) => {
  console.error("[ssg] failed:", err);
  process.exit(1);
});
