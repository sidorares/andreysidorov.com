/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { ComponentType } from "react";
  export const frontmatter: any;
  export const toc: { depth: number; text: string; id: string }[];
  export const readingTime: number;
  const Component: ComponentType<any>;
  export default Component;
}
