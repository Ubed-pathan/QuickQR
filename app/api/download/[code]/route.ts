import { NextResponse } from "next/server";
import store from "@/lib/store";
import JSZip from "jszip";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const sess = store!.consume(code);
  if (!sess || sess.files.length === 0) {
    return NextResponse.json({ error: "Nothing to download" }, { status: 404 });
  }

  if (sess.files.length === 1) {
    const f = sess.files[0];
    return new Response(f.buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "content-type": f.type || "application/octet-stream",
        "content-disposition": `attachment; filename="${encodeURIComponent(f.name)}"`,
      },
    });
  }

  const zip = new JSZip();
  sess.files.forEach((f) => {
    zip.file(f.name, f.buffer);
  });
  const zipBuf = await zip.generateAsync({ type: "nodebuffer" });
  return new Response(zipBuf as unknown as BodyInit, {
    status: 200,
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="quickqr-${code}.zip"`,
    },
  });
}
