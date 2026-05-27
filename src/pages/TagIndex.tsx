import { useParams } from "react-router-dom";
import { PostListRow } from "@/components/PostListRow";
import { ProjectIndexCard } from "@/components/ProjectIndexCard";
import { posts, projects } from "@/lib/content";
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
                <li key={p.slug} className="py-6 first:pt-0">
                  <PostListRow
                    to={`/tags/${encodeURIComponent(tag)}/${p.slug}`}
                    title={p.frontmatter.title}
                    date={p.frontmatter.date}
                    description={p.frontmatter.description}
                    readingTime={p.readingTime}
                    tags={p.frontmatter.tags}
                    titleAs="h3"
                  />
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
                  <ProjectIndexCard
                    to={`/tags/${encodeURIComponent(tag)}/${p.slug}`}
                    title={p.frontmatter.title}
                    summary={p.frontmatter.summary}
                    tech={p.frontmatter.tech}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
