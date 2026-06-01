/**
 * Measure client-side About navigation delay (home → About click).
 *
 * Usage:
 *   npm run build && npm run preview          # terminal 1
 *   node scripts/measure-about-nav-delay.mjs  # terminal 2
 *
 * Env:
 *   BASE_URL=http://127.0.0.1:4173
 *   RUNS=5
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const RUNS = Math.max(1, Number(process.env.RUNS ?? 5));

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function warmCache(context) {
  const page = await context.newPage();
  await page.route("https://cloud.umami.is/**", (route) => route.abort());
  await page.goto(new URL("/", BASE).href, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector("#root")?.innerHTML?.includes("Recent writing"));
  await page.close();
}

async function measureSpaNav(context) {
  const page = await context.newPage();
  await page.route("https://cloud.umami.is/**", (route) => route.abort());

  const aboutChunkEvents = [];
  const t0 = Date.now();
  page.on("response", (res) => {
    const url = res.url();
    if (/\/assets\/about-[^/]+\.js/.test(url)) {
      aboutChunkEvents.push({ phase: "response", ms: Date.now() - t0, url, status: res.status() });
    }
  });

  await page.goto(new URL("/", BASE).href, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector("#root")?.innerHTML?.includes("Recent writing"));

  const timings = await page.evaluate(async () => {
    const aboutText = "developer who likes small tools";
    const nav = performance.getEntriesByType("navigation")[0];
    const mark = (name) => performance.mark(name);

    const clickAt = performance.now();
    const link = document.querySelector('a[href="/about"]');
    if (!link) throw new Error("About nav link not found");
    link.click();

    const shellAt = await new Promise((resolve) => {
      const start = clickAt;
      const obs = new MutationObserver(() => {
        const root = document.querySelector("#root");
        if (root?.textContent?.includes("// hello") && root?.textContent?.includes("About")) {
          obs.disconnect();
          resolve(performance.now() - start);
        }
      });
      obs.observe(document.getElementById("root"), { childList: true, subtree: true, characterData: true });
      setTimeout(() => {
        obs.disconnect();
        resolve(null);
      }, 3000);
    });

    const mdxAt = await new Promise((resolve) => {
      const start = clickAt;
      const obs = new MutationObserver(() => {
        if (document.body.textContent?.includes(aboutText)) {
          obs.disconnect();
          resolve(performance.now() - start);
        }
      });
      obs.observe(document.getElementById("root"), { childList: true, subtree: true, characterData: true });
      setTimeout(() => {
        obs.disconnect();
        resolve(null);
      }, 5000);
    });

    const resources = performance
      .getEntriesByType("resource")
      .filter((r) => /\/assets\/about-[^/]+\.js/.test(r.name))
      .map((r) => ({
        url: r.name.replace(/^https?:\/\/[^/]+/, ""),
        start: Math.round(r.startTime),
        duration: Math.round(r.duration),
        transferKB: Math.round((r.transferSize || 0) / 1024),
        encodedKB: Math.round((r.encodedBodySize || 0) / 1024),
      }));

    return {
      dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      shellMs: shellAt !== null ? Math.round(shellAt) : null,
      mdxMs: mdxAt !== null ? Math.round(mdxAt) : null,
      gapMs:
        shellAt !== null && mdxAt !== null ? Math.round(mdxAt - shellAt) : null,
      totalMdxMs: mdxAt !== null ? Math.round(mdxAt) : null,
      aboutResources: resources,
    };
  });

  await page.close();
  return { ...timings, aboutChunkEvents };
}

async function measureDirectAbout(context) {
  const page = await context.newPage();
  await page.route("https://cloud.umami.is/**", (route) => route.abort());

  const navStart = Date.now();
  await page.goto(new URL("/about", BASE).href, { waitUntil: "networkidle" });
  const loadMs = Date.now() - navStart;
  const hasMdxInDom = (await page.locator("text=developer who likes small tools").count()) > 0;
  const htmlHasMdx = await page.evaluate(() => {
    const html = document.documentElement.innerHTML;
    return html.includes("developer who likes small tools");
  });
  await page.close();
  return { loadMs, hasMdxInDom, htmlHasMdx };
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  console.log(`Base URL: ${BASE}`);
  console.log("Warming disk/memory cache with a home load…\n");
  await warmCache(context);

  const shells = [];
  const totals = [];
  const gaps = [];
  const resources = [];

  for (let i = 0; i < RUNS; i++) {
    const r = await measureSpaNav(context);
    if (r.shellMs !== null) shells.push(r.shellMs);
    if (r.totalMdxMs !== null) totals.push(r.totalMdxMs);
    if (r.gapMs !== null) gaps.push(r.gapMs);
    if (r.aboutResources.length) resources.push(r.aboutResources[0]);
    console.log(
      `SPA run ${i + 1}: shell +${r.shellMs}ms, MDX +${r.totalMdxMs}ms (empty prose gap ${r.gapMs}ms)`,
    );
    if (r.aboutResources.length) {
      const res = r.aboutResources[0];
      console.log(
        `  about chunk resource: start +${res.start}ms, duration ${res.duration}ms, transfer ${res.transferKB}KB, encoded ${res.encodedKB}KB`,
      );
    } else {
      console.log("  about chunk resource: (not in PerformanceResourceTiming — likely cache/same-turn)");
    }
  }

  console.log("\n--- SPA home → About (median) ---");
  console.log(`  Shell visible after click: +${Math.round(median(shells))}ms`);
  console.log(`  MDX text visible after click: +${Math.round(median(totals))}ms`);
  console.log(`  Empty prose gap (MDX − shell): ${Math.round(median(gaps))}ms`);
  if (resources.length) {
    const res = resources[Math.floor(resources.length / 2)];
    console.log(`  about-*.js (sample): +${res.start}ms fetch, ${res.duration}ms duration`);
  }

  const direct = await measureDirectAbout(await browser.newContext());
  console.log("\n--- Direct /about load (single run) ---");
  console.log(`  Full navigation load: ${direct.loadMs}ms`);
  console.log(`  MDX in DOM after load: ${direct.hasMdxInDom}`);
  console.log(`  MDX in initial HTML (SSR): ${direct.htmlHasMdx}`);

  await browser.close();
  console.log(
    "\nInterpretation: a large gap with tiny about-*.js transfer usually means async chunk parse + React Suspense, not network.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
