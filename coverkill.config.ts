/**
 * Coverage scenarios for this site (see e2e/scenarios/).
 *
 * Pruning `src/` against `npm run dev` currently skips every file because Vite
 * serves transformed TS/CSS that does not byte-match disk (coverkill safety
 * check). Use dry-run / collect to validate scenarios; prune `src/` once
 * coverkill adds source-map support, or point include at built assets you
 * intend to shrink.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "coverkill";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Map Vite dev-server URLs to files on disk.
 * defaultSourcePath handles `/src/...`; we add `@fs` and skip virtual deps.
 */
function sourcePath(url: string): string | null {
  try {
    console.log('Source path: ', url);
    const { pathname, hostname, protocol } = new URL(url);

    if (protocol === "http:" || protocol === "https:") {
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        return null;
      }
    }
    if (pathname.startsWith("/assets/")) {
      return path.join(rootDir, 'dist', pathname.slice(1));
    }
  } catch {
    // fall through to defaultSourcePath
  }

  return null;
}

export default defineConfig({
  rootDir,
  baseURL: "http://localhost:8080",
  scenarios: ["./e2e/scenarios/*.ts"],
  webServer: {
    command: "npx serve -p 8080 dist",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
  },
  coverage: {
    js: { resetOnNavigation: false },
    css: true,
  },
  include: ['dist/**'],
  exclude: [],
  sourcePath,
});
