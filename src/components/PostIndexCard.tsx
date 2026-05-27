import { Link } from "react-router-dom";
import { TagLink } from "@/components/TagLink";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type PostIndexCardProps = {
  to: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  titleClassName?: string;
};

export function PostIndexCard({
  to,
  title,
  date,
  description,
  tags,
  titleClassName = "font-serif text-xl",
}: PostIndexCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-md border border-border p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-16px_hsl(0_0%_0%/0.2)] transition",
      )}
    >
      <Link to={to} className="group flex min-h-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className={cn(titleClassName, "group-hover:text-accent transition-colors")}>
            {title}
          </h3>
          <time className="mono-label shrink-0">{formatDate(date)}</time>
        </div>
        {description && (
          <p className="mt-1 flex-1 text-sm text-muted-foreground">{description}</p>
        )}
      </Link>
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 mono-label">
          {tags.map((t) => (
            <TagLink key={t} tag={t} className="hover:text-foreground transition-colors" />
          ))}
        </div>
      )}
    </article>
  );
}
