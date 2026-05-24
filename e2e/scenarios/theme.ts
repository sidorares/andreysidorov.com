import type { ScenarioContext } from "coverkill";
import { waitForApp } from "../lib.ts";

export default async function ({ page, baseURL }: ScenarioContext) {
  await page.goto(baseURL);
  await waitForApp(page);

  const toggle = page.getByRole("button", { name: "Toggle theme" });
  await toggle.click();
  await page.waitForTimeout(200);
  await toggle.click();

  await page.goto(`${baseURL}/blog/hello-world`);
  await waitForApp(page);
  await toggle.click();
  await page.waitForTimeout(200);
  await toggle.click();
}
