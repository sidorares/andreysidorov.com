import { siteConfig } from "@/site.config";

type PageMetaProps = {
  title: string;
  description?: string;
  path?: string;
};

function siteOrigin() {
  const fromEnv = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  return (fromEnv || siteConfig.url).replace(/\/$/, "");
}

function canonicalUrl(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const pathname = `${base}${normalized}` || "/";
  return new URL(pathname, `${siteOrigin()}/`).href;
}

/** Document metadata (React 19 hoists these when rendering a full document). */
export function PageMeta({ title, description, path = "" }: PageMetaProps) {
  const fullTitle = title.includes("—") ? title : `${title} — Notes`;
  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl(path)} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
    </>
  );
}
