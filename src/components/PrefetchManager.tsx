import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { prefetchHref } from "@/lib/prefetch";

type IdleHandle = number;

function requestIdle(cb: () => void, timeoutMs: number): IdleHandle {
  const ric = (window as any).requestIdleCallback as
    | ((fn: () => void, opts?: { timeout?: number }) => number)
    | undefined;
  if (ric) return ric(cb, { timeout: timeoutMs });
  return window.setTimeout(cb, Math.min(500, timeoutMs));
}

function cancelIdle(handle: IdleHandle) {
  const cic = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;
  if (cic) cic(handle);
  else window.clearTimeout(handle);
}

export function PrefetchManager({
  viewportIdleMs = 750,
}: {
  viewportIdleMs?: number;
}) {
  const location = useLocation();

  useEffect(() => {
    const root = document.getElementById("root") ?? document.body;
    const internalLinks = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('a[href^="/"]'),
    );

    const abort = new AbortController();

    for (const a of internalLinks) {
      a.addEventListener(
        "focus",
        () => prefetchHref(a.href, "focus"),
        { signal: abort.signal },
      );
      a.addEventListener(
        "pointerenter",
        () => prefetchHref(a.href, "hover"),
        { signal: abort.signal },
      );
      a.addEventListener(
        "touchstart",
        () => prefetchHref(a.href, "touchstart"),
        { passive: true, signal: abort.signal },
      );
      a.addEventListener(
        "mousedown",
        () => prefetchHref(a.href, "mousedown"),
        { signal: abort.signal },
      );
    }

    // Conservative "idle" prefetch for primary nav links.
    // This is the cheapest win for the home → About case because it:
    // - avoids waiting for hover/trajectory
    // - only targets a tiny, high-intent set of links
    const primaryNavIdle = requestIdle(() => {
      for (const a of internalLinks) {
        const href = a.getAttribute("href");
        if (href === "/about" || href === "/blog" || href === "/projects") {
          prefetchHref(a.href, "viewport-idle");
        }
      }
    }, 250);

    const idleByEl = new WeakMap<Element, IdleHandle>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLAnchorElement;
          if (entry.isIntersecting) {
            if (idleByEl.has(el)) continue;
            const handle = requestIdle(() => {
              prefetchHref(el.href, "viewport-idle");
              idleByEl.delete(el);
            }, viewportIdleMs);
            idleByEl.set(el, handle);
          } else {
            const handle = idleByEl.get(el);
            if (handle !== undefined) {
              cancelIdle(handle);
              idleByEl.delete(el);
            }
          }
        }
      },
      { root: null, rootMargin: "200px 0px 200px 0px", threshold: 0.01 },
    );
    for (const a of internalLinks) io.observe(a);

    // Trajectory intent (dynamic import to keep initial bundle lean).
    const foresightAbort = new AbortController();
    let foresightLoaded = false;
    const ensureForesight = async () => {
      if (foresightLoaded || foresightAbort.signal.aborted) return;
      foresightLoaded = true;
      try {
        const mod = await import("js.foresight");
        const { ForesightManager } = mod as any;
        const mgr = ForesightManager?.instance;
        if (!mgr) return;

        const registered = new WeakSet<Element>();
        for (const a of internalLinks) {
          if (registered.has(a)) continue;
          registered.add(a);
          mgr.register({
            element: a,
            callback: () => prefetchHref(a.href, "trajectory"),
          });
        }
      } catch {
        // ignore (prefetch still works via focus/hover/viewport-idle)
      }
    };

    // Load on first pointer movement (best chance to prefetch before hover).
    window.addEventListener("pointermove", ensureForesight, {
      once: true,
      passive: true,
      signal: foresightAbort.signal,
    });
    // Also load after a short idle period.
    const foresightIdle = requestIdle(ensureForesight, 200);

    return () => {
      abort.abort();
      foresightAbort.abort();
      cancelIdle(primaryNavIdle);
      cancelIdle(foresightIdle);
      io.disconnect();
    };
  }, [location.pathname, viewportIdleMs]);

  return null;
}

