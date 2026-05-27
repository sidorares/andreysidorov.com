import { useEffect, useState } from "react";

export type TocEntry = { depth: number; text: string; id: string };

export function Toc({ toc }: { toc: TocEntry[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );

    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [toc]);

  return (
    <ul className="space-y-2 text-sm">
      {toc.map((t) => (
        <li key={t.id} style={{ paddingLeft: (t.depth - 2) * 12 }}>
          <a
            href={`#${t.id}`}
            className={`block transition-colors ${
              active === t.id
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

