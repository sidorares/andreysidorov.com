import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export type FontFaceSpec = {
  family: string;
  /** Filename under public/fonts/ (self-hosted). */
  src: string;
  /** Legacy CDN URL — kept for reference only. */
  cdnUrl: string;
  weight?: string;
  style?: string;
  format?: string;
};

/** Copies woff2 from fontsource packages into public/fonts and drives @font-face generation. */
export const fontAssets: Array<{
  family: string;
  copyFrom: string;
  faces: Omit<FontFaceSpec, "family">[];
}> = [
  {
    family: "Inter",
    copyFrom: "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
    faces: [
      {
        src: "inter-latin.woff2",
        cdnUrl:
          "https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2",
        weight: "100 900",
        format: "woff2",
      },
    ],
  },
  {
    family: "Fraunces",
    copyFrom:
      "node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2",
    faces: [
      {
        src: "fraunces-latin.woff2",
        cdnUrl:
          "https://fonts.gstatic.com/s/fraunces/v38/6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxC9TeP2Xz5c.woff2",
        weight: "100 900",
        format: "woff2",
      },
    ],
  },
  {
    family: "JetBrains Mono",
    copyFrom: "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
    faces: [
      {
        src: "jetbrains-mono-400.woff2",
        cdnUrl:
          "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOVk6OThhvA.woff2",
        weight: "400",
      },
    ],
  },
  {
    family: "JetBrains Mono",
    copyFrom: "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2",
    faces: [
      {
        src: "jetbrains-mono-500.woff2",
        cdnUrl:
          "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxTOlOVk6OThhvA.woff2",
        weight: "500",
      },
    ],
  },
];

export const paths = {
  root,
  publicFonts: path.join(root, "public", "fonts"),
  fontsCss: path.join(root, "src", "fonts", "fonts.css"),
  fallbacksCss: path.join(root, "src", "fonts", "fallbacks.css"),
};
