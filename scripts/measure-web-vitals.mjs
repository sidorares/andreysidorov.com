/**
 * Measure FCP / LCP locally with Playwright + PerformanceObserver.
 *
 * Usage:
 *   npm run build && npm run preview          # terminal 1
 *   node scripts/measure-web-vitals.mjs       # terminal 2
 *
 * Options (env vars):
 *   BASE_URL=http://127.0.0.1:4173            default preview port
 *   THROTTLE=1                                emulate Fast 3G (1.6 Mbps, 150ms RTT)
 *   PAGES=/,/blog/on-static-sites             comma-separated paths
 *   RUNS=3                                    repeat each page (median reported)
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const THROTTLE = process.env.THROTTLE === "1";
const RUNS = Math.max(1, Number(process.env.RUNS ?? 3));
const PAGES = (process.env.PAGES ?? "/,/blog/on-static-sites").split(",").map((p) => p.trim());

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function applyNetworkThrottle(cdp) {
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  });
}

async function measureOnce(page, path) {
  await page.route("https://cloud.umami.is/**", (route) => route.abort());

  await page.goto(new URL(path, BASE).href, { waitUntil: "load" });
  await page.waitForTimeout(200);

  return page.evaluate(async () => {
    const nav = performance.getEntriesByType("navigation")[0];
    let fcp = null;
    for (const e of performance.getEntriesByType("paint")) {
      if (e.name === "first-contentful-paint") fcp = e.startTime;
    }

    const lcp = await new Promise((resolve) => {
      let value = null;
      let element = null;
      try {
        const obs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            value = entry.startTime;
            element = entry.element;
          }
        });
        obs.observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => {
          obs.disconnect();
          resolve({
            time: value,
            tag: element?.tagName ?? null,
            className: element?.className ?? null,
            text: (element?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
          });
        }, 150);
      } catch {
        resolve({ time: null, tag: null, className: null, text: null });
      }
    });

    const resources = performance
      .getEntriesByType("resource")
      .filter((r) => /\.(js|css|woff2)|fonts\.gstatic|favicon/.test(r.name))
      .map((r) => ({
        url: r.name.replace(/^https?:\/\/[^/]+/, ""),
        start: Math.round(r.startTime),
        duration: Math.round(r.duration),
        transferKB: Math.round((r.transferSize || 0) / 1024),
      }))
      .sort((a, b) => a.start - b.start);

    return {
      fcp: fcp !== null ? Math.round(fcp) : null,
      lcp: lcp.time !== null ? Math.round(lcp.time) : null,
      lcpElement: lcp,
      ttfb: nav ? Math.round(nav.responseStart) : null,
      dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      load: nav ? Math.round(nav.loadEventEnd) : null,
      resources,
    };
  });
}

async function measurePage(browser, path) {
  const fcps = [];
  const lcps = [];
  let lastDetail = null;

  for (let i = 0; i < RUNS; i++) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    if (THROTTLE) {
      const cdp = await context.newCDPSession(page);
      await applyNetworkThrottle(cdp);
    }
    const result = await measureOnce(page, path);
    if (result.fcp !== null) fcps.push(result.fcp);
    if (result.lcp !== null) lcps.push(result.lcp);
    lastDetail = result;
    await context.close();
  }

  return {
    path,
    runs: RUNS,
    throttle: THROTTLE,
    fcpMs: fcps.length ? Math.round(median(fcps)) : null,
    lcpMs: lcps.length ? Math.round(median(lcps)) : null,
    ttfbMs: lastDetail?.ttfb ?? null,
    dclMs: lastDetail?.dcl ?? null,
    loadMs: lastDetail?.load ?? null,
    lcpElement: lastDetail?.lcpElement ?? null,
    resources: lastDetail?.resources ?? [],
  };
}

function fmtMs(v) {
  return v === null ? "—" : `${(v / 1000).toFixed(2)}s (${v}ms)`;
}

async function main() {
  const browser = await chromium.launch();

  console.log(`Base URL: ${BASE}`);
  console.log(`Network throttle: ${THROTTLE ? "Fast 3G (1.6 Mbps, 150ms RTT)" : "none"}`);
  console.log(`Runs per page: ${RUNS} (median)\n`);

  const results = [];
  for (const path of PAGES) {
    const r = await measurePage(browser, path);
    results.push(r);
    console.log(`=== ${path} ===`);
    console.log(`  FCP:  ${fmtMs(r.fcpMs)}`);
    console.log(`  LCP:  ${fmtMs(r.lcpMs)}`);
    if (r.lcpElement?.tag) {
      console.log(`  LCP element: <${r.lcpElement.tag.toLowerCase()}> ${r.lcpElement.text || ""}`);
    }
    console.log(`  TTFB: ${fmtMs(r.ttfbMs)}  DCL: ${fmtMs(r.dclMs)}  Load: ${fmtMs(r.loadMs)}`);
    console.log("  Critical resources (first paint path):");
    for (const res of r.resources.slice(0, 8)) {
      console.log(
        `    +${String(res.start).padStart(4)}ms  ${String(res.duration).padStart(4)}ms  ${String(res.transferKB).padStart(3)}KB  ${res.url}`,
      );
    }
    console.log();
  }

  await browser.close();

  const worstLcp = results.reduce((a, b) => ((a.lcpMs ?? 0) > (b.lcpMs ?? 0) ? a : b));
  console.log("--- Summary ---");
  console.log(`Worst LCP: ${worstLcp.path} → ${fmtMs(worstLcp.lcpMs)}`);
  console.log("\nTip: compare THROTTLE=0 vs THROTTLE=1 to separate local vs field-like latency.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
