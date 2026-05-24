import type { ScenarioContext } from "coverkill";
import { openMermaidLightbox, waitForApp, waitForMermaid } from "../lib.ts";

export default async function ({ page, baseURL }: ScenarioContext) {
  await page.goto(`${baseURL}/blog`);
  await waitForApp(page);

  await page.getByRole("button", { name: "#meta" }).click();
  await page.getByRole("button", { name: "all" }).click();

  await page.getByRole("link", { name: "Hello, world" }).click();
  await waitForApp(page);
  await waitForMermaid(page);
  await openMermaidLightbox(page);

  const copy = page.getByRole("button", { name: "Copy code" }).first();
  if (await copy.isVisible()) {
    await copy.click();
  }

  await page.getByRole("link", { name: /On building a static site/ }).click();
  await waitForApp(page);
  await waitForMermaid(page);

  const tocLink = page.locator('aside a[href^="#"]').first();
  if (await tocLink.isVisible()) {
    await tocLink.click();
    await page.waitForTimeout(300);
  }

  const prev = page.getByRole("link", { name: /previous/i });
  if (await prev.isVisible()) {
    await prev.click();
    await waitForApp(page);
  }
}
