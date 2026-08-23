import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}): Promise<Metadata> {
  const { sessionId } = await params;
  return {
    title: "I just claimed NYC",
    description: "A digital souvenir on the New York tax-lot map.",
    openGraph: { images: [`/share/${sessionId}/opengraph-image`] },
    twitter: { card: "summary_large_image", images: [`/share/${sessionId}/opengraph-image`] },
  };
}

export default async function SharePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f6f4ef] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#e4e0d8] bg-white p-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847e]">NYC MAP</p>
        <h1 className="font-serif mt-2 text-3xl text-[#141414]">Someone just planted a flag.</h1>
        <p className="mt-2 text-[13px] text-[#6b6560]">Open the map and see who owns the block.</p>
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#141414] py-3 text-[13px] font-medium text-white"
        >
          Open the map
        </Link>
        <p className="mt-3 text-[10px] text-[#8a847e]">Share card for {sessionId.slice(0, 12)}…</p>
      </div>
    </main>
  );
}
