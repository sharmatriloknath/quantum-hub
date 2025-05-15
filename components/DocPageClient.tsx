"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import Editor from "./Editor";
import DocClientRenderer from "./DocClientRenderer";
import MdxRenderer from "./MdxRenderer";
import styles from "../app/docs/[...slug]/DocPage.module.css";

async function saveEdit(slug: string, content: string) {
  const res = await fetch("/api/docs/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, content }),
  });
  if (!res.ok) throw new Error("Failed to save file");
}

export default function DocPageClient({ slug, initialContent, isNewPage = false }: { slug: string, initialContent: string, isNewPage?: boolean }) {
  const [editMode, setEditMode] = useState(isNewPage);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const router = useRouter();

  // Dynamically import the compiled MDX React component for the current slug
  const MDXContent = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require(`../app/docs/${slug}.mdx`).default;
    } catch (e) {
      return () => <div>Document not found.</div>;
    }
  }, [slug]);

  // New Page Creation
  if (isNewPage) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Page</h2>
        <input
          className="w-full mb-2 px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          placeholder="Title"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
          }}
        />
        <input
          className="w-full mb-2 px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          placeholder="Slug (e.g. quantum/new-topic)"
          value={slugInput}
          onChange={e => setSlugInput(e.target.value)}
        />
        <Editor
          initialContent={content}
          onSave={async newContent => {
            setSaving(true);
            try {
              const res = await fetch("/api/docs/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: slugInput, content: newContent }),
              });
              if (!res.ok) throw new Error("Failed to create page");
              setContent(newContent);
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 2000);
              router.push(`/docs/${slugInput}`);
            } finally {
              setSaving(false);
            }
          }}
          onCancel={() => router.back()}
          saving={saving}
        />
        {saveSuccess && (
          <div className="mt-2 text-green-600 dark:text-green-400 text-sm">Page created successfully!</div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {/* Render the page title from the first heading or slug */}
            {content.match(/^#{1,6} .+/)?.[0]?.replace(/^#+\s*/, "") || slug.replace(/-/g, " ")}
            {!editMode && (
              <button
                className="ml-2 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
                onClick={() => setEditMode(true)}
                title="Edit this page"
              >
                <Pencil size={18} />
              </button>
            )}
          </h2>
        </div>
        {editMode ? (
          <Editor
            initialContent={content}
            onSave={async newContent => {
              setSaving(true);
              try {
                await saveEdit(slug, newContent);
                setContent(newContent);
                setEditMode(false);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2000);
              } finally {
                setSaving(false);
              }
            }}
            onCancel={() => setEditMode(false)}
            saving={saving}
          />
        ) : (
          <MdxRenderer MDXContent={MDXContent} />
        )}
        {saveSuccess && (
          <div className="mt-2 text-green-600 dark:text-green-400 text-sm">Saved successfully!</div>
        )}
        <div className={styles.editLinkContainer}>
          <a
            href={`https://github.com/your-org/quantumhub/blob/main/app/docs/${slug}.mdx`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.editLink}
          >
            Edit on GitHub
            <svg /* ... SVG ... */ className={styles.editLinkIcon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
