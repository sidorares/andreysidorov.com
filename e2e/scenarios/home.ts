import type { ScenarioContext } from "coverkill";
import { homeLink, navLink, waitForApp } from "../lib.ts";

export default async function ({ page, baseURL }: ScenarioContext) {
  await page.goto(baseURL);
  await waitForApp(page);

  await navLink(page, "Blog").click();
  await waitForApp(page);
  await homeLink(page).click();
  await waitForApp(page);

  await page
    .getByRole("link", { name: "Hello, world" })
    .first()
    .click();
  await waitForApp(page);

  await homeLink(page).click();
  await waitForApp(page);

  await page
    .getByRole("link", { name: "Notes Engine" })
    .first()
    .click();
  await waitForApp(page);
}
