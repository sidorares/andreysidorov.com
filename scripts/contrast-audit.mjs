/**
 * Playwright contrast audit — run: node scripts/contrast-audit.mjs [baseURL]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:8080";

const PAGES = [
  "/",
  "/blog",
  "/blog/2026-04-25-on-static-sites",
  "/blog/2026-04-20-hello-world",
  "/projects",
  "/projects/notes-engine",
  "/projects/pixel-pal",
  "/about",
  "/nope-404",
];

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    const root = document.documentElement;
    root.classList.toggle("dark", t === "dark");
    root.classList.toggle("light", t === "light");
  }, theme);
  await page.waitForTimeout(150);
}

async function auditPage(page, path, theme) {
  await page.addInitScript((t) => {
    const root = document.documentElement;
    root.classList.toggle("dark", t === "dark");
    root.classList.toggle("light", t === "light");
  }, theme);
  await page.goto(new URL(path, BASE).href, { waitUntil: "networkidle" });
  await page.waitForSelector("header.border-b");
  await setTheme(page, theme);
  await page
    .locator(".mermaid-host svg")
    .first()
    .waitFor({ state: "visible", timeout: 5000 })
    .catch(() => {});

  return page.evaluate(
    ({ path, theme }) => {
      const minNormal = 4.5;
      const minLarge = 3;

      function parseColor(css) {
        const el = document.createElement("div");
        el.style.color = css;
        document.body.appendChild(el);
        const computed = getComputedStyle(el).color;
        el.remove();
        const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!m) return null;
        return {
          r: +m[1],
          g: +m[2],
          b: +m[3],
          a: m[4] !== undefined ? +m[4] : 1,
        };
      }

      function blend(fg, bg) {
        const a = fg.a + bg.a * (1 - fg.a);
        if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
        return {
          r: Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a),
          g: Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a),
          b: Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a),
          a,
        };
      }

      function luminance({ r, g, b }) {
        const [rs, gs, bs] = [r, g, b].map((c) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      function contrastRatio(fg, bg) {
        const l1 = luminance(fg);
        const l2 = luminance(bg);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      function effectiveBackground(el) {
        let bg = { r: 255, g: 255, b: 255, a: 1 };
        let node = el;
        const stack = [];
        while (node && node !== document.documentElement) {
          const s = getComputedStyle(node);
          const c = parseColor(s.backgroundColor);
          if (c && c.a > 0) stack.push(c);
          node = node.parentElement;
        }
        const htmlBg = parseColor(getComputedStyle(document.documentElement).backgroundColor);
        if (htmlBg && htmlBg.a > 0) stack.push(htmlBg);
        const bodyBg = parseColor(getComputedStyle(document.body).backgroundColor);
        if (bodyBg && bodyBg.a > 0) stack.push(bodyBg);
        for (const layer of stack.reverse()) {
          bg = blend(layer, bg);
        }
        return bg;
      }

      function isLargeText(el, fontSize, fontWeight) {
        const fw = parseInt(fontWeight, 10) || 400;
        return fontSize >= 24 || (fontSize >= 18.66 && fw >= 700);
      }

      function snippet(el, max = 60) {
        const t = (el.textContent ?? "").replace(/\s+/g, " ").trim();
        return t.length > max ? `${t.slice(0, max)}…` : t;
      }

      function selectorHint(el) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : "";
        const cls =
          el.classList.length > 0
            ? "." + [...el.classList].slice(0, 4).join(".")
            : "";
        return `${tag}${id}${cls}`;
      }

      const failures = [];
      const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH"]);

      function walk(root) {
        if (skipTags.has(root.tagName)) return;
        const style = getComputedStyle(root);
        if (style.display === "none" || style.visibility === "hidden") return;
        if (parseFloat(style.opacity) < 0.1) return;

        const hasDirectText = [...root.childNodes].some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0,
        );

        if (hasDirectText) {
          const fg = parseColor(style.color);
          if (!fg || fg.a < 0.05) return;
          const bg = effectiveBackground(root);
          const fgSolid = blend(fg, bg);
          const ratio = contrastRatio(fgSolid, bg);
          const fontSize = parseFloat(style.fontSize);
          const large = isLargeText(root, fontSize, style.fontWeight);
          const required = large ? minLarge : minNormal;
          if (ratio < required - 0.01) {
            failures.push({
              ratio: Math.round(ratio * 100) / 100,
              required,
              selector: selectorHint(root),
              snippet: snippet(root),
              color: style.color,
              background: `rgb(${bg.r},${bg.g},${bg.b})`,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
            });
          }
        }

        for (const child of root.children) walk(child);
      }

      document
        .querySelectorAll(
          ".mermaid-host svg text, .mermaid-host svg tspan, .mermaid-host svg foreignObject span, .mermaid-host svg foreignObject p",
        )
        .forEach((node) => {
        const el = node;
        const style = getComputedStyle(el);
        const fill = el.getAttribute("fill") || style.fill || style.color;
        const fg = parseColor(fill === "currentColor" ? style.color : fill);
        if (!fg) return;
        const bg = effectiveBackground(el);
        const fgSolid = blend(fg, bg);
        const ratio = contrastRatio(fgSolid, bg);
        const fontSize = parseFloat(style.fontSize) || 14;
        const required = fontSize >= 18 ? minLarge : minNormal;
        const label = (el.textContent ?? "").trim();
        if (!label) return;
        if (ratio < required - 0.01) {
          failures.push({
            ratio: Math.round(ratio * 100) / 100,
            required,
            selector: "mermaid svg text",
            snippet: label.slice(0, 60),
            color: fill,
            background: `rgb(${bg.r},${bg.g},${bg.b})`,
            fontSize: String(fontSize),
            fontWeight: style.fontWeight,
          });
        }
      });

      walk(document.body);
      return { path, theme, failures };
    },
    { path, theme },
  );
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route("https://cloud.umami.is/**", (r) => r.abort());

  const all = [];

  for (const theme of ["light", "dark"]) {
    for (const path of PAGES) {
      try {
        const result = await auditPage(page, path, theme);
        all.push(result);
        if (result.failures.length > 0) {
          console.log(`\n=== ${theme.toUpperCase()} ${path} (${result.failures.length} failures) ===`);
          const seen = new Set();
          for (const f of result.failures) {
            const key = `${f.selector}|${f.color}|${f.background}|${f.required}`;
            if (seen.has(key)) continue;
            seen.add(key);
            console.log(
              `  ${f.ratio}:1 (need ${f.required}:1) ${f.selector} "${f.snippet}"\n    fg=${f.color} bg=${f.background} ${f.fontSize}/${f.fontWeight}`,
            );
          }
        } else {
          console.log(`OK ${theme} ${path}`);
        }
      } catch (e) {
        console.error(`ERR ${theme} ${path}:`, e);
      }
    }
  }

  await browser.close();

  const total = all.reduce((n, r) => n + r.failures.length, 0);
  console.log(`\n--- Total failures: ${total} ---`);
  process.exit(total > 0 ? 1 : 0);
}

main();
