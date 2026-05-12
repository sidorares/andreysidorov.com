import { visit } from "unist-util-visit";

// Default allowlist of runnable fence languages (rendered by components instead
// of shown as code). The site config can expand this.
const RUNNABLE_LANGS = new Set(["mermaid"]);

/**
 * Convert ```mermaid (or ```!anything) fences into MDX JSX elements that
 * point at runtime renderers. Unknown runnables fall back to normal code.
 */
export function remarkRunnableFences() {
  return (tree: any) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      if (node.type !== "code") return;
      if (!parent || typeof index !== "number") return;
      const raw = (node.lang || "").trim();
      if (!raw) return;

      let lang = raw;
      let forced = false;
      if (raw.startsWith("!")) {
        lang = raw.slice(1);
        forced = true;
      }

      if (!forced && !RUNNABLE_LANGS.has(lang)) return;

      // Replace with <RunnableFence lang="..." code={`...`} />
      const value = String(node.value ?? "");
      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "RunnableFence",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "lang",
            value: lang,
          },
          {
            type: "mdxJsxAttribute",
            name: "code",
            value: value,
          },
        ],
        children: [],
      };
    });
  };
}
