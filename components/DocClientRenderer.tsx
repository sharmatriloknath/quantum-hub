"use client";
import { MDXProvider } from "@mdx-js/react";
import { useMemo } from "react";

const components = {};

export default function DocClientRenderer({ slug }: { slug: string }) {
  const Doc = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`../app/docs/${slug}.mdx`).default;
  }, [slug]);
  return (
    <MDXProvider components={components}>
      <Doc />
    </MDXProvider>
  );
}
