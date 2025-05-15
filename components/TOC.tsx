"use client";
import { useEffect, useState } from "react";

export default function TOC({ headings = [] }: { headings?: { level: number; text: string; id: string }[] | undefined | null; content?: string }) {
  // If headings is not an array, try to extract from content (if provided)
  if (!Array.isArray(headings) && typeof headings === 'string') {
    headings = (headings.match(/^#{1,6} .+/gm) || []).map(line => {
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s*/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return { level, text, id };
    });
  }
  if (!Array.isArray(headings)) headings = [];
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handler = () => {
      let current = "";
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && window.scrollY + 80 >= el.offsetTop) {
          current = h.id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [headings]);

  if (!headings || !headings.length) return null;
  return (
    <nav className="sticky top-24 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
      <div className="font-semibold text-zinc-700 dark:text-zinc-200 mb-2 text-sm">On this page</div>
      <ul className="space-y-1 text-sm">
        {headings.map(h => (
          <li key={h.id} className="truncate">
            <a
              href={`#${h.id}`}
              className={`block pl-${(h.level - 1) * 4} ${activeId === h.id ? "text-sky-600 font-bold" : "text-zinc-600 dark:text-zinc-300 hover:text-sky-600"}`}
              style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
