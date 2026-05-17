import { Helmet } from "react-helmet-async";

type PageMetaProps = {
  title: string;
  description?: string;
  path?: string;
};

function canonicalUrl(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const site = (import.meta.env.VITE_SITE_URL as string | undefined) || "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!site) return `${base}${normalized}` || "/";
  return new URL(`${base}${normalized}` || "/", site).href;
}

export function PageMeta({ title, description, path = "" }: PageMetaProps) {
  const fullTitle = title.includes("—") ? title : `${title} — Notes`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl(path)} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
