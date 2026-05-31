import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DistManifest } from "./generate-dist-manifest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PURGE_BATCH = 30;

function parseArgs(argv: string[]) {
  const opts = {
    dryRun: false,
    previous: path.join(root, "cloudflare", "dist-manifest.previous.json"),
    current: path.join(root, "cloudflare", "dist-manifest.json"),
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--previous" && argv[i + 1]) opts.previous = argv[++i];
    else if (arg === "--current" && argv[i + 1]) opts.current = argv[++i];
  }
  return opts;
}

async function readManifest(filePath: string): Promise<DistManifest | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as DistManifest;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

/** New Vite bundle paths do not need a purge — the URL is unique per content. */
function isNewFingerprintedAsset(
  rel: string,
  previous: DistManifest | null,
): boolean {
  if (!previous) return false;
  if (rel in previous.files) return false;
  const posix = rel.split(path.sep).join("/");
  if (posix.startsWith("assets/")) return true;
  return posix.includes("/assets/") && posix.startsWith("tags/");
}

/** Paths whose content hash changed (or were added/removed). */
export function diffManifests(
  previous: DistManifest | null,
  current: DistManifest,
): { changed: string[]; removed: string[] } {
  if (!previous) {
    return { changed: Object.keys(current.files), removed: [] };
  }

  const changed: string[] = [];
  const removed: string[] = [];

  for (const [rel, hash] of Object.entries(current.files)) {
    if (previous.files[rel] !== hash) changed.push(rel);
  }
  for (const rel of Object.keys(previous.files)) {
    if (!(rel in current.files)) removed.push(rel);
  }

  return { changed, removed };
}

export function selectPurgePaths(
  previous: DistManifest | null,
  changed: string[],
  removed: string[],
): string[] {
  const paths = [...new Set([...changed, ...removed])];
  if (!previous) return paths;
  return paths.filter((rel) => {
    if (removed.includes(rel)) return true;
    return !isNewFingerprintedAsset(rel, previous);
  });
}

/** Map dist-relative paths to public URL(s) to purge at Cloudflare. */
export function pathsToPurgeUrls(siteUrl: string, relPaths: string[]): string[] {
  const base = siteUrl.replace(/\/$/, "");
  const urls = new Set<string>();

  for (const rel of relPaths) {
    const posix = rel.split(path.sep).join("/");

    if (posix === "index.html") {
      urls.add(`${base}/`);
      urls.add(`${base}/index.html`);
      continue;
    }

    if (posix.endsWith("/index.html")) {
      const dir = posix.slice(0, -"index.html".length);
      urls.add(`${base}/${dir}`);
      urls.add(`${base}/${posix}`);
      continue;
    }

    urls.add(`${base}/${posix}`);
  }

  return [...urls].sort();
}

async function purgeUrls(
  zoneId: string,
  token: string,
  urls: string[],
): Promise<void> {
  for (let i = 0; i < urls.length; i += PURGE_BATCH) {
    const batch = urls.slice(i, i + PURGE_BATCH);
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: batch }),
      },
    );
    const body = (await res.json()) as { success: boolean; errors?: unknown[] };
    if (!res.ok || !body.success) {
      throw new Error(
        `Cloudflare purge failed (${res.status}): ${JSON.stringify(body.errors ?? body)}`,
      );
    }
    console.log(`[purge] purged ${batch.length} URL(s)`);
  }
}

async function purgeEverything(zoneId: string, token: string): Promise<void> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ purge_everything: true }),
    },
  );
  const body = (await res.json()) as { success: boolean; errors?: unknown[] };
  if (!res.ok || !body.success) {
    throw new Error(
      `Cloudflare purge_everything failed: ${JSON.stringify(body.errors ?? body)}`,
    );
  }
  console.log("[purge] purge_everything succeeded");
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const siteUrl = process.env.SITE_URL || "https://andreysidorov.com";
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  const purgeAll = process.env.CLOUDFLARE_PURGE_EVERYTHING === "true";

  const current = await readManifest(opts.current);
  if (!current) {
    console.error(`[purge] missing current manifest: ${opts.current}`);
    process.exit(1);
  }

  const previous = await readManifest(opts.previous);
  const { changed, removed } = diffManifests(previous, current);
  const relPaths = selectPurgePaths(previous, changed, removed);
  const urls = pathsToPurgeUrls(siteUrl, relPaths);

  if (relPaths.length === 0) {
    console.log("[purge] no file changes — nothing to purge");
    return;
  }

  console.log(
    `[purge] ${relPaths.length} path(s) → ${urls.length} URL(s)${previous ? "" : " (first deploy — all files)"}`,
  );

  if (opts.dryRun) {
    for (const url of urls) console.log(`  ${url}`);
    return;
  }

  if (!token || !zoneId) {
    console.log("[purge] skipped — set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID");
    return;
  }

  if (purgeAll) {
    await purgeEverything(zoneId, token);
    return;
  }

  if (urls.length === 0) return;
  await purgeUrls(zoneId, token, urls);
}

main().catch((err) => {
  console.error("[purge] failed:", err);
  process.exit(1);
});
