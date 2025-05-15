// next.config.ts
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeShiki from '@shikijs/rehype'; // Using ShikiJS for syntax highlighting

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    domains: ['upload.wikimedia.org', 'miro.medium.com'],
  },
  // Add any other Next.js specific configurations here
  // For example, if you use experimental features:
  // experimental: {
  //   appDir: true, // Assuming you are using the App Router
  // },
};

const withMDX = createMDX({
  // extension: /\.mdx?$/, // This is often inferred or can be kept if you have specific needs
  options: {
    remarkPlugins: [
      remarkGfm, // For GitHub Flavored Markdown (tables, strikethrough, etc.)
      remarkMath, // For math syntax
    ],
    rehypePlugins: [
      rehypeSlug, // Adds 'id' attributes to headings
      [
        rehypeAutolinkHeadings, // Adds anchor links to headings
        {
          behavior: 'append', // 'wrap' the heading, or 'prepend'/'append' the link
          properties: {
            className: ['anchor-link'], // Class for styling the anchor link
            'aria-hidden': 'true',
            tabIndex: -1,
          },
          // Optional: Custom content for the link, e.g., a '#' symbol or an SVG icon
          // Using Lucide 'LinkIcon' as an example - this would require client-side rendering or more complex setup
          // For simplicity with rehype, a text character is easier.
          content: { type: 'text', value: '🔗' } // Or '#' or an inline SVG string
        },
      ],
      rehypeKatex, // For rendering math equations with KaTeX
      [
        rehypeShiki, // For syntax highlighting
        {
          // You can specify themes for light and dark mode
          themes: {
            light: 'github-light', // Or any other Shiki theme
            dark: 'github-dark',  // Or any other Shiki theme
          },
          // Optional: Add custom class to the <pre> tag Shiki generates
          // This can be useful for more specific CSS targeting if needed.
          // addLanguageClass: true, // Adds "language-js" etc. to the <pre> tag
          // defaultLang: 'plaintext', // Default language if none is specified
          // onVisitLine(node) {
          //   // You can transform lines here
          // },
          // onVisitHighlightedLine(node) {
          //   // You can transform highlighted lines
          // },
          // onVisitCode(hast) {
          //   // You can transform the entire code block's HAST tree
          // }
        },
      ],
    ],
    providerImportSource: '@mdx-js/react', // Important for using MDXProvider
  },
});

export default withMDX(nextConfig);