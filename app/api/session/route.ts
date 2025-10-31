import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import store from "@/lib/store";

export const runtime = "nodejs";

const digits = "0123456789";
const nano = customAlphabet(digits, 6);

export async function POST(req: Request) {
  const code = nano();
  store!.create(code);
  const { origin } = new URL(req.url);
  const url = `${origin}/r/${code}`;
  const sess = store!.get(code)!;
  return NextResponse.json({ code, url, expiresAt: sess.expiresAt }, { status: 201 });
}
