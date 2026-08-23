import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!client) {
    client = new Stripe(key, {
      appInfo: {
        name: "NYC MAP",
        url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      },
    });
  }
  return client;
}

export function appBaseUrl() {
  const fromEnv = (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function integrationIdentifier(prefix: string) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let suffix = "";
  for (let i = 0; i < 8; i++) {
    suffix += letters[Math.floor(Math.random() * letters.length)];
  }
  return `${prefix}_${suffix}`;
}
