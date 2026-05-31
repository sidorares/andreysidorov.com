import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const outPath =
  process.env.DIST_MANIFEST_PATH ??
  path.join(root, "cloudflare", "dist-manifest.json");

/** Not published to GitHub Pages / Cloudflare. */
const SKIP_PREFIXES = ["server/", "server\\"];

export type DistManifest = {
  generatedAt: string;
  files: Record<string, string>;
};

async function walk(dir: string, base = distDir): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(abs, base)));
    } else if (entry.isFile()) {
      files.push(path.relative(base, abs).split(path.sep).join("/"));
    }
  }
  return files;
}

async function sha256File(filePath: string): Promise<string> {
  const buf = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

async function main() {
  try {
    await fs.stat(distDir);
  } catch {
    console.error("[manifest] dist/ not found — run npm run build first");
    process.exit(1);
  }

  const relPaths = (await walk(distDir)).filter(
    (rel) => !SKIP_PREFIXES.some((p) => rel.startsWith(p)),
  );

  const files: Record<string, string> = {};
  for (const rel of relPaths.sort()) {
    files[rel] = await sha256File(path.join(distDir, rel));
  }

  const manifest: DistManifest = {
    generatedAt: new Date().toISOString(),
    files,
  };

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`[manifest] ${relPaths.length} file(s) → ${path.relative(root, outPath)}`);
}

main().catch((err) => {
  console.error("[manifest] failed:", err);
  process.exit(1);
});
