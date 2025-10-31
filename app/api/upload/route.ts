import { NextResponse } from "next/server";
import store, { type StoredFile } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 60; // allow larger uploads in dev

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const form = await req.formData();
  const code = String(form.get("code") || "").trim();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
  if (!store!.has(code)) return NextResponse.json({ error: "Invalid or expired code" }, { status: 404 });

  const entries = form.getAll("files");
  if (!entries || entries.length === 0) return NextResponse.json({ error: "No files" }, { status: 400 });

  const files: StoredFile[] = [];
  for (const entry of entries) {
    if (entry instanceof File) {
      const ab = await entry.arrayBuffer();
      files.push({
        name: entry.name,
        type: entry.type || "application/octet-stream",
        size: entry.size,
        buffer: Buffer.from(ab),
      });
    }
  }

  if (files.length === 0) return NextResponse.json({ error: "No valid files" }, { status: 400 });

  store!.putFiles(code, files);
  const sess = store!.get(code)!;
  return NextResponse.json({ ok: true, count: files.length, expiresAt: sess.expiresAt });
}
