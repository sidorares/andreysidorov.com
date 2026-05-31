import { hydrateRoot } from "react-dom/client";
import App from "./App.tsx";

/** Full Tailwind bundle (deferred via index.html link). */
function findAppStylesheetLink(): HTMLLinkElement | null {
  return document.querySelector<HTMLLinkElement>(
    'link[rel="stylesheet"][href*="/assets/index-"], link[rel="preload"][as="style"][href*="/assets/index-"], link[href="/src/index.css"]',
  );
}

function isAppStylesheetActive(link: HTMLLinkElement): boolean {
  if (link.rel === "stylesheet") return true;
  if (import.meta.env.DEV) {
    return [...document.styleSheets].some((sheet) => {
      try {
        return sheet.href?.includes("index.css");
      } catch {
        return false;
      }
    });
  }
  const file = link.href.split("/").pop() ?? "";
  return [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].some((s) =>
    s.href.includes(file),
  );
}

function whenDeferredStylesReady(): Promise<void> {
  const link = findAppStylesheetLink();
  if (!link || isAppStylesheetActive(link)) return Promise.resolve();

  return new Promise((resolve) => {
    const done = () => resolve();

    const poll = window.setInterval(() => {
      if (isAppStylesheetActive(link)) {
        window.clearInterval(poll);
        done();
      }
    }, 16);

    link.addEventListener("load", done, { once: true });
    link.addEventListener("error", done, { once: true });

    window.setTimeout(() => {
      window.clearInterval(poll);
      done();
    }, 8000);
  });
}

function boot() {
  whenDeferredStylesReady().then(() => {
    hydrateRoot(document.getElementById("root")!, <App />);
  });
}

if (import.meta.env.DEV) {
  void import("./index.css").then(boot);
} else {
  boot();
}
