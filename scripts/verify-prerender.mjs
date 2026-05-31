import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const checks = [
  {
    file: "about/index.html",
    mustInclude: "developer who likes small tools",
  },
  {
    file: "blog/hello-world/index.html",
    mustInclude: "Hello, world",
  },
  {
    file: "blog/on-static-sites/index.html",
    mustInclude: "static site you actually want to write in",
  },
  {
    file: "projects/notes-engine/index.html",
    mustInclude: "Notes Engine",
  },
];

const abortMarker = "Switched to client rendering";

async function main() {
  const failures = [];

  for (const { file, mustInclude } of checks) {
    const fullPath = path.join(dist, file);
    let html;
    try {
      html = await fs.readFile(fullPath, "utf8");
    } catch {
      failures.push(`missing ${file}`);
      continue;
    }
    if (!html.includes(mustInclude)) {
      failures.push(`${file}: expected "${mustInclude}" in prerendered HTML`);
    }
  }

  for (const { file } of checks) {
    const fullPath = path.join(dist, file);
    try {
      const html = await fs.readFile(fullPath, "utf8");
      if (html.includes(abortMarker)) {
        failures.push(`${file}: contains client-render abort marker`);
      }
    } catch {
      // already reported above
    }
  }

  if (failures.length > 0) {
    console.error("[verify-prerender] failed:");
    for (const msg of failures) console.error(`  - ${msg}`);
    process.exit(1);
  }

  console.log(`[verify-prerender] ok (${checks.length} routes)`);
}

main().catch((err) => {
  console.error("[verify-prerender] failed:", err);
  process.exit(1);
});
