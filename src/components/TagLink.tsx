import { Link, type LinkProps } from "react-router-dom";
import { tagPath } from "@/lib/tags";
import { cn } from "@/lib/utils";

type TagLinkProps = Omit<LinkProps, "to"> & {
  tag: string;
};

export function TagLink({ tag, className, children, ...props }: TagLinkProps) {
  return (
    <Link to={tagPath(tag)} className={cn(className)} {...props}>
      {children ?? `#${tag}`}
    </Link>
  );
}
