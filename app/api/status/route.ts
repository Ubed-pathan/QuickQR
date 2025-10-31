import { NextResponse } from "next/server";
import store from "@/lib/store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = String(searchParams.get("code") || "").trim();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
  const sess = store!.get(code);
  if (!sess) return NextResponse.json({ exists: false }, { status: 404 });
  return NextResponse.json({ exists: true, files: sess.files.map(f => ({ name: f.name, size: f.size, type: f.type })), expiresAt: sess.expiresAt });
}
