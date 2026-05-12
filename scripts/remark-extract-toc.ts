import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";

/**
 * Extract h2/h3 headings into the MDX module's exported `toc` array, plus a
 * `readingTime` (minutes, rounded up).
 */
export function remarkExtractToc() {
  return (tree: any) => {
    const slugger = new GithubSlugger();
    const toc: Array<{ depth: number; text: string; id: string }> = [];
    let words = 0;

    visit(tree, (node: any) => {
      if (node.type === "heading" && (node.depth === 2 || node.depth === 3)) {
        const text = toString(node);
        const id = slugger.slug(text);
        toc.push({ depth: node.depth, text, id });
      }
      if (node.type === "text" && typeof node.value === "string") {
        words += node.value.trim().split(/\s+/).filter(Boolean).length;
      }
    });

    const readingTime = Math.max(1, Math.ceil(words / 220));

    // Inject `export const toc = [...]; export const readingTime = N;`
    tree.children.unshift({
      type: "mdxjsEsm",
      value: "",
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            buildExport("toc", toc),
            buildExport("readingTime", readingTime),
          ],
        },
      },
    });
  };
}

function buildExport(name: string, value: any) {
  return {
    type: "ExportNamedDeclaration",
    specifiers: [],
    declaration: {
      type: "VariableDeclaration",
      kind: "const",
      declarations: [
        {
          type: "VariableDeclarator",
          id: { type: "Identifier", name },
          init: literal(value),
        },
      ],
    },
  };
}

function literal(value: any): any {
  if (value === null) return { type: "Literal", value: null, raw: "null" };
  if (typeof value === "string")
    return { type: "Literal", value, raw: JSON.stringify(value) };
  if (typeof value === "number")
    return { type: "Literal", value, raw: String(value) };
  if (typeof value === "boolean")
    return { type: "Literal", value, raw: String(value) };
  if (Array.isArray(value)) {
    return { type: "ArrayExpression", elements: value.map(literal) };
  }
  if (typeof value === "object") {
    return {
      type: "ObjectExpression",
      properties: Object.entries(value).map(([k, v]) => ({
        type: "Property",
        kind: "init",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Identifier", name: k },
        value: literal(v),
      })),
    };
  }
  return { type: "Literal", value: null, raw: "null" };
}
