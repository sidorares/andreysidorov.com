import { Link } from "react-router-dom";
import { projects } from "@/lib/content";
import { PageMeta } from "@/components/PageMeta";

export default function ProjectsIndex() {
  return (
    <>
      <PageMeta title="Projects" description="Selected work and experiments." path="/projects" />
      <div className="site-container py-16">
      <p className="mono-label mb-3">// selected work</p>
      <h1 className="font-serif text-4xl mb-2">Projects</h1>
      <p className="text-muted-foreground mb-10">Things built, shipped, or still cooking.</p>

      <ul className="grid md:grid-cols-2 gap-5">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/projects/${p.slug}`}
              className="block h-full rounded-md border border-border p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-16px_hsl(0_0%_0%/0.2)] transition"
            >
              <div className="font-serif text-xl">{p.frontmatter.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{p.frontmatter.summary}</div>
              {p.frontmatter.tech && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.frontmatter.tech.map((t) => (
                    <span key={t} className="mono-label border border-border rounded px-2 py-0.5">{t}</span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
        {projects.length === 0 && (
          <li className="text-sm text-muted-foreground">No projects yet — add an MDX file in <code>content/projects/</code>.</li>
        )}
      </ul>
    </div>
    </>
  );
}
