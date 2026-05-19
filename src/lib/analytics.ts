export type UmamiEventData = Record<string, string | number | boolean>;

export function trackEvent(name: string, data?: UmamiEventData): void {
  if (typeof window === "undefined") return;
  if (!window.umami?.track) return;

  window.umami.track(name, data);

  if (import.meta.env.DEV) {
    console.debug("[analytics]", name, data);
  }
}
