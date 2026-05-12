import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/site.config";

/**
 * Renders a "runnable" code fence using a registered renderer. Falls back to
 * a plain code block if the language has no renderer registered.
 */
export function RunnableFence({ lang, code }: { lang: string; code: string }) {
  if (lang === "mermaid") return <MermaidFence code={code} />;
  // unknown runnable -> show as code
  return (
    <div className="code-block" data-lang={lang}>
      <pre className="text-sm font-mono p-4 overflow-x-auto bg-muted">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MermaidFence({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const isDark = document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "neutral",
          fontFamily: "JetBrains Mono, ui-monospace, monospace",
          securityLevel: "strict",
        });
        const { svg } = await mermaid.render(`m-${id}`, code);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
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
    <div className="my-8 flex justify-center rounded-md border border-border bg-card p-6 overflow-x-auto">
      <div ref={ref} className="mermaid-host" />
    </div>
  );
}

// re-export for convenience
export const __runnableLangs = siteConfig.runnableFences;
