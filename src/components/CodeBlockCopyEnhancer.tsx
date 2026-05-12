import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { createRoot, type Root } from "react-dom/client";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

function CopyCodeButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = getText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="code-block-copy-btn h-8 w-8 rounded-md border border-border bg-background/90 shadow-sm backdrop-blur-sm text-muted-foreground hover:text-foreground"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

/**
 * Injects copy controls on `.code-block` regions produced by Shiki (and plain
 * fenced code). Runs after MDX renders so build-time HTML stays unchanged.
 */
export function CodeBlockCopyEnhancer({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const rootEl = wrapRef.current;
    if (!rootEl) return;

    const roots: Root[] = [];

    rootEl.querySelectorAll<HTMLElement>(".code-block").forEach((block) => {
      if (block.querySelector(":scope > .code-block-copy-mount")) return;

      const mount = document.createElement("div");
      mount.className = "code-block-copy-mount";
      block.appendChild(mount);

      const getText = () => block.querySelector("pre")?.innerText ?? "";

      const r = createRoot(mount);
      roots.push(r);
      r.render(<CopyCodeButton getText={getText} />);
    });

    return () => {
      roots.forEach((r) => r.unmount());
      rootEl.querySelectorAll(".code-block-copy-mount").forEach((n) => n.remove());
    };
  }, [location.pathname]);

  return <div ref={wrapRef}>{children}</div>;
}
