import { Link } from "react-router-dom";
import { PostIndexCard } from "@/components/PostIndexCard";
import { ProjectIndexCard } from "@/components/ProjectIndexCard";
import { posts, projects } from "@/lib/content";
import { siteConfig } from "@/site.config";
import { PageMeta } from "@/components/PageMeta";

export default function Home() {
  const featured = posts.filter((p) => p.frontmatter.featured).slice(0, 3);
  const list = (featured.length ? featured : posts).slice(0, 3);
  const featuredProjects = projects.filter((p) => p.frontmatter.featured).slice(0, 3);
  const projectList = (featuredProjects.length ? featuredProjects : projects).slice(0, 3);

  return (
    <>
      <PageMeta
        title={siteConfig.title}
        description="A developer blog and portfolio. Notes, experiments, and selected work."
        path="/"
      />
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
        <ul className="grid sm:grid-cols-2 gap-4 items-stretch">
          {list.map((p) => (
            <li key={p.slug} className="min-h-0">
              <PostIndexCard
                to={`/blog/${p.slug}`}
                title={p.frontmatter.title}
                date={p.frontmatter.date}
                description={p.frontmatter.description}
                tags={p.frontmatter.tags}
              />
            </li>
          ))}
          {list.length === 0 && (
            <li className="col-span-full py-5 text-sm text-muted-foreground">No posts yet — drop an MDX file in <code>content/posts/</code>.</li>
          )}
        </ul>
      </section>

      <hr className="divider-dotted" />

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-2xl">Selected projects</h2>
          <Link to="/projects" className="mono-label hover:text-foreground transition-colors">all projects →</Link>
        </div>
        <ul className="grid sm:grid-cols-2 gap-4 items-stretch">
          {projectList.map((p) => (
            <li key={p.slug} className="min-h-0">
              <ProjectIndexCard
                to={`/projects/${p.slug}`}
                title={p.frontmatter.title}
                summary={p.frontmatter.summary}
                tech={p.frontmatter.tech}
                titleClassName="font-serif text-lg"
                padding="p-5"
                techStyle="plain"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
    </>
  );
}
