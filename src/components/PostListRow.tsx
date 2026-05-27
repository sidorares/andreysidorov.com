import { Link } from "react-router-dom";
import { TagLink } from "@/components/TagLink";
import { formatDate } from "@/lib/format";

type PostListRowProps = {
  to: string;
  title: string;
  date: string;
  description?: string;
  readingTime: number;
  tags?: string[];
  titleAs?: "h2" | "h3";
};

export function PostListRow({
  to,
  title,
  date,
  description,
  readingTime,
  tags,
  titleAs: Title = "h2",
}: PostListRowProps) {
  return (
    <article>
      <Link to={to} className="group block">
        <div className="flex items-baseline justify-between gap-4">
          <Title className="font-serif text-2xl group-hover:text-accent transition-colors">
            {title}
          </Title>
          <time className="mono-label shrink-0">{formatDate(date)}</time>
        </div>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
        <p className="mt-3 mono-label">{readingTime} min read</p>
      </Link>
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 mono-label">
          {tags.map((t) => (
            <TagLink key={t} tag={t} className="hover:text-foreground transition-colors" />
          ))}
        </div>
      )}
    </article>
  );
}
