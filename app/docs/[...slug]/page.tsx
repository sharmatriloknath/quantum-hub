// app/docs/[...slug]/page.tsx
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import DocPageClient from "../../../components/DocPageClient";
import TOC from "../../../components/TOC";

export default async function DocPage(props: { params: { slug?: string[] } }) {
  const params = await props.params;
  const slugArr = params?.slug ?? ["introduction"];
  // New page route
  if (slugArr.length === 1 && slugArr[0] === "new") {
    return (
      <div className="flex flex-col md:flex-row items-start w-full min-h-[80vh] px-2 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 mt-8 mb-8">
            <DocPageClient slug={""} initialContent={""} isNewPage />
          </div>
        </div>
      </div>
    );
  }
  const slug = slugArr.join("-");
  const filePath = path.join(process.cwd(), "app", "docs", `${slug}.mdx`);
  let initialContent = "";
  let fileExists = false;
  try {
    initialContent = fs.readFileSync(filePath, "utf8");
    fileExists = true;
  } catch {}
  // Extract headings from initialContent for TOC
  const headings = (initialContent.match(/^#{1,6} .+/gm) || []).map(line => {
    const level = line.match(/^#+/)[0].length;
    const text = line.replace(/^#+\s*/, "");
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return { level, text, id };
  });
  if (!fileExists) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[80vh] px-2">
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 mt-12 mb-12">
          <div className="text-2xl font-bold mb-4">This page is empty.</div>
          <div className="text-zinc-500 dark:text-zinc-400 text-lg text-center mb-8">
            The requested documentation page does not exist yet.<br />
            <a href="/docs/new" className="text-sky-600 hover:underline">Create it now</a>.
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center w-full min-h-[80vh] px-2">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mt-12 mb-12">
        {/* Main Content */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8">
            <div className="prose dark:prose-invert prose-zinc prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-p:text-zinc-800 dark:prose-p:text-zinc-200 prose-a:text-sky-700 dark:prose-a:text-sky-400 prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:text-pink-600 dark:prose-code:text-pink-400">
              <DocPageClient slug={slug} initialContent={initialContent} />
            </div>
          </div>
        </div>
        {/* TOC */}
        <aside className="hidden md:block w-80 flex-shrink-0">
          <div className="sticky top-28">
            <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800 p-4">
              <TOC headings={headings} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}