export function tagPath(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}`;
}
