import { ReactNode } from "react";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";

export function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warn" | "tip";
  children: ReactNode;
}) {
  const map = {
    info: { Icon: Info, label: "Note" },
    warn: { Icon: AlertTriangle, label: "Warning" },
    tip: { Icon: Lightbulb, label: "Tip" },
  } as const;
  const { Icon, label } = map[type];
  return (
    <aside className="my-6 flex gap-3 rounded-md border border-border bg-secondary/40 px-4 py-3">
      <Icon className="h-4 w-4 mt-1 text-accent shrink-0" />
      <div className="flex-1">
        <div className="mono-label mb-1">{label}</div>
        <div className="text-sm [&>p]:my-1">{children}</div>
      </div>
    </aside>
  );
}

export function Figure({
  src,
  caption,
  alt,
}: {
  src: string;
  caption?: string;
  alt?: string;
}) {
  return (
    <figure className="my-8">
      <img src={src} alt={alt || caption || ""} loading="lazy" className="w-full" />
      {caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center font-mono">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Embed({ url, title }: { url: string; title?: string }) {
  return (
    <div className="my-8 aspect-video w-full overflow-hidden rounded-md border border-border">
      <iframe
        src={url}
        title={title || "embed"}
        loading="lazy"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return (
    <ol className="my-6 space-y-4 list-none counter-reset-step pl-0">
      {children}
    </ol>
  );
}

export function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="relative pl-10 before:absolute before:left-0 before:top-0 before:flex before:h-7 before:w-7 before:items-center before:justify-center before:rounded-full before:border before:border-border before:bg-background before:font-mono before:text-xs before:content-[counter(step-counter)] [counter-increment:step-counter]">
      <div className="font-serif text-lg leading-tight mb-1">{title}</div>
      <div className="text-sm text-muted-foreground [&>p]:my-1">{children}</div>
    </li>
  );
}
