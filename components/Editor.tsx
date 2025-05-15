"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function Editor({
  initialContent,
  onSave,
  onCancel,
}: {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(initialContent ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(content);
    setSaving(false);
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-6">
      <div className="mb-4">
        <MDEditor
          value={content ?? ""}
          onChange={v => setContent(v ?? "")}
          height={400}
          previewOptions={{
            components: {
              // You can add custom renderers for math, code, etc. here if needed
            },
          }}
        />
        <div className="mt-4">
          <div className="font-semibold mb-2 text-zinc-700 dark:text-zinc-200">Live Preview:</div>
          <div className="prose dark:prose-dark bg-white dark:bg-zinc-900 p-4 rounded border border-zinc-100 dark:border-zinc-800">
            <MarkdownPreview source={content} />
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-60"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <Loader2 className="inline animate-spin mr-2" /> : null} Save
        </button>
      </div>
    </div>
  );
}
