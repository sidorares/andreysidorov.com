import type { ScenarioContext } from "coverkill";
import { waitForApp } from "../lib.ts";

export default async function ({ page, baseURL }: ScenarioContext) {
  await page.goto(`${baseURL}/this-route-does-not-exist`);
  await waitForApp(page);
  await page.getByRole("link", { name: /back home/i }).click();
  await waitForApp(page);
}
