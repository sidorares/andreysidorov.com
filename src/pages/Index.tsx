import { Link } from "react-router-dom";
import { posts, projects } from "@/lib/content";
import { siteConfig } from "@/site.config";
import { formatDate } from "@/lib/format";

export default function Home() {
  const featured = posts.filter((p) => p.frontmatter.featured).slice(0, 3);
  const list = (featured.length ? featured : posts).slice(0, 3);
  const featuredProjects = projects.filter((p) => p.frontmatter.featured).slice(0, 3);
  const projectList = (featuredProjects.length ? featuredProjects : projects).slice(0, 3);

  return (
    <div className="container max-w-3xl py-20">
      <section>
        <p className="mono-label mb-4">// {siteConfig.author.toLowerCase().replace(/\s+/g, "-")}</p>
        <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight">
          {siteConfig.tagline}
        </h1>
        <p className="mt-6 text-muted-foreground max-w-xl">
          A small corner of the internet for in-progress thinking, deep dives, and
          things I&apos;ve shipped. Updated when there&apos;s something worth saying.
        </p>
        <div className="mt-6 flex gap-4 font-mono text-xs">
          {siteConfig.socials.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="prose-link">
              {s.label} →
            </a>
          ))}
        </div>
      </section>

      <hr className="divider-dotted" />

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-2xl">Recent writing</h2>
          <Link to="/blog" className="mono-label hover:text-foreground transition-colors">all posts →</Link>
        </div>
        <ul className="divide-y divide-border">
          {list.map((p) => (
            <li key={p.slug}>
              <Link to={`/blog/${p.slug}`} className="group block py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-xl group-hover:text-accent transition-colors">
                    {p.frontmatter.title}
                  </h3>
                  <time className="mono-label shrink-0">{formatDate(p.frontmatter.date)}</time>
                </div>
                {p.frontmatter.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{p.frontmatter.description}</p>
                )}
              </Link>
            </li>
          ))}
          {list.length === 0 && (
            <li className="py-5 text-sm text-muted-foreground">No posts yet — drop an MDX file in <code>content/posts/</code>.</li>
          )}
        </ul>
      </section>

      <hr className="divider-dotted" />

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-2xl">Selected projects</h2>
          <Link to="/projects" className="mono-label hover:text-foreground transition-colors">all projects →</Link>
        </div>
        <ul className="grid sm:grid-cols-2 gap-4">
          {projectList.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/projects/${p.slug}`}
                className="block rounded-md border border-border p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-16px_hsl(0_0%_0%/0.2)] transition"
              >
                <div className="font-serif text-lg">{p.frontmatter.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{p.frontmatter.summary}</div>
                {p.frontmatter.tech && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.frontmatter.tech.map((t) => (
                      <span key={t} className="mono-label">{t}</span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
