import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL = process.env.SITE_URL || "https://example.com";
const SITE_NAME = "Developer Blog";

export async function generateFeeds() {
  try {
    const postsDir = path.resolve("content/posts");
    const files = (await fs.readdir(postsDir)).filter((f) =>
      /\.mdx?$/.test(f)
    );
    const posts = (
      await Promise.all(
        files.map(async (file) => {
          const raw = await fs.readFile(path.join(postsDir, file), "utf8");
          const { data } = matter(raw);
          if (data.draft) return null;
          const slug = file.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
          return {
            slug,
            title: data.title || slug,
            description: data.description || "",
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
          };
        })
      )
    )
      .filter(Boolean)
      .sort((a: any, b: any) => +new Date(b.date) - +new Date(a.date)) as any[];

    const distDir = path.resolve("dist");
    await fs.mkdir(distDir, { recursive: true });

    const rssItems = posts
      .map(
        (p) => `  <item>
    <title>${escape(p.title)}</title>
    <link>${SITE_URL}/blog/${p.slug}</link>
    <guid>${SITE_URL}/blog/${p.slug}</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <description>${escape(p.description)}</description>
  </item>`
      )
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${escape(SITE_NAME)}</title>
  <link>${SITE_URL}</link>
  <description>Notes &amp; experiments</description>
${rssItems}
</channel></rss>`;
    await fs.writeFile(path.join(distDir, "rss.xml"), rss);

    const projectsDir = path.resolve("content/projects");
    const projectFiles = (await fs.readdir(projectsDir)).filter((f) =>
      /\.mdx?$/.test(f)
    );
    const projectSlugs = projectFiles.map((file) =>
      file.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "")
    );

    const urls = [
      "",
      "/blog",
      "/projects",
      "/about",
      ...posts.map((p) => `/blog/${p.slug}`),
      ...projectSlugs.map((slug) => `/projects/${slug}`),
    ];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join("\n")}
</urlset>`;
    await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemap);

    // eslint-disable-next-line no-console
    console.log(
      `[feeds] wrote rss.xml, sitemap.xml (${posts.length} posts, ${projectSlugs.length} projects)`
    );
  } catch (e) {
    console.warn("[feeds] skipped:", (e as Error).message);
  }
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]!)
  );
}
