import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { slug, content } = await req.json();
    if (!slug || typeof content !== "string") {
      return NextResponse.json({ error: "Missing slug or content" }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), "app", "docs", `${slug}.mdx`);
    fs.writeFileSync(filePath, content, "utf8");
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e?.toString() || "Unknown error" }, { status: 500 });
  }
}
