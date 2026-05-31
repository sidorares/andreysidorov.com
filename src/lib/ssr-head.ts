/** Tags React 19 emits in the app tree during prerender (metadata + image preloads). */
const HEAD_TAG_PATTERNS = [
  /<link\s[^>]*\brel=["']preload["'][^>]*\/?>/gi,
  /<title\b[^>]*>[\s\S]*?<\/title>/gi,
  /<meta\b[^>]*\/?>/gi,
  /<link\b[^>]*\/?>/gi,
  /<base\b[^>]*\/?>/gi,
] as const;

/**
 * Collect head tags from the SSR app HTML. React 19 includes metadata in the
 * render output; react-helmet-async no longer fills `helmetContext` on React 19.
 * Tags are left in the app HTML so client hydration stays in sync.
 */
export function collectSsrHeadTags(appHtml: string): string {
  const seen = new Set<string>();
  const tags: string[] = [];

  for (const pattern of HEAD_TAG_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of appHtml.matchAll(pattern)) {
      const tag = match[0];
      if (seen.has(tag)) continue;
      seen.add(tag);
      tags.push(tag);
    }
  }

  return tags.join("\n    ");
}

/** Remove hoisted head tags from the SSR body so they are not duplicated in #root. */
export function stripHeadTagsFromAppHtml(appHtml: string): string {
  let html = appHtml;
  for (const pattern of HEAD_TAG_PATTERNS) {
    pattern.lastIndex = 0;
    html = html.replace(pattern, "");
  }
  return html;
}
