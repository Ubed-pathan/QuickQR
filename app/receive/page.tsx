"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type StatusResp = { exists: boolean; files?: { name: string; size: number; type: string }[]; expiresAt?: number };

function ReceiveInner() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<StatusResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sp = useSearchParams();

  useEffect(() => {
    const c = sp.get("code");
    if (c) setCode(c);
  }, [sp]);

  async function check() {
    setError(null);
    setStatus(null);
    if (!code) return;
    const res = await fetch(`/api/status?code=${encodeURIComponent(code)}`);
    const data = await res.json();
    if (!res.ok) setError(data?.error || "Not found");
    setStatus(data);
  }

  const downloadHref = useMemo(() => (code ? `/api/download/${encodeURIComponent(code)}` : "#"), [code]);

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <h1 className="text-3xl font-semibold">Receive files</h1>
      <div className="grid gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-3">
            <label className="text-sm text-muted-foreground">Enter 6‑digit code</label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={code}
              onChange={(e) => setCode((e.target as HTMLInputElement).value.replace(/\D/g, "").slice(0, 6))}
              className="w-full rounded-md border border-[hsl(var(--border))] bg-transparent p-3 text-lg tracking-[0.5em]"
              placeholder="______"
            />
            <button onClick={check} className="w-fit rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">
              Check & prepare
            </button>
          </div>
          <div className="grid gap-2">
            <div className="text-sm text-muted-foreground">Or scan QR with your camera</div>
            <div className="rounded-md border border-[hsl(var(--border))] p-4 text-sm text-muted-foreground">
              Open your phone's camera and point at the sender's QR. Tap the link that appears. You'll land here with the code filled in.
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {status?.exists && (
          <div className="rounded-md border border-[hsl(var(--border))] p-4">
            <div className="mb-2 text-sm font-medium">Files ready:</div>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
              {status.files!.map((f) => (
                <li key={f.name}>
                  {f.name} <span className="opacity-60">({Math.round(f.size / 1024)} KB)</span>
                </li>
              ))}
            </ul>
            <a
              href={downloadHref}
              className="mt-3 inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReceivePage() {
  return (
    <main className="container py-10">
      <Suspense fallback={<div>Loading…</div>}>
        <ReceiveInner />
      </Suspense>
    </main>
  );
}
