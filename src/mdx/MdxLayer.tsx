import { ReactNode } from "react";
import { MDXProvider } from "@mdx-js/react";
import { CodeBlockCopyEnhancer } from "@/components/CodeBlockCopyEnhancer";
import { Callout, Figure, Embed, Steps, Step } from "./components";
import { RunnableFence } from "./RunnableFence";

const components = {
  Callout,
  Figure,
  Embed,
  Steps,
  Step,
  RunnableFence,
  a: (props: any) => (
    <a {...props} className="prose-link" target={props.href?.startsWith("http") ? "_blank" : undefined} rel={props.href?.startsWith("http") ? "noreferrer" : undefined} />
  ),
};

export function MdxLayer({ children }: { children: ReactNode }) {
  return (
    <MDXProvider components={components as any}>
      <CodeBlockCopyEnhancer>{children}</CodeBlockCopyEnhancer>
    </MDXProvider>
  );
}
