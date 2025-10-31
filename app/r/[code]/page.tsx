import { redirect } from "next/navigation";

export default async function RedirectPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  redirect(`/receive?code=${encodeURIComponent(code)}`);
}
