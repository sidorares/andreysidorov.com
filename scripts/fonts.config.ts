import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export type FontFaceSpec = {
  family: string;
  src: string;
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
        weight: "100 900",
        format: "woff2-variations",
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
        weight: "100 900",
        format: "woff2-variations",
      },
    ],
  },
  {
    family: "JetBrains Mono",
    copyFrom: "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
    faces: [{ src: "jetbrains-mono-400.woff2", weight: "400" }],
  },
  {
    family: "JetBrains Mono",
    copyFrom: "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2",
    faces: [{ src: "jetbrains-mono-500.woff2", weight: "500" }],
  },
];

export const paths = {
  root,
  publicFonts: path.join(root, "public", "fonts"),
  fontsCss: path.join(root, "src", "fonts", "fonts.css"),
  fallbacksCss: path.join(root, "src", "fonts", "fallbacks.css"),
};
