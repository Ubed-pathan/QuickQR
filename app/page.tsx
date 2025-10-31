import Link from "next/link";

export default function Home() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-primary/10 dark:to-primary/20" />
      <section className="container grid min-h-[calc(100svh-3.5rem)] place-items-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Share files instantly with code or QR
          </h1>
          <p className="mt-4 text-muted-foreground">
            Send any file securely with a 6‑digit code or QR. No sign up. Works on any device, dark & light mode.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/send" className="rounded-md bg-primary px-5 py-3 text-primary-foreground shadow hover:opacity-90">
              Send files
            </Link>
            <Link href="/receive" className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3 hover:opacity-90">
              Receive files
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
