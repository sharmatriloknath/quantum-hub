export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-6 mt-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
      <div>
        QuantumHub &copy; {new Date().getFullYear()} &middot; 
        <a href="https://github.com/sharmatriloknath/quantum-hub" target="_blank" rel="noopener" className="text-sky-600 hover:underline ml-1">GitHub</a>
      </div>
      <div className="mt-1">
        Built By Trilok Nath &amp; Team. Quantum curriculum for everyone.
      </div>
    </footer>
  );
}
