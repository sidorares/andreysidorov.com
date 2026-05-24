/**
 * Site-wide configuration.
 *
 * `runnableFences` lists fence language ids that may run as components when the
 * author prefixes the fence with `!` (e.g. ```!mermaid). Without `!`, fences
 * always render as syntax-highlighted source. Handlers live in `RunnableFence`.
 */
export const siteConfig = {
  name: "andreysidorov.com",
  title: "Personal blog and portfolio of Andrey Sidorov",
  tagline: "Building things on the web. Notes, experiments, selected work.",
  author: "Andrey Sidorov",
  email: "hello@andreysidorov.com",
  socials: [
    { label: "LinkedIn", url: "https://linkedin.com/in/andreysidorov" },
    { label: "X", url: "https://x.com/sidorares" },
    { label: "GitHub", url: "https://github.com/sidorares" },
  ],
  runnableFences: ["mermaid"] as const,
};
