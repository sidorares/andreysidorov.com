import { loadAbout, loadPost, loadProject } from "@/lib/content";

function canPrefetch(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as any).connection as
    | { saveData?: boolean; effectiveType?: string }
    | undefined;
  if (conn?.saveData) return false;
  const type = conn?.effectiveType;
  if (type === "slow-2g" || type === "2g") return false;
  return true;
}

function stripTrailingSlash(path: string): string {
  return path.replace(/\/$/, "") || "/";
}

function normalizePath(href: string): string | null {
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") || "";
    const path = stripTrailingSlash(url.pathname);
    if (base && path.startsWith(base)) {
      return stripTrailingSlash(path.slice(base.length) || "/");
    }
    return path;
  } catch {
    return null;
  }
}

export type PrefetchReason =
  | "focus"
  | "hover"
  | "touchstart"
  | "mousedown"
  | "viewport-idle"
  | "trajectory";

const inflight = new Map<string, Promise<unknown>>();

export function prefetchHref(href: string, _reason: PrefetchReason): void {
  if (!canPrefetch()) return;
  const path = normalizePath(href);
  if (!path) return;
  void prefetchPath(path);
}

export function prefetchPath(path: string): Promise<void> {
  const p = stripTrailingSlash(path);
  const existing = inflight.get(p);
  if (existing) return existing.then(() => undefined);

  let promise: Promise<unknown> | null = null;

  if (p === "/about") promise = loadAbout();
  else if (p.startsWith("/blog/")) promise = loadPost(p.slice("/blog/".length));
  else if (p.startsWith("/projects/"))
    promise = loadProject(p.slice("/projects/".length));
  else if (p.startsWith("/tags/")) {
    const parts = p.slice("/tags/".length).split("/").filter(Boolean);
    if (parts.length >= 2) {
      const slug = parts[1]!;
      promise = Promise.all([loadPost(slug), loadProject(slug)]);
    }
  }

  if (!promise) return Promise.resolve();

  inflight.set(p, promise);
  return promise
    .catch(() => undefined)
    .then(() => undefined)
    .finally(() => {
      inflight.delete(p);
    });
}

