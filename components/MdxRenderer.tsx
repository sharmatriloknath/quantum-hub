// components/MdxRenderer.tsx
"use client";

import "katex/dist/katex.min.css"; // Ensure KaTeX CSS is loaded
import Image, { ImageProps } from "next/image";
import { getMDXComponent } from "mdx-bundler/client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, ReactNode, cloneElement } from "react";
import { Copy, Check, ExternalLink, Youtube, FileCode } from "lucide-react"; // Import icons

// --- Table of Contents (TOC) ---
interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(container: HTMLElement | null): Heading[] {
  if (!container) return [];
  const headings = Array.from(
    container.querySelectorAll("h1, h2, h3, h4") // Limit TOC depth if desired (e.g., up to h4)
  );
  return headings
    .map((h) => ({
      id: h.id,
      text: h.textContent || "",
      level: parseInt(h.tagName[1]),
    }))
    .filter((h) => h.id && h.text); // Ensure valid id and text
}

export function TOC({ contentRef }: { contentRef: React.RefObject<HTMLElement> }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-20% 0px -70% 0px", // Adjust to trigger active state when heading is in the middle 10% of viewport
      threshold: 0.1, // Fire when 10% of the element is visible
    });

    const elements = contentRef.current?.querySelectorAll("h1[id], h2[id], h3[id], h4[id]");
    if (elements) {
      elements.forEach((elem) => observer.current?.observe(elem));
      setHeadings(extractHeadings(contentRef.current));
    }

    return () => observer.current?.disconnect();
  }, [contentRef]);


  if (!headings.length) return null;

  return (
    // Apply your preferred TOC styling here. Sticky positioning is common.
    // The example styles are basic; you'd use your global CSS or module.
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-1 text-sm w-56 hidden lg:block">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
        On this page
      </h2>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={`ml-${(h.level - 1) * 2}`}> {/* Indentation based on level */}
            <a
              href={`#${h.id}`}
              className={`block py-0.5 transition-colors duration-150
                ${
                  activeId === h.id
                    ? "text-sky-600 dark:text-sky-400 font-medium"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }
              `}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}


// --- Custom MDX Components ---

// Enhanced Image Component
const MdxImage = (props: ImageProps) => (
  <figure className="my-6 flex flex-col items-center">
    <Image
      {...props}
      alt={props.alt || " "} // Provide default alt if missing
      width={props.width || 768} // Default width
      height={props.height || 432} // Default height (16:9 aspect ratio for 768 width)
      className="rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 object-contain" // object-contain to prevent distortion
    />
    {props.alt && ( // Display caption if alt text is provided (often used for captions)
      <figcaption className="mt-2 text-sm text-center text-zinc-600 dark:text-zinc-400 italic">
        {props.alt}
      </figcaption>
    )}
  </figure>
);

// Enhanced Link Component
const MdxLink = (props: { href?: string; children: ReactNode }) => {
  const { href, children, ...rest } = props;
  if (!href) return <span {...rest}>{children}</span>; // Handle case where href might be missing

  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-500 underline decoration-sky-600/30 dark:decoration-sky-400/30 hover:decoration-sky-600/50 dark:hover:decoration-sky-400/50 underline-offset-2 transition-all"
        {...rest}
      >
        {children}
        <ExternalLink size={14} className="opacity-70 group-hover:opacity-100" />
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-500 underline decoration-sky-600/30 dark:decoration-sky-400/30 hover:decoration-sky-600/50 dark:hover:decoration-sky-400/50 underline-offset-2 transition-all"
      {...rest}
    >
      {children}
    </Link>
  );
};

