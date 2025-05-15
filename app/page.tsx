import Image from "next/image";
import Link from "next/link";

const curriculum = [
  {
    title: "Quantum Algorithms",
    description: "Grover, Shor, and more. Learn the core algorithms that power quantum computing.",
    links: [
      { label: "Grover's Algorithm", href: "/docs/quantum-algorithms" },
      { label: "Shor's Algorithm", href: "/docs/quantum-algorithms" },
      { label: "Other Algorithms", href: "/docs/quantum-algorithms" },
    ],
  },
  {
    title: "Qubits & Gates",
    description: "Understand the building blocks: Qubits, superposition, entanglement, and quantum gates.",
    links: [
      { label: "Qubits & Superposition", href: "/docs/quantum-fundamentals" },
      { label: "Quantum Gates", href: "/docs/quantum-fundamentals" },
    ],
  },
  {
    title: "Quantum Error Correction",
    description: "How do we make quantum computers reliable? Learn about error correction codes.",
    links: [
      { label: "Error Correction Basics", href: "/docs/quantum-fundamentals" },
    ],
  },
  {
    title: "Quantum Hardware",
    description: "Explore real quantum devices, simulators, and how quantum computers are built.",
    links: [
      { label: "Quantum Hardware Overview", href: "/docs/quantum-hardware" },
    ],
  },
  {
    title: "Quantum Machine Learning",
    description: "The intersection of quantum computing and AI. Learn about QML algorithms and frameworks.",
    links: [
      { label: "QML Basics", href: "/docs/quantum-algorithms" },
    ],
  },
  {
    title: "Tools & Frameworks",
    description: "Hands-on with Qiskit, Cirq, and more. Practice and build quantum programs.",
    links: [
      { label: "Qiskit", href: "/docs/quantum-hardware" },
      { label: "Cirq", href: "/docs/quantum-hardware" },
    ],
  },
  {
    title: "Courses & Resources",
    description: "Curated courses, primers, and practice problems for every level.",
    links: [
      { label: "Start Learning", href: "/docs/introduction" },
      { label: "What is Quantum Computing?", href: "/docs/what-is-quantum-computing" },
    ],
  },
];

export default function Home() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[90vh]">
      {/* Globe background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <Image
          src="/globe.svg"
          alt="QuantumHub Globe"
          width={700}
          height={700}
          className="opacity-30 blur-sm"
          priority
        />
      </div>
      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mt-12 mb-4 tracking-tight text-zinc-900 dark:text-zinc-100">
          QuantumHub
        </h1>
        <p className="text-lg md:text-xl text-center text-zinc-600 dark:text-zinc-300 mb-10 max-w-2xl">
          A modern, interactive curriculum for mastering Quantum Computing.<br />
          Learn quantum theory, algorithms, and Qiskit hands-on. Edit, preview, and contribute in real time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {curriculum.map((section) => (
            <div key={section.title} className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-2">
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">{section.title}</h2>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-2">{section.description}</p>
              <ul className="flex flex-col gap-1">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200 underline underline-offset-2 font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center text-zinc-500 dark:text-zinc-400 text-sm">
          Quantum curriculum for everyone.<br />
          <a href="https://github.com/sharmatriloknath/quantum-hub" target="_blank" rel="noopener" className="text-sky-600 hover:underline ml-1">GitHub</a>
        </div>
      </div>
    </div>
  );
}
