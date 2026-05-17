import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
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
}

main().catch((err) => {
  console.error("[ssg] failed:", err);
  process.exit(1);
});
