import { Suspense, use } from "react";
import { loadAbout, peekAbout, type LoadedAbout } from "@/lib/content";
import { MdxLayer } from "@/mdx/MdxLayer";
import { siteConfig } from "@/site.config";
import { PageMeta } from "@/components/PageMeta";

function AboutMdx({ loaded }: { loaded: LoadedAbout | null }) {
  const Content = loaded?.Component;

  return (
    <MdxLayer>
      <div className="prose">
        {Content ? (
          <Content />
        ) : (
          <p>
            Add an <code>about.mdx</code> file in <code>content/</code>.
          </p>
        )}
      </div>
    </MdxLayer>
  );
}

function AboutMdxAsync() {
  const loaded = use(loadAbout());
  return <AboutMdx loaded={loaded} />;
}

export default function About() {
  const ready = peekAbout();

  return (
    <>
      <PageMeta title="About" description={`About ${siteConfig.author}.`} path="/about" />
      <div className="container max-w-2xl py-16">
        <p className="mono-label mb-3">// hello</p>
        <h1 className="font-serif text-4xl mb-8">About</h1>
        {ready !== undefined ? (
          <AboutMdx loaded={ready} />
        ) : (
          <Suspense fallback={null}>
            <AboutMdxAsync />
          </Suspense>
        )}

        <hr className="divider-dotted" />

        <section>
          <p className="mono-label mb-3">// get in touch</p>
          <h2 className="font-serif text-2xl mb-4">Contact</h2>
          <p className="text-muted-foreground mb-4">
            The fastest way to reach me is email. I read everything.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-block font-mono text-sm border border-border rounded px-3 py-2 hover:border-foreground transition-colors"
          >
            {siteConfig.email} →
          </a>
          <div className="mt-6 flex gap-4 font-mono text-xs">
            {siteConfig.socials.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="prose-link">
                {s.label} →
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
