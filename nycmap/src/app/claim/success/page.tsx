"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { formatMoney } from "@/lib/pricing";
import { OwnedBlock } from "@/types";
import { rememberBoughtLots, saveGiftCode } from "@/lib/buyer";

function SuccessBody() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") ?? "";
  const [state, setState] = useState<"loading" | "paid" | "pending" | "error">("loading");
  const [claim, setClaim] = useState<OwnedBlock | null>(null);
  const [count, setCount] = useState(0);
  const [giftCode, setGiftCode] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setMessage("Missing checkout session.");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const res = await fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setState("error");
          setMessage(data.error || "Could not verify payment.");
          return;
        }
        if (data.giftCode) setGiftCode(data.giftCode);
        if (data.count) setCount(data.count);
        if (data.neighborhoodName) setNeighborhood(data.neighborhoodName);
        if (data.ownerName) setOwnerName(data.ownerName);
        if (Array.isArray(data.lots)) rememberBoughtLots(data.lots);
        if (data.claimed && data.claim) {
          setClaim(data.claim);
          rememberBoughtLots([data.claim.id]);
          saveGiftCode("");
          setState("paid");
          return;
        }
        if (data.payment_status === "paid") {
          attempts += 1;
          if (attempts < 12) {
            setState("pending");
            setTimeout(poll, 800);
            return;
          }
          saveGiftCode("");
          setState("paid");
          return;
        }
        setState("error");
        setMessage("Payment is not complete yet.");
      } catch {
        if (!cancelled) {
          setState("error");
          setMessage("Could not verify payment.");
        }
      }
    };

    void poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/share/${sessionId}`;
  const giftUrl = giftCode ? `${origin}/?gift=${giftCode}` : "";
  const tweet = useMemo(() => {
    const place = neighborhood || claim?.neighborhoodName || "New York";
    const n = count || 1;
    const who = ownerName || claim?.ownerName || "I";
    const text =
      n > 1
        ? `${who} just claimed ${n} lots in ${place} on NYC MAP.`
        : `${who} just planted a flag in ${place} on NYC MAP.`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
  }, [neighborhood, claim, count, ownerName, shareUrl]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f6f4ef] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-[#e4e0d8] bg-white p-8 text-center shadow-sm">
        {state === "loading" || state === "pending" ? (
          <>
            <p className="font-serif text-2xl text-[#141414]">Recording your deed…</p>
            <p className="mt-2 text-[13px] text-[#6b6560]">Waiting for Stripe to confirm the payment.</p>
          </>
        ) : state === "error" ? (
          <>
            <p className="font-serif text-2xl text-[#141414]">We couldn’t confirm that yet</p>
            <p className="mt-2 text-[13px] text-[#6b6560]">{message}</p>
          </>
        ) : (
          <>
            <p className="font-serif text-2xl text-[#141414]">You&apos;re on the map.</p>
            {claim ? (
              <p className="mt-2 text-[13px] text-[#6b6560]">
                {claim.neighborhoodName} · {claim.id} · {formatMoney(claim.price)}
                {count > 1 ? ` · ${count} lots` : ""}
              </p>
            ) : (
              <p className="mt-2 text-[13px] text-[#6b6560]">Payment received. The map will catch up in a moment.</p>
            )}
            <div className="mt-5 grid gap-2">
              <a
                href={tweet}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#141414] py-3 text-[13px] font-medium text-[#141414] hover:bg-[#f6f4ef]"
              >
                Post the share card
              </a>
              <a
                href={`/share/${sessionId}/opengraph-image`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#f6f4ef] py-3 text-[13px] font-medium text-[#141414]"
              >
                Download the card
              </a>
            </div>
            {giftCode ? (
              <div className="mt-5 rounded-2xl border border-[#e4e0d8] bg-[#f6f4ef] px-4 py-3 text-left">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#8a847e]">Gift a lot</p>
                <p className="mt-1 text-[13px] text-[#5c574f]">
                  Send this code. A friend gets $1 off their first bundle. You can’t redeem your own.
                </p>
                <p className="font-serif mt-2 text-2xl tracking-[0.12em] text-[#141414]">{giftCode}</p>
                <button
                  type="button"
                  className="mt-2 text-[12px] font-medium text-[#141414] underline underline-offset-2"
                  onClick={() => {
                    void navigator.clipboard.writeText(giftUrl || giftCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? "Copied" : "Copy gift link"}
                </button>
              </div>
            ) : null}
          </>
        )}
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#141414] py-3 text-[13px] font-medium text-white hover:bg-black"
        >
          Back to the map
        </Link>
        <p className="mt-3 text-[10px] leading-relaxed text-[#8a847e]">
          Receipts and bank statements may show SportBusy LLC. The charge description is NYC MAP.
        </p>
      </div>
    </main>
  );
}

export default function ClaimSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center bg-[#f6f4ef]">
          <p className="font-serif text-lg text-[#8a847e]">Loading…</p>
        </main>
      }
    >
      <SuccessBody />
    </Suspense>
  );
}
