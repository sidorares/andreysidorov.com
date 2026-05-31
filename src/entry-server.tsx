import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./AppRoutes";
import { collectSsrHeadTags } from "./lib/ssr-head";

function basename() {
  return import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;
}

export function render(url: string) {
  const app = (
    <StaticRouter location={url} basename={basename()}>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </StaticRouter>
  );

  const html = renderToString(app);
  const head = collectSsrHeadTags(html);

  return { html, head };
}
