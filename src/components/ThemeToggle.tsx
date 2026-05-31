import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { applyTheme, isDarkMode } from "@/lib/theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(isDarkMode());
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem("theme")) setDark(isDarkMode());
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const showDark = mounted ? dark : false;

  return (
    <button
      onClick={() => {
        setDark((d) => {
          const next = !d;
          applyTheme(next);
          trackEvent("theme-change", { theme: next ? "dark" : "light" });
          return next;
        });
      }}
      aria-label="Toggle theme"
      className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
    >
      {showDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
    </button>
  );
}
