import { visit } from "unist-util-visit";
import { siteConfig } from "../src/site.config";

const RUNNABLE = new Set(siteConfig.runnableFences as readonly string[]);

/**
 * Converts ```!lang fences into `<RunnableFence>` when `lang` is listed in
 * `siteConfig.runnableFences`. The `!` prefix is required — without it, the
 * fence stays normal highlighted/source code.
 */
export function remarkRunnableFences() {
  return (tree: any) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      if (node.type !== "code") return;
      if (!parent || typeof index !== "number") return;
      const raw = (node.lang || "").trim();
      if (!raw.startsWith("!")) return;

      const lang = raw.slice(1).trim();
      if (!lang || !RUNNABLE.has(lang)) return;

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
