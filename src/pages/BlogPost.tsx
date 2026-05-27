import { Link, useParams } from "react-router-dom";
import { TagLink } from "@/components/TagLink";
import { adjacentPosts, getPost } from "@/lib/content";
import { MdxLayer } from "@/mdx/MdxLayer";
import { formatDate } from "@/lib/format";
import { PageMeta } from "@/components/PageMeta";
import { Toc } from "@/components/Toc";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = getPost(slug);

  if (!post) return <NotFound />;
  const { Component, frontmatter, toc, readingTime } = post;
  const { prev, next } = adjacentPosts(slug);

  return (
    <>
      <PageMeta
        title={frontmatter.title}
        description={frontmatter.description}
        path={`/blog/${slug}`}
      />
      <article className="site-container py-16 grid lg:grid-cols-[1fr_220px] gap-12">
      <div className="w-full min-w-0">
        <header className="mb-10">
          <p className="mono-label mb-3">
            // {formatDate(frontmatter.date)} · {readingTime} min read
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-tight">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="mt-4 text-lg text-muted-foreground">{frontmatter.description}</p>
          )}
          {frontmatter.tags && (
            <div className="mt-4 flex gap-3 mono-label">
              {frontmatter.tags.map((t) => (
                <TagLink key={t} tag={t} className="prose-link" />
              ))}
            </div>
          )}
        </header>

        <MdxLayer>
          <div className="prose">
            <Component />
          </div>
        </MdxLayer>

        <hr className="divider-dotted" />

        <nav className="grid grid-cols-2 gap-4 text-sm">
          <div>
            {prev && (
              <Link to={`/blog/${prev.slug}`} className="group block">
                <div className="mono-label mb-1">← previous</div>
                <div className="font-serif text-lg group-hover:text-accent transition-colors">
                  {prev.frontmatter.title}
                </div>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link to={`/blog/${next.slug}`} className="group block">
                <div className="mono-label mb-1">next →</div>
                <div className="font-serif text-lg group-hover:text-accent transition-colors">
                  {next.frontmatter.title}
                </div>
              </Link>
            )}
          </div>
        </nav>
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

