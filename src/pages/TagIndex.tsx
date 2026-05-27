import { Link, useParams } from "react-router-dom";
import { posts, projects } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { PageMeta } from "@/components/PageMeta";

export default function TagIndex() {
  const { tagname = "" } = useParams();
  const tag = tagname.toLowerCase();

  const taggedPosts = posts.filter((p) => p.frontmatter.tags?.includes(tag));
  const taggedProjects = projects.filter((p) => p.frontmatter.tech?.includes(tag));

  return (
    <>
      <PageMeta
        title={`#${tag}`}
        description={`Posts and projects tagged with “${tag}”.`}
        path={`/tags/${encodeURIComponent(tag)}`}
      />

      <div className="site-container py-16">
        <p className="mono-label mb-3">// the tag</p>
        <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-tight">
          #{tag}
        </h1>

        {taggedPosts.length === 0 && taggedProjects.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">
            Nothing matches that tag yet.
          </p>
        )}

        {taggedPosts.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl mb-4">Writing</h2>
            <ul className="divide-y divide-border">
              {taggedPosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/tags/${encodeURIComponent(tag)}/${p.slug}`}
                    className="group block py-6"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-2xl group-hover:text-accent transition-colors">
                        {p.frontmatter.title}
                      </h3>
                      <time className="mono-label shrink-0">
                        {formatDate(p.frontmatter.date)}
                      </time>
                    </div>
                    {p.frontmatter.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {p.frontmatter.description}
                      </p>
                    )}
                    <div className="mt-3 flex gap-4 mono-label text-sm">
                      <span>{p.readingTime} min read</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {taggedProjects.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl mb-4">Projects</h2>
            <ul className="grid md:grid-cols-2 gap-5 items-stretch">
              {taggedProjects.map((p) => (
                <li key={p.slug} className="min-h-0">
                  <Link
                    to={`/tags/${encodeURIComponent(tag)}/${p.slug}`}
                    className="flex h-full flex-col rounded-md border border-border p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-16px_hsl(0_0%_0%/0.2)] transition"
                  >
                    <div className="font-serif text-xl">{p.frontmatter.title}</div>
                    <div className="mt-1 flex-1 text-sm text-muted-foreground">
                      {p.frontmatter.summary}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(p.frontmatter.tech || []).map((t) => (
                        <span key={t} className="mono-label border border-border rounded px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

