import type { Page } from "playwright";
import { siteConfig } from "../src/site.config.ts";

/** Playwright default action/navigation timeout for e2e scenarios. */
export const E2E_TIMEOUT_MS = 5_000;

const routedPages = new WeakSet<Page>();

export function configurePage(page: Page) {
  page.setDefaultTimeout(E2E_TIMEOUT_MS);
  page.setDefaultNavigationTimeout(E2E_TIMEOUT_MS);
}

async function blockAnalytics(page: Page) {
  if (routedPages.has(page)) return;
  await page.route("https://cloud.umami.is/**", (route) => route.abort());
  routedPages.add(page);
}

/** Site chrome header (not in-page `<header>` elements inside articles). */
export function siteHeader(page: Page) {
  return page.locator("header.border-b");
}

export function navLink(page: Page, name: string | RegExp) {
  return siteHeader(page)
    .getByRole("navigation")
    .getByRole("link", { name, exact: true });
}

export function homeLink(page: Page) {
  return siteHeader(page).getByRole("link", {
    name: siteConfig.name,
    exact: true,
  });
}

/** Navigate home via full load (reliable in CI); still exercises client nav elsewhere. */
export async function goHome(page: Page, baseURL: string) {
  await page.goto(new URL("/", baseURL).href);
  await waitForApp(page);
}

/** Wait for React hydration (static shell is replaced). */
export async function waitForApp(page: Page) {
  configurePage(page);
  await blockAnalytics(page);
  await page.waitForLoadState("domcontentloaded");
  const header = siteHeader(page);
  await header.waitFor({ state: "visible" });
  await header
    .getByRole("navigation")
    .getByRole("link", { name: "Blog" })
    .waitFor({ state: "visible" });
  await homeLink(page).waitFor({ state: "visible" });
}

/** Runnable mermaid fences render async; wait before leaving the page. */
export async function waitForMermaid(page: Page) {
  await page
    .locator(".mermaid-host svg")
    .first()
    .waitFor({ state: "visible", timeout: E2E_TIMEOUT_MS })
    .catch(() => {
      // Page may have no diagram — callers on mermaid posts should assert separately.
    });
}

export async function openMermaidLightbox(page: Page) {
  const expand = page.getByRole("button", { name: "View larger" }).first();
  await expand.waitFor({ state: "visible", timeout: E2E_TIMEOUT_MS });
  if (await expand.isEnabled()) {
    await expand.click();
    await page.getByRole("dialog").waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
  }
}
