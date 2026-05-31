import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PARTS = {
  index: [
    "critical-preflight.css",
    "critical.css",
    "fonts/fallbacks.css",
    "fonts/fonts.css",
  ],
  content: [
    "critical-preflight.css",
    "critical.css",
    "critical-content.css",
    "critical-prose.css",
    "fonts/fallbacks.css",
    "fonts/fonts.css",
  ],
} as const;

export type CriticalCssVariant = keyof typeof PARTS;

export function assembleCriticalCss(variant: CriticalCssVariant): string {
  return PARTS[variant]
    .map((file) => {
      const filePath = path.join(root, "src", file);
      if (!fs.existsSync(filePath)) {
        throw new Error(
          `Missing src/${file} — run "npm run fonts"` +
            (file === "critical-prose.css"
              ? ' and "node scripts/extract-critical-prose.mjs" after a build'
              : ""),
        );
      }
      return fs.readFileSync(filePath, "utf8");
    })
    .join("\n\n");
}
