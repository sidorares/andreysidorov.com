import { Link } from "react-router-dom";
import { TagLink } from "@/components/TagLink";
import { cn } from "@/lib/utils";

type ProjectIndexCardProps = {
  to: string;
  title: string;
  summary: string;
  tech?: string[];
  titleClassName?: string;
  padding?: "p-5" | "p-6";
  techStyle?: "badge" | "plain";
};

export function ProjectIndexCard({
  to,
  title,
  summary,
  tech,
  titleClassName = "font-serif text-xl",
  padding = "p-6",
  techStyle = "badge",
}: ProjectIndexCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-md border border-border hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-16px_hsl(0_0%_0%/0.2)] transition",
        padding,
      )}
    >
      <Link to={to} className="flex min-h-0 flex-1 flex-col">
        <div className={titleClassName}>{title}</div>
        <div className="mt-1 flex-1 text-sm text-muted-foreground">{summary}</div>
      </Link>
      {tech && tech.length > 0 && (
        <div
          className={cn(
            "flex flex-wrap gap-2",
            techStyle === "badge" ? "mt-4" : "mt-3",
          )}
        >
          {tech.map((t) => (
            <TagLink
              key={t}
              tag={t}
              className={
                techStyle === "badge"
                  ? "mono-label border border-border rounded px-2 py-0.5 hover:border-foreground transition-colors"
                  : "mono-label hover:text-foreground transition-colors"
              }
            >
              {t}
            </TagLink>
          ))}
        </div>
      )}
    </article>
  );
}
