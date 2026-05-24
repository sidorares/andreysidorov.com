import { isDarkMode } from "@/lib/theme";

/** Site design tokens (keep in sync with `src/index.css`). */
const tokens = {
  light: {
    foreground: "#0f0f0f",
    muted: "#525252",
    card: "#f9f8f6",
    border: "#ddd9d0",
    /** Flowchart / diagram node outlines — stronger than `--border`. */
    nodeBorder: "#5c5752",
  },
  dark: {
    foreground: "#ebe6de",
    muted: "#a8a8a8",
    card: "#121212",
    border: "#2e2e2e",
    nodeBorder: "#a39e96",
  },
} as const;

function borderVars(t: { nodeBorder: string }) {
  return {
    primaryBorderColor: t.nodeBorder,
    secondaryBorderColor: t.nodeBorder,
    tertiaryBorderColor: t.nodeBorder,
    nodeBorder: t.nodeBorder,
    clusterBorder: t.nodeBorder,
    actorBorder: t.nodeBorder,
    noteBorderColor: t.nodeBorder,
  };
}

/** Mermaid themeVariables aligned with site design tokens. */
export function mermaidThemeConfig() {
  const dark = isDarkMode();
  const t = dark ? tokens.dark : tokens.light;

  if (dark) {
    return {
      theme: "dark" as const,
      themeVariables: {
        ...borderVars(t),
        background: "transparent",
        primaryColor: t.card,
        primaryTextColor: "#141414",
        secondaryColor: t.card,
        tertiaryColor: t.muted,
        lineColor: t.foreground,
        textColor: t.foreground,
        mainBkg: t.card,
        clusterBkg: "transparent",
        titleColor: t.foreground,
        edgeLabelBackground: "#141414",
        actorBkg: "#eeeeee",
        actorTextColor: "#141414",
        actorLineColor: t.muted,
        signalColor: t.foreground,
        signalTextColor: t.foreground,
        labelBoxBkgColor: "#141414",
        labelTextColor: t.foreground,
        noteBkgColor: "#eeeeee",
        noteTextColor: "#141414",
      },
    };
  }

  return {
    theme: "neutral" as const,
    themeVariables: {
      ...borderVars(t),
      background: "transparent",
      primaryColor: t.card,
      primaryTextColor: "#141414",
      secondaryColor: t.card,
      tertiaryColor: t.muted,
      lineColor: t.foreground,
      textColor: t.foreground,
      mainBkg: t.card,
      clusterBkg: "transparent",
      actorBkg: t.card,
      actorTextColor: "#141414",
      actorLineColor: t.muted,
      signalColor: t.foreground,
      signalTextColor: t.foreground,
      labelTextColor: t.foreground,
    },
  };
}
