/**
 * Measure Cumulative Layout Shift (CLS) and attribute shifts to DOM nodes / fonts.
 *
 * Usage:
 *   npm run build && npm run preview          # terminal 1
 *   node scripts/measure-layout-shift.mjs     # terminal 2
 *
 * Options (env vars):
 *   BASE_URL=http://127.0.0.1:4173            default Vite preview port
 *   PAGES=/,/blog/on-static-sites             comma-separated paths
 *   RUNS=3                                    repeat each page (median CLS)
 *   SETTLE_MS=3000                            wait after load for late font/CSS shifts
 *   THROTTLE=1                                emulate Fast 3G via CDP
 *   JSON=1                                    machine-readable output
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const PAGES = (process.env.PAGES ?? "/,/blog/on-static-sites").split(",").map((p) => p.trim());
const RUNS = Math.max(1, Number(process.env.RUNS ?? 3));
const SETTLE_MS = Math.max(500, Number(process.env.SETTLE_MS ?? 3000));
const THROTTLE = process.env.THROTTLE === "1";
const JSON_OUT = process.env.JSON === "1";

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

  await page.addInitScript(() => {
    window.__layoutShifts = [];
    window.__fontEvents = [];

    try {
      const obs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) continue;
          const sources = [];
          for (const source of entry.sources ?? []) {
            sources.push({
              node: source.node,
              previousRect: { ...source.previousRect },
              currentRect: { ...source.currentRect },
            });
          }
          window.__layoutShifts.push({
            value: entry.value,
            startTime: entry.startTime,
            sources,
          });
        }
      });
      obs.observe({ type: "layout-shift", buffered: true });
    } catch {
      /* unsupported */
    }

    if (document.fonts?.addEventListener) {
      document.fonts.addEventListener("loading", () => {
        window.__fontEvents.push({ type: "loading", at: performance.now() });
      });
      document.fonts.addEventListener("loadingdone", () => {
        window.__fontEvents.push({ type: "loadingdone", at: performance.now() });
      });
    }
  });

  const t0 = Date.now();
  await page.goto(new URL(path, BASE).href, { waitUntil: "load" });
  await page.waitForTimeout(SETTLE_MS);

  try {
    await page.evaluate(() => document.fonts?.ready);
  } catch {
    /* ignore */
  }

  const elapsed = Date.now() - t0;

  return page.evaluate(
    ({ settleMs, pathLabel }) => {
      const shifts = window.__layoutShifts ?? [];
      let cls = 0;
      const byNode = new Map();

      function describeNode(node) {
        if (!node || node.nodeType !== 1) return { selector: "(unknown)", text: "" };
        const el = node;
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : "";
        const classes =
          typeof el.className === "string" && el.className.trim()
            ? `.${el.className.trim().split(/\s+/).slice(0, 5).join(".")}`
            : "";
        const text = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
        return { tag, selector: `${tag}${id}${classes}`, text };
      }

      for (const entry of shifts) {
        cls += entry.value;
        const primary = entry.sources?.[0]?.node;
        const key = primary ? describeNode(primary).selector : "(no source)";
        const prev = byNode.get(key) ?? { score: 0, samples: 0, descriptor: primary ? describeNode(primary) : null };
        prev.score += entry.value;
        prev.samples += 1;
        prev.lastAt = entry.startTime;
        byNode.set(key, prev);
      }

      const culprits = [...byNode.entries()]
        .map(([selector, data]) => ({
          selector,
          score: data.score,
          samples: data.samples,
          lastAtMs: data.lastAt != null ? Math.round(data.lastAt) : null,
          text: data.descriptor?.text ?? "",
        }))
        .sort((a, b) => b.score - a.score);

      const fontFaces = [...(document.fonts ?? [])].map((f) => ({
        family: f.family,
        weight: f.weight,
        style: f.style,
        status: f.status,
      }));

      const fontResources = performance
        .getEntriesByType("resource")
        .filter((r) => /\/fonts\/.*\.woff2/i.test(r.name))
        .map((r) => ({
          url: r.name.replace(/^https?:\/\/[^/]+/, ""),
          startMs: Math.round(r.startTime),
          durationMs: Math.round(r.duration),
          responseEndMs: Math.round(r.responseEnd),
        }))
        .sort((a, b) => a.startMs - b.startMs);

      const stylesheets = [...document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"][as="style"]')].map(
        (link) => ({
          href: link.getAttribute("href"),
          rel: link.rel,
          loaded: link.rel === "stylesheet",
        }),
      );

      const deferredApplied = performance
        .getEntriesByType("resource")
        .filter((r) => /\.css/i.test(r.name))
        .map((r) => ({
          url: r.name.replace(/^https?:\/\/[^/]+/, ""),
          startMs: Math.round(r.startTime),
          responseEndMs: Math.round(r.responseEnd),
        }));

      return {
        path: pathLabel,
        cls: Math.round(cls * 1000) / 1000,
        shiftEvents: shifts.length,
        settleMs,
        observeMs: Math.round(performance.now()),
        culprits: culprits.slice(0, 12),
        fontFaces,
        fontEvents: window.__fontEvents ?? [],
        fontResources,
        stylesheets,
        deferredCss: deferredApplied,
      };
    },
    { settleMs: SETTLE_MS, pathLabel: path },
  ).then((result) => ({ ...result, wallMs: elapsed }));
}

