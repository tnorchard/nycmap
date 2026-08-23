"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { formatMoney } from "@/lib/pricing";
import { OwnedBlock } from "@/types";

function SuccessBody() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") ?? "";
  const [state, setState] = useState<"loading" | "paid" | "pending" | "error">("loading");
  const [claim, setClaim] = useState<OwnedBlock | null>(null);
  const [message, setMessage] = useState("");

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
        if (data.claimed && data.claim) {
          setClaim(data.claim);
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

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f6f4ef] px-4">
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
              </p>
            ) : (
              <p className="mt-2 text-[13px] text-[#6b6560]">Payment received. The map will catch up in a moment.</p>
            )}
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
