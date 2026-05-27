import { useParams, Link } from "react-router-dom";
import { getProject } from "@/lib/content";
import { MdxLayer } from "@/mdx/MdxLayer";
import { PageMeta } from "@/components/PageMeta";
import { Toc } from "@/components/Toc";
import NotFound from "./NotFound";
import { formatDate } from "@/lib/format";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;
  const { Component, frontmatter, toc } = project;

  return (
    <>
      <PageMeta
        title={frontmatter.title}
        description={frontmatter.summary}
        path={`/projects/${slug}`}
      />
      <article className="site-container py-16 grid lg:grid-cols-[1fr_220px] gap-12">
        <div className="w-full min-w-0">
          <Link
            to="/projects"
            className="mono-label hover:text-foreground transition-colors"
          >
            ← all projects
          </Link>
          <header className="mt-6 mb-10">
            {frontmatter.date && (
              <p className="mono-label mb-3">// {formatDate(frontmatter.date)}</p>
            )}
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">
              {frontmatter.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {frontmatter.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 mono-label">
              {frontmatter.tech?.map((t) => (
                <Link
                  key={t}
                  to={`/tags/${encodeURIComponent(t)}`}
                  className="prose-link"
                >
                  #{t}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex gap-4 font-mono text-xs">
              {frontmatter.repo && (
                <a
                  className="prose-link"
                  href={frontmatter.repo}
                  target="_blank"
                  rel="noreferrer"
                >
                  repo →
                </a>
              )}
              {frontmatter.url && (
                <a
                  className="prose-link"
                  href={frontmatter.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  live →
                </a>
              )}
            </div>
          </header>
          <MdxLayer>
            <div className="prose">
              <Component />
            </div>
          </MdxLayer>

          <hr className="divider-dotted" />
        </div>

        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <p className="mono-label mb-3">// on this page</p>
              <Toc toc={toc} />
            </div>
          </aside>
        )}
      </article>
    </>
  );
}
