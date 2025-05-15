"use client";
import { MDXProvider } from "@mdx-js/react";
import { useMemo } from "react";

// Add your custom components here if needed
const components = {};

export default function ClientMdxPage({ Doc }: { Doc: React.ComponentType }) {
  const MemoDoc = useMemo(() => Doc, [Doc]);
  return (
    <MDXProvider components={components}>
      <MemoDoc />
    </MDXProvider>
  );
}
