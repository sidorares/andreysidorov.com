import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adjacentPosts, getPost } from "@/lib/content";
import { MdxLayer } from "@/mdx/MdxLayer";
import { formatDate } from "@/lib/format";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = getPost(slug);

  useEffect(() => {
    if (post) document.title = `${post.frontmatter.title} — Notes`;
  }, [post]);

  if (!post) return <NotFound />;
  const { Component, frontmatter, toc, readingTime } = post;
  const { prev, next } = adjacentPosts(slug);

  return (
    <article className="container py-16 grid lg:grid-cols-[1fr_220px] gap-12 max-w-5xl">
      <div className="max-w-2xl mx-auto lg:mx-0 w-full min-w-0">
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
              {frontmatter.tags.map((t) => <span key={t}>#{t}</span>)}
            </div>
          )}
        </header>

        <MdxLayer>
          <div className="prose prose-stone dark:prose-invert">
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
  );
}

function Toc({ toc }: { toc: { depth: number; text: string; id: string }[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [toc]);

  return (
    <ul className="space-y-2 text-sm">
      {toc.map((t) => (
        <li key={t.id} style={{ paddingLeft: (t.depth - 2) * 12 }}>
          <a
            href={`#${t.id}`}
            className={`block transition-colors ${
              active === t.id ? "text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
