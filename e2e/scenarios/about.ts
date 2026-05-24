import type { ScenarioContext } from "coverkill";
import { navLink, waitForApp } from "../lib.ts";

export default async function ({ page, baseURL }: ScenarioContext) {
  await page.goto(`${baseURL}/about`);
  await waitForApp(page);

  // await navLink(page, "Blog").click();
  // await waitForApp(page);
  // await navLink(page, "About").click();
  // await waitForApp(page);
}