// Enhanced Code Block Component (for Shiki output)
const Pre = ({ children, ...props }: { children: ReactNode; [key: string]: any }) => {
  // Shiki often wraps the code in a <pre><code> structure.
  // This component is intended to wrap Shiki's <pre> output.
  // We need to extract the raw code text for the copy button.
  // This extraction can be tricky if children are complex.
  // A more robust way is to pass the raw code via a prop from the rehype plugin.

  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const rawCode = useMemo(() => {
    if (preRef.current) {
      const codeElement = preRef.current.querySelector('code');
      return codeElement?.innerText || '';
    }
    // Fallback if ref not ready or no code tag, try to get from children (less reliable)
    if (typeof children === 'object' && children !== null && 'props' in children && children.props && typeof children.props.children === 'string') {
      return children.props.children;
    }
    return '';
  }, [children]);


  const handleCopy = async () => {
    if (rawCode) {
      try {
        await navigator.clipboard.writeText(rawCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  const lang = props['data-language'] || props.className?.match(/language-(\w+)/)?.[1] || '';

  return (
    <div className="relative group my-6 prose-pre-wrapper"> {/* Custom class for targeting */}
      {lang && (
        <div className="absolute top-0 right-3 -translate-y-1/2 px-2 py-0.5 text-xs font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full z-10">
          {lang}
        </div>
      )}
      <pre ref={preRef} {...props} className={`${props.className} shiki-pre-override`}> {/* Add another class for specific shiki <pre> overrides */}
        {children}
      </pre>
      {rawCode && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 z-10 p-1.5 bg-zinc-700/50 dark:bg-zinc-800/70 text-zinc-300 dark:text-zinc-400 rounded-md hover:bg-zinc-600/70 dark:hover:bg-zinc-700/90 hover:text-white dark:hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy code"
          title="Copy code"
        >
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      )}
    </div>
  );
};

// Callout / Admonition Component (Example)
const Callout = ({ type = "note", title, children }: { type?: "note" | "warning" | "tip" | "danger"; title?: string; children: ReactNode }) => {
  const typeStyles = {
    note: "bg-sky-50 dark:bg-sky-900/30 border-sky-500 dark:border-sky-600 text-sky-800 dark:text-sky-200",
    warning: "bg-amber-50 dark:bg-amber-900/30 border-amber-500 dark:border-amber-600 text-amber-800 dark:text-amber-200",
    tip: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200",
    danger: "bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-800 dark:text-red-200",
  };
  const iconMap = { // Example using Lucide icons
    note: <FileCode size={18} className="text-sky-500 dark:text-sky-600"/>,
    warning: <ExternalLink size={18} className="text-amber-500 dark:text-amber-600"/>, // Placeholder
    tip: <Check size={18} className="text-emerald-500 dark:text-emerald-600"/>, // Placeholder
    danger: <ExternalLink size={18} className="text-red-500 dark:text-red-600"/>, // Placeholder
  }

  return (
    <div className={`my-6 p-4 border-l-4 rounded-r-md shadow-sm ${typeStyles[type]}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{iconMap[type]}</div>
        <div>
          {title && <h5 className="text-base font-semibold mb-1">{title}</h5>}
          <div className="text-sm prose-p:my-1">{children}</div> {/* prose-p:my-1 to reduce paragraph margin inside callout */}
        </div>
      </div>
    </div>
  );
};

// YouTube Embed
const YouTubeEmbed = ({ videoId, title }: { videoId: string; title?: string }) => (
  <div className="my-6 aspect-video overflow-hidden rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title || "YouTube video player"}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  </div>
);

// Math Copyable Wrapper
const MathCopyable = ({ children, latex }: { children: ReactNode; latex: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    if (latex) {
      try {
        await navigator.clipboard.writeText(latex);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy math: ", err);
      }
    }
  };
  return (
    <span className="relative group inline-block align-middle">
      {children}
      <button
        onClick={handleCopy}
        className="absolute top-0 right-0 z-10 p-1 bg-zinc-700/50 dark:bg-zinc-800/70 text-zinc-300 dark:text-zinc-400 rounded-md hover:bg-zinc-600/70 dark:hover:bg-zinc-700/90 hover:text-white dark:hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ml-1"
        aria-label="Copy LaTeX"
        title="Copy LaTeX"
        style={{ fontSize: 12 }}
      >
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </span>
  );
};

// Patch MDXContent to wrap math-copyable elements
function wrapMathCopyable(node: ReactNode): ReactNode {
  if (!node) return node;
  if (Array.isArray(node)) return node.map(wrapMathCopyable);
  if (typeof node === "object" && node && 'props' in node && node.props) {
    const { className = "", ...rest } = node.props;
    if (className.includes("math-copyable") && node.props["data-latex"]) {
      return (
        <MathCopyable latex={node.props["data-latex"]}>
          {cloneElement(node, { ...rest })}
        </MathCopyable>
      );
    }
    // Recursively wrap children
    if (node.props.children) {
      return cloneElement(node, {
        ...rest,
        children: wrapMathCopyable(node.props.children),
      });
    }
  }
  return node;
}

const mdxComponents = {
  img: MdxImage,
  a: MdxLink,
  pre: Pre, // Override the <pre> tag Shiki usually renders into
  // Add your custom components here for use in MDX
  Callout, // Usage: <Callout type="warning" title="Important">Content here</Callout>
  YouTube: YouTubeEmbed, // Usage: <YouTube videoId="yourVideoId" />
  // You can override h1, h2, etc. if you need custom logic, but rehype-slug and CSS are often enough
};

export default function MdxRenderer({ MDXContent }: { MDXContent: React.ComponentType<any> }) {
  const contentRef = useRef<HTMLElement>(null); // For TOC or other direct DOM manipulations
  // Render the compiled MDX React component with custom components
  const rendered = useMemo(() => wrapMathCopyable(<MDXContent components={mdxComponents as any} />), [MDXContent]);

  return (
    // The ref is on the main content wrapper.
    // Apply the 'prose' class here from globals.css
    <div ref={contentRef as any} className="prose dark:prose-dark">
      {rendered}
    </div>
  );
}