async function measurePage(browser, path) {
  const scores = [];
  let last = null;

  for (let i = 0; i < RUNS; i++) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    if (THROTTLE) {
      const cdp = await context.newCDPSession(page);
      await applyNetworkThrottle(cdp);
    }
    last = await measureOnce(page, path);
    scores.push(last.cls);
    await context.close();
  }

  return {
    ...last,
    path,
    runs: RUNS,
    clsMedian: Math.round(median(scores) * 1000) / 1000,
    clsRuns: scores.map((s) => Math.round(s * 1000) / 1000),
  };
}

function rating(cls) {
  if (cls <= 0.1) return "good";
  if (cls <= 0.25) return "needs improvement";
  return "poor";
}

function printReport(result) {
  console.log(`=== ${result.path} ===`);
  console.log(
    `  CLS (median of ${result.runs}): ${result.clsMedian}  [${rating(result.clsMedian)}]  runs: ${result.clsRuns.join(", ")}`,
  );
  console.log(`  Layout-shift events: ${result.shiftEvents}`);
  console.log("  Top culprits:");
  for (const c of result.culprits.slice(0, 6)) {
    const at = c.lastAtMs != null ? ` @${c.lastAtMs}ms` : "";
    console.log(`    ${c.score.toFixed(3).padStart(6)}  ${c.selector}${at}`);
    if (c.text) console.log(`             “${c.text}”`);
  }
  if (result.fontResources.length) {
    console.log("  Font files:");
    for (const f of result.fontResources) {
      console.log(`    +${String(f.startMs).padStart(4)}ms  done ${String(f.responseEndMs).padStart(4)}ms  ${f.url}`);
    }
  }
  if (result.deferredCss.length) {
    console.log("  CSS (network):");
    for (const c of result.deferredCss) {
      console.log(`    +${String(c.startMs).padStart(4)}ms  done ${String(c.responseEndMs).padStart(4)}ms  ${c.url}`);
    }
  }
  const pending = result.fontFaces.filter((f) => f.status !== "loaded");
  if (pending.length) {
    console.log(`  Fonts still not loaded: ${pending.map((f) => f.family).join(", ")}`);
  }
  console.log();
}

async function main() {
  const browser = await chromium.launch();
  const results = [];

  if (!JSON_OUT) {
    console.log(`Base URL: ${BASE}`);
    console.log(`Settle after load: ${SETTLE_MS}ms`);
    console.log(`Network throttle: ${THROTTLE ? "Fast 3G" : "none"}`);
    console.log(`Runs per page: ${RUNS} (median)\n`);
  }

  for (const path of PAGES) {
    const result = await measurePage(browser, path);
    results.push(result);
    if (!JSON_OUT) printReport(result);
  }

  await browser.close();

  if (JSON_OUT) {
    console.log(JSON.stringify({ base: BASE, settleMs: SETTLE_MS, throttle: THROTTLE, results }, null, 2));
    return;
  }

  const worst = results.reduce((a, b) => (a.clsMedian > b.clsMedian ? a : b));
  console.log("--- Summary ---");
  console.log(`Worst CLS: ${worst.path} → ${worst.clsMedian} (${rating(worst.clsMedian)})`);
  console.log(
    "\nTip: CLS here includes the full settle window (fonts + deferred CSS).",
  );
  console.log("Compare with Lighthouse “layout shift culprits” for the same URLs.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
