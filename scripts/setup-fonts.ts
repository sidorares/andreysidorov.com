import fs from "node:fs/promises";
import path from "node:path";
import { fontAssets, paths } from "./fonts.config";

function buildFontFaceCss(family: string, faces: (typeof fontAssets)[number]["faces"]) {
  return faces
    .map((face) => {
      const lines = [
        "@font-face {",
        `  font-family: ${JSON.stringify(family)};`,
        "  font-style: normal;",
        "  font-display: swap;",
      ];
      if (face.weight) lines.push(`  font-weight: ${face.weight};`);
      lines.push(
        `  src: url(${JSON.stringify(face.cdnUrl)}) format(${JSON.stringify(face.format ?? "woff2")});`,
        "}",
      );
      return lines.join("\n");
    })
    .join("\n\n");
}

async function main() {
  await fs.mkdir(paths.publicFonts, { recursive: true });
  await fs.mkdir(path.dirname(paths.fontsCss), { recursive: true });

  const cssBlocks: string[] = [
    "/* @font-face src: Google CDN. Local copies in public/fonts/ for fontaine metrics. Run: npm run fonts */",
  ];
  const facesByFamily = new Map<string, (typeof fontAssets)[number]["faces"]>();

  for (const asset of fontAssets) {
    const source = path.join(paths.root, asset.copyFrom);
    for (const face of asset.faces) {
      const dest = path.join(paths.publicFonts, face.src);
      await fs.copyFile(source, dest);
      const existing = facesByFamily.get(asset.family) ?? [];
      existing.push(face);
      facesByFamily.set(asset.family, existing);
    }
  }

  for (const [family, faces] of facesByFamily) {
    cssBlocks.push(buildFontFaceCss(family, faces));
  }

  const css = cssBlocks.join("\n\n");
  await fs.writeFile(paths.fontsCss, `${css}\n`);
  console.log(`Wrote ${paths.fontsCss} and ${fontAssets.length} font file(s) to public/fonts/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
