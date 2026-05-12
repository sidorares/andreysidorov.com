import { createHighlighter, type Highlighter } from "shiki";
import { visit } from "unist-util-visit";
import { fromHtml } from "hast-util-from-html";

let highlighterPromise: Promise<Highlighter> | null = null;

const LANGS = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "json",
  "bash",
  "sh",
  "css",
  "html",
  "md",
  "mdx",
  "yaml",
  "python",
  "rust",
  "go",
];

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: LANGS,
    });
  }
  return highlighterPromise;
}

// rehype plugin: walks <pre><code class="language-xxx">…</code></pre> and
// replaces with shiki-highlighted HTML. Skips runnable fences (already replaced).
export function rehypeShikiHighlight() {
  return async (tree: any) => {
    const tasks: Array<() => Promise<void>> = [];
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      if (
        node.type !== "element" ||
        node.tagName !== "pre" ||
        !node.children?.[0] ||
        node.children[0].tagName !== "code"
      )
        return;
      if (node.properties?.dataRunnable) return;
      const codeNode = node.children[0];
      const className: string[] = codeNode.properties?.className || [];
      const langClass = className.find((c) => c.startsWith("language-"));
      const lang = langClass ? langClass.replace("language-", "") : "text";
      const value = (codeNode.children?.[0]?.value as string) || "";
      tasks.push(async () => {
        const hl = await getHighlighter();
        const supported = LANGS.includes(lang) ? lang : "text";
        let html: string;
        try {
          html = hl.codeToHtml(value, {
            lang: supported,
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false,
          });
        } catch {
          html = `<pre><code>${escape(value)}</code></pre>`;
        }
        const parsed = fromHtml(html, { fragment: true });
        const wrapper = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["code-block"],
            "data-lang": lang,
          },
          children: parsed.children,
        };
        if (parent && typeof index === "number") {
          parent.children[index] = wrapper;
        }
      });
    });
    await Promise.all(tasks.map((t) => t()));
  };
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
