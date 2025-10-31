import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickQR — Simple, secure file sharing",
  description: "Send and receive files with a 6‑digit code or QR, dark/light, no signup.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/70">
            <div className="container flex h-14 items-center justify-between">
              <Link href="/" className="font-semibold">QuickQR</Link>
              <nav className="flex items-center gap-3 text-sm">
                <Link href="/send" className="hover:opacity-80">Send</Link>
                <Link href="/receive" className="hover:opacity-80">Receive</Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
