/**
 * Site-wide configuration.
 *
 * `runnableFences` is the allowlist of fence languages that get rendered as
 * components instead of highlighted source. You can also force-render any
 * fence on a per-post basis by prefixing its language with `!` (e.g. `!mermaid`).
 */
export const siteConfig = {
  name: "Notes",
  title: "Notes — a developer blog",
  tagline: "Building things on the web. Notes, experiments, selected work.",
  author: "Your Name",
  email: "hello@example.com",
  socials: [
    { label: "GitHub", url: "https://github.com" },
    { label: "X", url: "https://x.com" },
    { label: "LinkedIn", url: "https://linkedin.com" },
  ],
  runnableFences: ["mermaid"] as const,
};
