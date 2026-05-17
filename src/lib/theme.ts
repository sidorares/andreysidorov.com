/** Whether the page should render in dark mode (matches blocking script + CSS). */
export function isDarkMode(): boolean {
  const root = document.documentElement;
  if (root.classList.contains("light")) return false;
  if (root.classList.contains("dark")) return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.classList.toggle("light", !dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}
