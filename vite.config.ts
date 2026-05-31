import fs from "node:fs";
import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import path from "path";
import { componentTagger } from "lovable-tagger";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeShikiHighlight } from "./scripts/rehype-shiki-highlight";
import { remarkRunnableFences } from "./scripts/remark-runnable-fences";
import { remarkExtractToc } from "./scripts/remark-extract-toc";

function generateContentManifest() {
  execSync("tsx scripts/generate-content-manifest.ts", {
    cwd: path.resolve(import.meta.dirname),
    stdio: "inherit",
  });
}

function contentManifestPlugin() {
  return {
    name: "content-manifest",
    buildStart: generateContentManifest,
    configureServer: generateContentManifest,
  };
}

function inlineCriticalCssPlugin() {
  const criticalPath = path.resolve(import.meta.dirname, "src/critical.css");
  return {
    name: "inline-critical-css",
    transformIndexHtml(html: string) {
      const critical = fs.readFileSync(criticalPath, "utf8");
      return html.replace(
        "<!--critical-css-->",
        `<style>${critical}</style>`,
      );
    },
  };
}

const stylesheetLinkRe =
  /<link\s([^>]*?\brel=["']stylesheet["'][^>]*)\/?>/gi;

function deferCssPlugin() {
  return {
    name: "defer-css",
    apply: "build" as const,
    transformIndexHtml: {
      order: "post" as const,
      handler(html: string) {
        return html.replace(stylesheetLinkRe, (_match, attrs: string) => {
          const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1];
          if (!href) return _match;

          const linkAttrs = attrs.replace(/\brel=["']stylesheet["']/i, "").trim();
          return [
            `<link rel="preload" ${linkAttrs} as="style" onload="this.onload=null;this.rel='stylesheet'">`,
            `<noscript><link rel="stylesheet" ${linkAttrs}></noscript>`,
          ].join("\n    ");
        });
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.BASE_PATH || "/",
  define: {
    "import.meta.env.VITE_SITE_URL": JSON.stringify(
      process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? "https://andreysidorov.com",
    ),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    contentManifestPlugin(),
    inlineCriticalCssPlugin(),
    deferCssPlugin(),
    {
      enforce: "pre" as const,
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "frontmatter" }],
          remarkGfm,
          remarkRunnableFences,
          remarkExtractToc,
        ],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          rehypeShikiHighlight,
        ],
      }),
    },
    react({ jsxImportSource: undefined }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));
