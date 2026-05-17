import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./AppRoutes";

function basename() {
  return import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;
}

export function render(url: string) {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const app = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url} basename={basename()}>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </StaticRouter>
    </HelmetProvider>
  );

  const html = renderToString(app);
  const helmet = helmetContext.helmet;
  const head = [
    helmet?.title.toString(),
    helmet?.meta.toString(),
    helmet?.link.toString(),
  ]
    .filter(Boolean)
    .join("\n");

  return { html, head };
}
