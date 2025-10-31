"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

type SessionResp = { code: string; url: string; expiresAt: number };

export default function SendPage() {
  const [session, setSession] = useState<SessionResp | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasFilesSelected, setHasFilesSelected] = useState(false);

  async function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    const selected = !!files && files.length > 0;
    setHasFilesSelected(selected);
    if (selected && !session) {
      try {
        const sRes = await fetch("/api/session", { method: "POST" });
        if (!sRes.ok) throw new Error("Failed to create session");
        const sData = (await sRes.json()) as SessionResp;
        setSession(sData);
        setMessage("Code generated. You can now upload and share.");
      } catch (err: any) {
        setMessage(err.message || "Could not generate code");
      }
    }
  }

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const files = form.getAll("files");
    if (!files || files.length === 0) {
      setMessage("Please select at least one file.");
      return;
    }

    setUploading(true);
    try {
      if (!session) {
        const sRes = await fetch("/api/session", { method: "POST" });
        if (!sRes.ok) throw new Error("Failed to create session");
        const sData = (await sRes.json()) as SessionResp;
        setSession(sData);
        form.append("code", sData.code);
      } else {
        form.append("code", session.code);
      }
      const uRes = await fetch("/api/upload", { method: "POST", body: form });
      const uData = await uRes.json();
      if (!uRes.ok) throw new Error(uData?.error || "Upload failed");

      setMessage(`Uploaded ${uData.count} file(s). Share the QR or code below.`);
      (e.currentTarget as HTMLFormElement).reset();
      setHasFilesSelected(false);
    } catch (err: any) {
      setMessage(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="container py-10">
      <div className="mx-auto grid max-w-3xl gap-6">
        <h1 className="text-3xl font-semibold">Send files</h1>
        <div className="grid gap-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <form onSubmit={onUpload} className="grid gap-3">
            <label className="text-sm text-muted-foreground">Choose files to share</label>
            <input name="files" type="file" multiple onChange={onFilesChange} className="block w-full rounded-md border border-[hsl(var(--border))] bg-transparent p-3" />
            <button
              disabled={uploading || !hasFilesSelected}
              className="inline-flex w-fit items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload files"}
            </button>
          </form>

          {message && <p className="text-sm text-muted-foreground">{message}</p>}

          {session && (
            <div className="grid items-center gap-6 md:grid-cols-[220px_1fr]">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="rounded-lg bg-white p-3 dark:bg-white">
                  <QRCode value={session.url} size={180} fgColor="#0a0a0a" bgColor="#ffffff" />
                </div>
                <div className="text-xs text-muted-foreground">Scan to receive</div>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">Code</div>
                  <div className="rounded-md bg-muted px-3 py-1.5 text-lg font-mono tracking-widest">{session.code}</div>
                  <button
                    onClick={() => navigator.clipboard.writeText(session.url)}
                    className="ml-auto rounded-md border border-[hsl(var(--border))] px-3 py-1 text-sm hover:opacity-85"
                  >
                    Copy link
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">This code expires in 15 minutes.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
