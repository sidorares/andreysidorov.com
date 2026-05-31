/**
 * Copy Tailwind preflight from the latest production CSS bundle into src/critical-preflight.css.
 * Run after `npm run build` when upgrading tailwindcss.
 */
import fs from "node:fs";
import { execSync } from "node:child_process";
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
const start = css.indexOf("*,:before,:after{--tw-border-spacing-x");
const end = css.indexOf(".container{width");

if (start < 0 || end < 0) {
  console.error("Could not locate preflight block in bundle CSS");
  process.exit(1);
}

const preflight = css
  .slice(start, end)
  .replace(/border-color:#e5e7eb/g, "border-color:hsl(var(--border))");

const out = path.join(root, "src", "critical-preflight.css");
const header =
  "/* Generated subset of Tailwind preflight — run: node scripts/extract-critical-preflight.mjs */\n";

fs.writeFileSync(out, `${header}${preflight}\n`);
console.log(`Wrote ${out} (${preflight.length} bytes)`);
