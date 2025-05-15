import fs from "fs";
import path from "path";
import { bundleMDX } from "mdx-bundler";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import rehypeSlug from "rehype-slug";
import rehypeToc from "rehype-toc";
import * as shiki from "shiki";

export async function getDocBySlug(slug: string) {
  const filePath = path.join(process.cwd(), "docs", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf8");

  // Shiki highlighter for code blocks
  const highlighter = await shiki.createHighlighter({
    themes: ["github-dark"],
    langs: []
  });

  const { code, frontmatter } = await bundleMDX({
    source,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        remarkMath,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        // Replace rehypeKatex with rehypeMathjax for better LaTeX rendering
        rehypeMathjax,
        rehypeSlug,
        rehypeToc,
        // Custom rehype plugin for Shiki code highlighting
        () => (tree: any) => {
          const visit = require("unist-util-visit");
          // Code block copy already handled
          // Now wrap math blocks for copy
          visit(tree, "element", (node: any) => {
            // Inline math
            if (node.tagName === "span" && node.properties?.className?.includes("math-inline")) {
              node.properties["data-latex"] = node.children?.[0]?.value || "";
              node.properties.className = [...(node.properties.className || []), "math-copyable"];
            }
            // Block math
            if (node.tagName === "div" && node.properties?.className?.includes("math-display")) {
              node.properties["data-latex"] = node.children?.[0]?.value || "";
              node.properties.className = [...(node.properties.className || []), "math-copyable"];
            }
          });
        },
        () => (tree: any) => {
          const visit = require("unist-util-visit");
          visit(tree, "element", (node: any) => {
            if (node.tagName === "code" && node.properties?.className) {
              const lang = (node.properties.className[0] || "").replace("language-", "");
              if (lang && node.children?.[0]?.value) {
                const html = highlighter.codeToHtml(node.children[0].value, { lang });
                node.type = "raw";
                node.value = html;
                node.children = [];
              }
            }
          });
        },
      ];
      return options;
    },
  });
  return {
    title: frontmatter?.title || slug,
    code,
    content: source,
  };
}
