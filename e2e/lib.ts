import type { Page } from "playwright";

export function navLink(page: Page, name: string | RegExp) {
  return page.locator("header").getByRole("link", { name, exact: true });
}

/** Wait for React hydration (static shell is replaced). */
export async function waitForApp(page: Page) {
  await page.waitForSelector("#root:not(:empty)", { state: "attached" });
  await page.waitForLoadState("networkidle");
}

/** Runnable mermaid fences render async; wait before leaving the page. */
export async function waitForMermaid(page: Page) {
  await page
    .locator(".mermaid-host svg")
    .first()
    .waitFor({ state: "visible", timeout: 15_000 })
    .catch(() => {
      // Page may have no diagram — callers on mermaid posts should assert separately.
    });
}

export async function openMermaidLightbox(page: Page) {
  const expand = page.getByRole("button", { name: "View larger" }).first();
  await expand.waitFor({ state: "visible", timeout: 15_000 });
  if (await expand.isEnabled()) {
    await expand.click();
    await page.getByRole("dialog").waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
  }
}
