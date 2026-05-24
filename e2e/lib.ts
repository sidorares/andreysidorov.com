import type { Page } from "playwright";

/** Playwright default action/navigation timeout for e2e scenarios. */
export const E2E_TIMEOUT_MS = 5_000;

export function configurePage(page: Page) {
  page.setDefaultTimeout(E2E_TIMEOUT_MS);
  page.setDefaultNavigationTimeout(E2E_TIMEOUT_MS);
}

/** Site chrome nav (top-level banner), not in-page `<header>` elements. */
export function navLink(page: Page, name: string | RegExp) {
  return page.getByRole("banner").getByRole("link", { name, exact: true });
}

export function homeLink(page: Page) {
  return navLink(page, "andreysidorov.com");
}

/** Wait for React hydration (static shell is replaced). */
export async function waitForApp(page: Page) {
  configurePage(page);
  await page.waitForSelector("#root:not(:empty)", { state: "attached" });
  await page.waitForLoadState("networkidle");
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
