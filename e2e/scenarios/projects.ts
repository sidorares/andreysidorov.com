import type { ScenarioContext } from "coverkill";
import { navLink, openMermaidLightbox, waitForApp, waitForMermaid } from "../lib.ts";

export default async function ({ page, baseURL }: ScenarioContext) {
  await page.goto(`${baseURL}/projects`);
  await waitForApp(page);

  await page.getByRole("link", { name: "Notes Engine" }).click();
  await waitForApp(page);
  await waitForMermaid(page);
  await openMermaidLightbox(page);

  const tocLink = page.locator('aside a[href^="#"]').first();
  if (await tocLink.isVisible()) {
    await tocLink.click();
    await page.waitForTimeout(300);
  }

  await navLink(page, "Projects").click();
  await waitForApp(page);

  await page.getByRole("link", { name: "Pixel Pal" }).click();
  await waitForApp(page);

  const tocLink2 = page.locator('aside a[href^="#"]').first();
  if (await tocLink2.isVisible()) {
    await tocLink2.click();
    await page.waitForTimeout(300);
  }
}
