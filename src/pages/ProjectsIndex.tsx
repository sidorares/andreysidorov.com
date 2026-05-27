import { ProjectIndexCard } from "@/components/ProjectIndexCard";
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

      <ul className="grid md:grid-cols-2 gap-5 items-stretch">
        {projects.map((p) => (
          <li key={p.slug} className="min-h-0">
            <ProjectIndexCard
              to={`/projects/${p.slug}`}
              title={p.frontmatter.title}
              summary={p.frontmatter.summary}
              tech={p.frontmatter.tech}
            />
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
