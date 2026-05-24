import { useParams, Link } from "react-router-dom";
import { getProject } from "@/lib/content";
import { MdxLayer } from "@/mdx/MdxLayer";
import { PageMeta } from "@/components/PageMeta";
import NotFound from "./NotFound";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;
  const { Component, frontmatter } = project;

  return (
    <>
      <PageMeta
        title={frontmatter.title}
        description={frontmatter.summary}
        path={`/projects/${slug}`}
      />
      <article className="site-container py-16">
      <Link to="/projects" className="mono-label hover:text-foreground transition-colors">← all projects</Link>
      <header className="mt-6 mb-10">
        <h1 className="font-serif text-4xl md:text-5xl leading-tight">{frontmatter.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{frontmatter.summary}</p>
        <div className="mt-4 flex flex-wrap gap-3 mono-label">
          {frontmatter.tech?.map((t) => <span key={t}>#{t}</span>)}
        </div>
        <div className="mt-4 flex gap-4 font-mono text-xs">
          {frontmatter.repo && <a className="prose-link" href={frontmatter.repo} target="_blank" rel="noreferrer">repo →</a>}
          {frontmatter.url && <a className="prose-link" href={frontmatter.url} target="_blank" rel="noreferrer">live →</a>}
        </div>
      </header>
      <MdxLayer>
        <div className="prose prose-stone dark:prose-invert">
          <Component />
        </div>
      </MdxLayer>
    </article>
    </>
  );
}
