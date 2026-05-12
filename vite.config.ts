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
import { generateFeeds } from "./scripts/generate-feeds";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.BASE_PATH || "/",
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
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
    {
      name: "generate-feeds",
      apply: "build" as const,
      closeBundle: async () => {
        await generateFeeds();
      },
    },
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
