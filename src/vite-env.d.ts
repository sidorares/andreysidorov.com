/// <reference types="vite/client" />

interface Window {
  umami?: {
    track: (
      event: string | object | ((props: object) => object),
      data?: Record<string, string | number | boolean>,
    ) => void;
  };
}

declare module "*.mdx" {
  import type { ComponentType } from "react";
  export const frontmatter: any;
  export const toc: { depth: number; text: string; id: string }[];
  export const readingTime: number;
  const Component: ComponentType<any>;
  export default Component;
}
