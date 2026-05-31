/**
 * Copy .prose typography rules from the latest production CSS bundle into src/critical-prose.css.
 * Run after `npm run build` when upgrading @tailwindcss/typography or prose theme config.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distAssets = path.join(root, "dist", "assets");
const cssFile = fs
  .readdirSync(distAssets)
  .find((name) => name.startsWith("index-") && name.endsWith(".css"));

if (!cssFile) {
  console.error("Run npm run build first — no dist/assets/index-*.css found");
  process.exit(1);
}

const css = fs.readFileSync(path.join(distAssets, cssFile), "utf8");
const start = css.indexOf(".prose{");
const end = css.indexOf(".site-container{", start);

if (start < 0 || end < 0) {
  console.error("Could not locate .prose block in bundle CSS");
  process.exit(1);
}

const prose = css.slice(start, end);
const out = path.join(root, "src", "critical-prose.css");
const header =
  "/* Generated @tailwindcss/typography subset — run: node scripts/extract-critical-prose.mjs */\n";

fs.writeFileSync(out, `${header}${prose}\n`);
console.log(`Wrote ${out} (${prose.length} bytes)`);
