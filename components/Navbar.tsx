// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Github } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between px-6 h-[65px]">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/globe.svg" className="h-8 w-8" alt="QuantumHub Logo" />
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">QuantumHub</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <a href="https://github.com/sharmatriloknath/quantum-hub" target="_blank" rel="noopener" className="text-zinc-500 hover:text-sky-600 dark:hover:text-sky-400 px-2 py-2 rounded transition flex items-center">
          <Github className="w-5 h-5" />
        </a>
        <button
          className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <svg className="w-6 h-6 text-zinc-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
          )}
        </button>
      </div>
    </nav>
  );
}