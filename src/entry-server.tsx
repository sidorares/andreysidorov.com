import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router-dom/server";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./AppRoutes";
import { collectSsrHeadTags } from "./lib/ssr-head";

export { preloadContentForRoute } from "./lib/content";

function basename() {
  return import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;
}

async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let html = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
  }
  return html + decoder.decode();
}

export async function render(url: string) {
  const app = (
    <StaticRouter location={url} basename={basename()}>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </StaticRouter>
  );

  const { prelude } = await prerender(app);
  const html = await streamToString(prelude);
  const head = collectSsrHeadTags(html);

  return { html, head };
}
