import { useState } from "react";
import { Link } from "react-router-dom";
import { posts, allTags } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { PageMeta } from "@/components/PageMeta";

export default function BlogIndex() {
  const [tag, setTag] = useState<string | null>(null);
  const filtered = tag ? posts.filter((p) => p.frontmatter.tags?.includes(tag)) : posts;

  return (
    <>
      <PageMeta title="Writing" description="Blog posts and notes." path="/blog" />
      <div className="container max-w-3xl py-16">
      <p className="mono-label mb-3">// the blog</p>
      <h1 className="font-serif text-4xl mb-2">Writing</h1>
      <p className="text-muted-foreground mb-8">{posts.length} posts and counting.</p>

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => setTag(null)}
            className={`mono-label px-2 py-1 rounded border transition ${
              tag === null ? "border-foreground text-foreground" : "border-border hover:border-foreground"
            }`}
          >
            all
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`mono-label px-2 py-1 rounded border transition ${
                tag === t ? "border-foreground text-foreground" : "border-border hover:border-foreground"
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      <ul className="divide-y divide-border">
        {filtered.map((p) => (
          <li key={p.slug}>
            <Link to={`/blog/${p.slug}`} className="group block py-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-2xl group-hover:text-accent transition-colors">
                  {p.frontmatter.title}
                </h2>
                <time className="mono-label shrink-0">{formatDate(p.frontmatter.date)}</time>
              </div>
              {p.frontmatter.description && (
                <p className="mt-2 text-sm text-muted-foreground">{p.frontmatter.description}</p>
              )}
              <div className="mt-3 flex gap-4 mono-label">
                <span>{p.readingTime} min read</span>
                {p.frontmatter.tags?.map((t) => <span key={t}>#{t}</span>)}
              </div>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-6 text-sm text-muted-foreground">Nothing matches that tag yet.</li>
        )}
      </ul>
    </div>
    </>
  );
}
