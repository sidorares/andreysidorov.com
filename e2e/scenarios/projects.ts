import type { ScenarioContext } from "coverkill";
import { navLink, openMermaidLightbox, waitForApp, waitForMermaid } from "../lib.ts";

export default async function ({ page, baseURL }: ScenarioContext) {
  await page.goto(`${baseURL}/projects`);
  await waitForApp(page);

  await page.getByRole("link", { name: "Notes Engine" }).click();
  await waitForApp(page);
  await waitForMermaid(page);
  await openMermaidLightbox(page);

  await navLink(page, "Projects").click();
  await waitForApp(page);

  await page.getByRole("link", { name: "Pixel Pal" }).click();
  await waitForApp(page);
}
