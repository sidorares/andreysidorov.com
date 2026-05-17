import { useEffect, useId, useState, type ReactElement } from "react";
import { siteConfig } from "@/site.config";
import { ZoomLightbox } from "@/components/ZoomLightbox";

const ALLOWED = new Set(siteConfig.runnableFences as readonly string[]);

const RENDERERS: Record<string, (props: { code: string }) => ReactElement> = {
  mermaid: ({ code }) => <MermaidFence code={code} />,
};

function PlainFence({ lang, code }: { lang: string; code: string }) {
  return (
    <div className="code-block" data-lang={lang}>
      <pre className="text-sm font-mono p-4 overflow-x-auto bg-muted">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Renders a runnable fence (`!lang`) using `siteConfig.runnableFences` +
 * registered handlers in `RENDERERS`. Misconfigured entries fall back to source.
 */
export function RunnableFence({ lang, code }: { lang: string; code: string }) {
  if (!ALLOWED.has(lang)) return <PlainFence lang={lang} code={code} />;
  const render = RENDERERS[lang];
  if (!render) return <PlainFence lang={lang} code={code} />;
  return render({ code });
}

function MermaidFence({ code }: { code: string }) {
  const id = useId().replace(/:/g, "");
  const [error, setError] = useState<string | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setSvgMarkup(null);
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const isDark = document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "neutral",
          fontFamily: "'JetBrains Mono', 'JetBrains Mono fallback', ui-monospace, monospace",
          securityLevel: "strict",
        });
        const { svg } = await mermaid.render(`m-${id}`, code);
        if (!cancelled) setSvgMarkup(svg);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to render diagram");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <pre className="my-6 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-xs text-destructive overflow-x-auto">
        mermaid error: {error}
        {"\n\n"}
        {code}
      </pre>
    );
  }
  return (
    <ZoomLightbox className="my-8" expandable={Boolean(svgMarkup)}>
      <div className="flex justify-center rounded-md border border-border bg-card p-6 overflow-x-auto">
        <div
          className="mermaid-host min-w-0"
          dangerouslySetInnerHTML={
            svgMarkup ? { __html: svgMarkup } : undefined
          }
        />
      </div>
    </ZoomLightbox>
  );
}

// re-export for convenience
export const __runnableLangs = siteConfig.runnableFences;
