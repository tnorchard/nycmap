"use client";

import { useEffect, useState } from "react";

const VISITOR_KEY = "nycmap-visitor-id";
const COUNTED_KEY = "nycmap-visitor-counted";

function visitorId() {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `v_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  localStorage.setItem(VISITOR_KEY, id);
  return id;
}

export function usePresence() {
  const [online, setOnline] = useState(1);
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const id = visitorId();
    const isNewVisitor = !localStorage.getItem(COUNTED_KEY);

    const ping = async () => {
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: id, isNewVisitor: isNewVisitor && !localStorage.getItem(COUNTED_KEY) }),
        });
        const data = (await res.json()) as { online?: number; visitors?: number };
        if (cancelled) return;
        if (typeof data.online === "number") setOnline(Math.max(1, data.online));
        if (typeof data.visitors === "number") setVisitors(data.visitors);
        if (isNewVisitor) localStorage.setItem(COUNTED_KEY, "1");
      } catch {
        /* keep last known counts */
      }
    };

    void ping();
    const timer = window.setInterval(ping, 20000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return { online, visitors };
}
